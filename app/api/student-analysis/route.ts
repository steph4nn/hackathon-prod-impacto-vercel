import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { getStudentById } from "@/lib/mock-data"

// Configurar o provedor OpenAI
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { studentId } = await req.json()

  const student = getStudentById(studentId)

  if (!student) {
    return Response.json({ error: "Student not found" }, { status: 404 })
  }

  // Build context for the AI
  const studentContext = `
Student: ${student.name}
Class: ${student.class}
Average Grade: ${student.grade.toFixed(1)}/10
Attendance: ${student.attendance}%
Risk Level: ${student.risk}

Recent Grades History:
${student.gradesHistory.map((g) => `- ${g.month}: ${g.grade}`).join("\n")}

Subject Performance:
${student.subjectGrades.map((s) => `- ${s.subject}: ${s.grade.toFixed(1)}`).join("\n")}

Current Alerts:
${student.alerts.length > 0 ? student.alerts.map((a) => `- ${a}`).join("\n") : "No alerts"}
  `.trim()

  try {
    const { text } = await generateText({
      model: openai("gpt-5-mini"),
      prompt: `Você é um coordenador pedagógico experiente analisando dados de desempenho de alunos.

${studentContext}

Com base nos dados deste aluno, forneça:

### 1. Resumo do Status Acadêmico
Um breve resumo do status acadêmico atual do aluno (2-3 frases)

### 2. Forças e Áreas de Preocupação
- **Forças:** Liste os pontos fortes do aluno
- **Áreas de Preocupação:** Liste as dificuldades identificadas

### 3. Recomendações para Professores/Coordenadores
Recomendações específicas e acionáveis para ajudar este aluno a ter sucesso

Seja conciso, profissional e foque em intervenções práticas. Sempre responda em português do Brasil.`,
      maxOutputTokens: 1000,
      temperature: 0.7,
    })

    return Response.json({ analysis: text })
  } catch (error) {
    console.error("Error generating student analysis:", error)
    return Response.json({ error: "Failed to generate analysis" }, { status: 500 })
  }
}
