import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { 
  students, 
  dailyAbsences, 
  dailyAbsencesSummary,
  getRecentAbsencesSummary,
  getAbsencesByDate 
} from "@/lib/mock-data"

// Configurar o provedor OpenAI
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { analysisType, date, days = 7 } = await req.json()

  try {
    if (analysisType === "attendance-patterns") {
      return await analyzeAttendancePatterns(date, days)
    } else if (analysisType === "risk-students") {
      return await analyzeRiskStudents()
    } else if (analysisType === "daily-insights") {
      return await analyzeDailyInsights(date)
    } else if (analysisType === "academic-performance") {
      return await analyzeAcademicPerformance()
    } else {
      return Response.json({ error: "Invalid analysis type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error generating smart analysis:", error)
    return Response.json({ error: "Failed to generate analysis" }, { status: 500 })
  }
}

async function analyzeAttendancePatterns(specificDate?: string, days: number = 7) {
  // Pega os dados recentes de faltas
  const recentSummary = getRecentAbsencesSummary(days)
  
  // Analisa padrões por região e linha de ônibus
  const busRoutePatterns: Record<string, { count: number; dates: string[]; students: string[] }> = {}
  const neighborhoodPatterns: Record<string, { count: number; dates: string[]; students: string[] }> = {}
  
  const absencesToAnalyze = specificDate 
    ? dailyAbsences.filter(a => a.date === specificDate)
    : dailyAbsences

  for (const absence of absencesToAnalyze) {
    // Agrupa por linha de ônibus
    if (!busRoutePatterns[absence.busRoute]) {
      busRoutePatterns[absence.busRoute] = { count: 0, dates: [], students: [] }
    }
    busRoutePatterns[absence.busRoute].count++
    if (!busRoutePatterns[absence.busRoute].dates.includes(absence.date)) {
      busRoutePatterns[absence.busRoute].dates.push(absence.date)
    }
    if (!busRoutePatterns[absence.busRoute].students.includes(absence.studentName)) {
      busRoutePatterns[absence.busRoute].students.push(absence.studentName)
    }

    // Agrupa por bairro
    if (!neighborhoodPatterns[absence.neighborhood]) {
      neighborhoodPatterns[absence.neighborhood] = { count: 0, dates: [], students: [] }
    }
    neighborhoodPatterns[absence.neighborhood].count++
    if (!neighborhoodPatterns[absence.neighborhood].dates.includes(absence.date)) {
      neighborhoodPatterns[absence.neighborhood].dates.push(absence.date)
    }
    if (!neighborhoodPatterns[absence.neighborhood].students.includes(absence.studentName)) {
      neighborhoodPatterns[absence.neighborhood].students.push(absence.studentName)
    }
  }

  // Identifica padrões suspeitos (múltiplas faltas na mesma região/linha no mesmo dia)
  const suspiciousPatterns = []
  
  for (const [route, data] of Object.entries(busRoutePatterns)) {
    // Agrupa por data para ver se há dias com muitas faltas da mesma linha
    const absencesByDate: Record<string, string[]> = {}
    for (const absence of absencesToAnalyze.filter(a => a.busRoute === route)) {
      if (!absencesByDate[absence.date]) {
        absencesByDate[absence.date] = []
      }
      absencesByDate[absence.date].push(absence.studentName)
    }
    
    for (const [date, studentNames] of Object.entries(absencesByDate)) {
      if (studentNames.length >= 3) {
        suspiciousPatterns.push({
          type: "bus_route",
          route,
          date,
          count: studentNames.length,
          students: studentNames
        })
      }
    }
  }

  for (const [neighborhood, data] of Object.entries(neighborhoodPatterns)) {
    const absencesByDate: Record<string, string[]> = {}
    for (const absence of absencesToAnalyze.filter(a => a.neighborhood === neighborhood)) {
      if (!absencesByDate[absence.date]) {
        absencesByDate[absence.date] = []
      }
      absencesByDate[absence.date].push(absence.studentName)
    }
    
    for (const [date, studentNames] of Object.entries(absencesByDate)) {
      if (studentNames.length >= 3) {
        suspiciousPatterns.push({
          type: "neighborhood",
          neighborhood,
          date,
          count: studentNames.length,
          students: studentNames
        })
      }
    }
  }

  // Monta o contexto para o GPT
  const context = `
Análise de Padrões de Faltas Escolares
${specificDate ? `Data específica: ${specificDate}` : `Últimos ${days} dias`}

Padrões Suspeitos Detectados:
${suspiciousPatterns.length > 0 
  ? suspiciousPatterns.map(p => {
      if (p.type === "bus_route") {
        return `- ${p.date}: ${p.count} alunos da ${p.route} faltaram no mesmo dia
  Alunos: ${p.students.slice(0, 5).join(", ")}${p.students.length > 5 ? ` e mais ${p.students.length - 5}...` : ""}`
      } else {
        return `- ${p.date}: ${p.count} alunos do bairro ${p.neighborhood} faltaram no mesmo dia
  Alunos: ${p.students.slice(0, 5).join(", ")}${p.students.length > 5 ? ` e mais ${p.students.length - 5}...` : ""}`
      }
    }).join("\n")
  : "Nenhum padrão suspeito detectado"
}

Resumo Recente (últimos ${recentSummary.length} dias úteis):
${recentSummary.map(s => `- ${s.date}: ${s.totalAbsences} faltas`).join("\n")}

Linhas de Ônibus com Mais Faltas:
${Object.entries(busRoutePatterns)
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 5)
  .map(([route, data]) => `- ${route}: ${data.count} faltas (${data.students.length} alunos diferentes)`)
  .join("\n")}
  `.trim()

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Você é um coordenador educacional experiente analisando padrões de faltas escolares.

${context}

IMPORTANTE: Sua resposta DEVE seguir EXATAMENTE este formato com as seções marcadas com ###:

### 1. ALERTAS PRIORITÁRIOS

[Identifique os padrões mais críticos que requerem ação imediata, como problemas de transporte ou situações na região. Use emojis para destacar urgência: 🚨 crítico, ⚠️ atenção]

### 2. AÇÕES RECOMENDADAS

[Para cada alerta identificado, sugira ações específicas e práticas:
- Como abordar o problema (ex: ligar para empresa de ônibus, verificar situação no bairro)
- Quais alunos/famílias contatar primeiro
- Se é necessário envolver outros setores (transporte escolar, assistência social, etc.)]

### 3. CONTEXTO

[Explique brevemente o que esses padrões podem indicar e informações adicionais relevantes]

Seja direto, prático e focado em ações concretas que a gestora pode executar.`,
    maxOutputTokens: 1500,
    temperature: 0.7,
  })

  return Response.json({
    analysis: text,
    patterns: suspiciousPatterns,
    summary: {
      totalAbsences: absencesToAnalyze.length,
      uniqueStudents: new Set(absencesToAnalyze.map(a => a.studentId)).size,
      affectedBusRoutes: Object.keys(busRoutePatterns).length,
      affectedNeighborhoods: Object.keys(neighborhoodPatterns).length
    }
  })
}

async function analyzeRiskStudents() {
  // Pega alunos em risco
  const riskStudents = students.filter(s => s.risk === "high" || s.risk === "medium")
  
  // Agrupa por características comuns
  const byNeighborhood: Record<string, typeof riskStudents> = {}
  const byClass: Record<string, typeof riskStudents> = {}
  const byBusRoute: Record<string, typeof riskStudents> = {}
  
  for (const student of riskStudents) {
    if (!byNeighborhood[student.neighborhood]) byNeighborhood[student.neighborhood] = []
    byNeighborhood[student.neighborhood].push(student)
    
    if (!byClass[student.class]) byClass[student.class] = []
    byClass[student.class].push(student)
    
    if (!byBusRoute[student.busRoute]) byBusRoute[student.busRoute] = []
    byBusRoute[student.busRoute].push(student)
  }

  const context = `
Análise de Alunos em Risco

Total de alunos em risco: ${riskStudents.length}
- Alto risco: ${riskStudents.filter(s => s.risk === "high").length}
- Médio risco: ${riskStudents.filter(s => s.risk === "medium").length}

Distribuição por Bairro (top 5):
${Object.entries(byNeighborhood)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 5)
  .map(([neighborhood, students]) => 
    `- ${neighborhood}: ${students.length} alunos (${students.filter(s => s.risk === "high").length} alto risco)`
  )
  .join("\n")}

Distribuição por Turma (top 5):
${Object.entries(byClass)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 5)
  .map(([className, students]) => 
    `- ${className}: ${students.length} alunos (média ${(students.reduce((sum, s) => sum + s.grade, 0) / students.length).toFixed(1)}, frequência ${Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%)`
  )
  .join("\n")}

Alunos Críticos (top 10):
${riskStudents
  .sort((a, b) => {
    // Ordena por risco e depois por nota
    if (a.risk === "high" && b.risk !== "high") return -1
    if (a.risk !== "high" && b.risk === "high") return 1
    return a.grade - b.grade
  })
  .slice(0, 10)
  .map(s => `- ${s.name} (${s.class}): nota ${s.grade}, frequência ${s.attendance}%, ${s.neighborhood}`)
  .join("\n")}
  `.trim()

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Você é um coordenador educacional especializado em prevenção de evasão escolar.

${context}

IMPORTANTE: Sua resposta DEVE seguir EXATAMENTE este formato com as seções marcadas com ###:

### 1. ALERTAS PRIORITÁRIOS

[Identifique concentrações de alunos em risco e padrões críticos que requerem atenção imediata. Use emojis: 🚨 crítico, ⚠️ atenção]

### 2. AÇÕES RECOMENDADAS

[Sugira estratégias específicas de intervenção:
- Ações coletivas para grupos com características similares
- Ações individuais prioritárias para alunos mais críticos
- Como envolver famílias e comunidade
- Recursos necessários (transporte, reforço, assistência social)]

### 3. CONTEXTO

[Explique o panorama geral e informações adicionais sobre os alunos em risco]

Seja estratégico e prático. Priorize ações que podem impactar múltiplos alunos.`,
    maxOutputTokens: 1500,
    temperature: 0.7,
  })

  return Response.json({
    analysis: text,
    statistics: {
      total: riskStudents.length,
      highRisk: riskStudents.filter(s => s.risk === "high").length,
      mediumRisk: riskStudents.filter(s => s.risk === "medium").length,
      byNeighborhood: Object.entries(byNeighborhood)
        .map(([name, students]) => ({ name, count: students.length }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      byClass: Object.entries(byClass)
        .map(([name, students]) => ({ name, count: students.length }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }
  })
}

async function analyzeDailyInsights(date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  const absences = getAbsencesByDate(targetDate)
  
  if (absences.length === 0) {
    return Response.json({
      analysis: "Não há registros de faltas para esta data.",
      hasData: false
    })
  }

  // Análise rápida do dia
  const byBusRoute: Record<string, number> = {}
  const byNeighborhood: Record<string, number> = {}
  const byClass: Record<string, number> = {}
  
  for (const absence of absences) {
    byBusRoute[absence.busRoute] = (byBusRoute[absence.busRoute] || 0) + 1
    byNeighborhood[absence.neighborhood] = (byNeighborhood[absence.neighborhood] || 0) + 1
    byClass[absence.class] = (byClass[absence.class] || 0) + 1
  }

  const context = `
Análise do Dia: ${targetDate}

Total de Faltas: ${absences.length}

Por Linha de Ônibus:
${Object.entries(byBusRoute)
  .sort((a, b) => b[1] - a[1])
  .map(([route, count]) => `- ${route}: ${count} faltas`)
  .join("\n")}

Por Bairro:
${Object.entries(byNeighborhood)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([neighborhood, count]) => `- ${neighborhood}: ${count} faltas`)
  .join("\n")}

Por Turma:
${Object.entries(byClass)
  .sort((a, b) => b[1] - a[1])
  .map(([className, count]) => `- ${className}: ${count} faltas`)
  .join("\n")}
  `.trim()

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Você é um assistente da coordenação escolar analisando as faltas do dia.

${context}

IMPORTANTE: Sua resposta DEVE seguir EXATAMENTE este formato com as seções marcadas com ###:

### 1. ALERTAS PRIORITÁRIOS

[Avalie o status do dia e identifique se há algo que precisa de atenção imediata (ex: muitas faltas de uma linha específica, concentração em um bairro). Use emojis: 🚨 crítico, ⚠️ atenção, ✅ normal]

### 2. AÇÕES RECOMENDADAS

[Liste ações concretas e específicas para executar hoje, priorizando o que é mais urgente]

### 3. CONTEXTO

[Breve análise do panorama geral do dia e comparação com padrões normais]

Seja breve e direto - a gestora precisa de informações rápidas para agir.`,
    maxOutputTokens: 800,
    temperature: 0.7,
  })

  return Response.json({
    analysis: text,
    hasData: true,
    summary: {
      date: targetDate,
      totalAbsences: absences.length,
      byBusRoute,
      byNeighborhood,
      byClass
    }
  })
}

async function analyzeAcademicPerformance() {
  // Calcula estatísticas de desempenho
  const totalStudents = students.length
  const overallAverage = (students.reduce((sum, s) => sum + s.grade, 0) / totalStudents).toFixed(1)
  
  // Classifica alunos por desempenho
  const aboveAverage = students.filter(s => s.grade >= 8.0).length
  const average = students.filter(s => s.grade >= 6.0 && s.grade < 8.0).length
  const belowAverage = students.filter(s => s.grade < 6.0).length
  const critical = students.filter(s => s.grade < 5.0).length
  
  // Análise por matéria
  const subjectPerformance: Record<string, { total: number; count: number; students: number }> = {}
  
  for (const student of students) {
    for (const subjectGrade of student.subjectGrades) {
      if (!subjectPerformance[subjectGrade.subject]) {
        subjectPerformance[subjectGrade.subject] = { total: 0, count: 0, students: 0 }
      }
      subjectPerformance[subjectGrade.subject].total += subjectGrade.grade
      subjectPerformance[subjectGrade.subject].count++
      subjectPerformance[subjectGrade.subject].students++
    }
  }
  
  const subjectAverages = Object.entries(subjectPerformance)
    .map(([subject, data]) => ({
      subject,
      average: Number((data.total / data.count).toFixed(1)),
      students: data.students
    }))
    .sort((a, b) => b.average - a.average)
  
  const topSubjects = subjectAverages.slice(0, 3)
  const bottomSubjects = subjectAverages.slice(-3).reverse()
  
  // Alunos com dificuldades específicas
  const studentsNeedingHelp = students
    .filter(s => s.grade < 7.0)
    .sort((a, b) => a.grade - b.grade)
    .slice(0, 10)
  
  // Análise por turma
  const byClass: Record<string, { total: number; count: number; belowAverage: number }> = {}
  for (const student of students) {
    if (!byClass[student.class]) {
      byClass[student.class] = { total: 0, count: 0, belowAverage: 0 }
    }
    byClass[student.class].total += student.grade
    byClass[student.class].count++
    if (student.grade < 6.0) {
      byClass[student.class].belowAverage++
    }
  }
  
  const classPerformance = Object.entries(byClass)
    .map(([className, data]) => ({
      class: className,
      average: (data.total / data.count).toFixed(1),
      belowAverage: data.belowAverage
    }))
    .sort((a, b) => parseFloat(a.average) - parseFloat(b.average))
  
  const context = `
Análise de Desempenho Acadêmico

Panorama Geral:
- Total de alunos: ${totalStudents}
- Média geral da escola: ${overallAverage}
- Acima da média (≥8.0): ${aboveAverage} alunos (${((aboveAverage/totalStudents)*100).toFixed(1)}%)
- Na média (6.0-7.9): ${average} alunos (${((average/totalStudents)*100).toFixed(1)}%)
- Abaixo da média (<6.0): ${belowAverage} alunos (${((belowAverage/totalStudents)*100).toFixed(1)}%)
- Situação crítica (<5.0): ${critical} alunos

Matérias com Melhor Desempenho:
${topSubjects.map(s => `- ${s.subject}: ${s.average} (${s.students} alunos)`).join("\n")}

Matérias que Precisam de Atenção:
${bottomSubjects.map(s => `- ${s.subject}: ${s.average} (${s.students} alunos)`).join("\n")}

Turmas com Maior Necessidade de Suporte:
${classPerformance.slice(0, 5).map(c => `- ${c.class}: média ${c.average} (${c.belowAverage} alunos abaixo da média)`).join("\n")}

Alunos Prioritários para Intervenção (top 10):
${studentsNeedingHelp.map(s => 
  `- ${s.name} (${s.class}): nota ${s.grade.toFixed(1)} | Dificuldades: ${s.subjectGrades.filter(sg => sg.grade < 6.0).map(sg => sg.subject).join(", ")}`
).join("\n")}
  `.trim()

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Você é um coordenador pedagógico experiente analisando o desempenho acadêmico dos alunos.

${context}

IMPORTANTE: Sua resposta DEVE seguir EXATAMENTE este formato com as seções marcadas com ###:

### 1. ALERTAS PRIORITÁRIOS

[Identifique os principais desafios acadêmicos que requerem atenção imediata:
- Matérias com desempenho crítico
- Turmas que precisam de reforço
- Padrões preocupantes
Use emojis: 🚨 crítico, ⚠️ atenção, ✅ positivo]

### 2. AÇÕES RECOMENDADAS

[Sugira estratégias pedagógicas específicas e práticas:
- Estratégias por matéria (reforço escolar, metodologias diferenciadas, material de apoio)
- Ações por turma (aulas de revisão, monitoria, grupos de estudo)
- Intervenções individualizadas para alunos prioritários
- Como envolver professores e famílias
- Cronograma sugerido de implementação]

### 3. CONTEXTO

[Análise do panorama geral do desempenho acadêmico:
- Pontos fortes a serem valorizados
- Áreas que precisam de desenvolvimento
- Possíveis causas dos baixos desempenhos
- Oportunidades de melhoria]

Seja estratégico e propositivo. Priorize ações que possam impactar positivamente o maior número de alunos.`,
    maxOutputTokens: 1800,
    temperature: 0.7,
  })

  return Response.json({
    analysis: text,
    performanceStats: {
      overallAverage,
      aboveAverage,
      average,
      belowAverage,
      criticalStudents: critical,
      topSubjects: topSubjects.map(s => ({ subject: s.subject, average: s.average })),
      bottomSubjects: bottomSubjects.map(s => ({ subject: s.subject, average: s.average }))
    }
  })
}

