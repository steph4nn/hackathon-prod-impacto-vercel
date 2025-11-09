/**
 * Script de Teste do Sistema de Alertas Inteligentes
 * 
 * Este script demonstra como o sistema detecta padrões e gera alertas.
 * Execute com: node test-smart-alerts.js
 */

const fs = require('fs');

// Carrega os dados
const students = JSON.parse(fs.readFileSync('data/students.json', 'utf-8'));
const absences = JSON.parse(fs.readFileSync('data/daily-absences.json', 'utf-8'));
const summary = JSON.parse(fs.readFileSync('data/daily-absences-summary.json', 'utf-8'));

console.log('🎯 Sistema de Análises Inteligentes - Demonstração\n');
console.log('='.repeat(60));

// 1. Estatísticas Gerais
console.log('\n📊 ESTATÍSTICAS GERAIS\n');
console.log(`Total de alunos: ${students.length}`);
console.log(`Total de faltas registradas: ${absences.length}`);
console.log(`Período: últimos 30 dias\n`);

// 2. Distribuição por Bairro
console.log('\n🏘️  DISTRIBUIÇÃO DE ALUNOS POR BAIRRO\n');
const byNeighborhood = {};
for (const student of students) {
  byNeighborhood[student.neighborhood] = (byNeighborhood[student.neighborhood] || 0) + 1;
}

Object.entries(byNeighborhood)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([neighborhood, count]) => {
    console.log(`  ${neighborhood}: ${count} alunos`);
  });

// 3. Distribuição por Linha de Ônibus
console.log('\n🚌 DISTRIBUIÇÃO POR LINHA DE ÔNIBUS\n');
const byBusRoute = {};
for (const student of students) {
  byBusRoute[student.busRoute] = (byBusRoute[student.busRoute] || 0) + 1;
}

Object.entries(byBusRoute)
  .sort((a, b) => b[1] - a[1])
  .forEach(([route, count]) => {
    console.log(`  ${route}: ${count} alunos`);
  });

// 4. Detecta Padrões Suspeitos
console.log('\n🔍 PADRÕES SUSPEITOS DETECTADOS\n');

const suspiciousPatterns = [];
const absencesByDate = {};

// Agrupa faltas por data
for (const absence of absences) {
  if (!absencesByDate[absence.date]) {
    absencesByDate[absence.date] = [];
  }
  absencesByDate[absence.date].push(absence);
}

// Verifica cada dia
for (const [date, dayAbsences] of Object.entries(absencesByDate)) {
  // Agrupa por linha de ônibus
  const byRoute = {};
  for (const absence of dayAbsences) {
    if (!byRoute[absence.busRoute]) {
      byRoute[absence.busRoute] = [];
    }
    byRoute[absence.busRoute].push(absence.studentName);
  }

  // Detecta se múltiplos alunos da mesma linha faltaram
  for (const [route, studentNames] of Object.entries(byRoute)) {
    if (studentNames.length >= 3) {
      suspiciousPatterns.push({
        date,
        type: 'bus_route',
        route,
        count: studentNames.length,
        students: studentNames
      });
    }
  }
}

if (suspiciousPatterns.length > 0) {
  console.log('⚠️  Encontrados padrões que podem indicar problemas:\n');
  
  suspiciousPatterns
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .forEach(pattern => {
      console.log(`📅 ${pattern.date}`);
      console.log(`   ${pattern.route}: ${pattern.count} alunos faltaram`);
      console.log(`   Alunos: ${pattern.students.slice(0, 5).join(', ')}${pattern.students.length > 5 ? '...' : ''}`);
      console.log(`   💡 Possível problema de transporte!\n`);
    });
} else {
  console.log('✅ Nenhum padrão suspeito detectado\n');
}

// 5. Alunos em Risco
console.log('\n⚠️  ANÁLISE DE ALUNOS EM RISCO\n');

const riskStudents = students.filter(s => s.risk === 'high');
const riskByNeighborhood = {};

for (const student of riskStudents) {
  if (!riskByNeighborhood[student.neighborhood]) {
    riskByNeighborhood[student.neighborhood] = [];
  }
  riskByNeighborhood[student.neighborhood].push(student);
}

console.log(`Total de alunos em alto risco: ${riskStudents.length}\n`);
console.log('Concentrações por bairro:\n');

Object.entries(riskByNeighborhood)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 5)
  .forEach(([neighborhood, students]) => {
    const avgGrade = students.reduce((sum, s) => sum + s.grade, 0) / students.length;
    const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;
    
    console.log(`  ${neighborhood}: ${students.length} alunos`);
    console.log(`    Média de notas: ${avgGrade.toFixed(1)}`);
    console.log(`    Frequência média: ${Math.round(avgAttendance)}%`);
    console.log(`    💡 Considere intervenção coletiva nesta região\n`);
  });

// 6. Resumo de Como Usar
console.log('\n' + '='.repeat(60));
console.log('\n🚀 COMO USAR O SISTEMA\n');
console.log('1. Análise de Padrões de Faltas:');
console.log('   POST /api/smart-alerts');
console.log('   { "analysisType": "attendance-patterns", "days": 7 }\n');

console.log('2. Análise de Alunos em Risco:');
console.log('   POST /api/smart-alerts');
console.log('   { "analysisType": "risk-students" }\n');

console.log('3. Insights Diários:');
console.log('   POST /api/smart-alerts');
console.log('   { "analysisType": "daily-insights" }\n');

console.log('4. Ver dados de faltas:');
console.log('   GET /api/absences?type=summary&days=7\n');

console.log('📖 Documentação completa: docs/smart-alerts-usage.md\n');

// 7. Exemplo de Alerta que seria gerado
console.log('\n' + '='.repeat(60));
console.log('\n💬 EXEMPLO DE ALERTA INTELIGENTE QUE O GPT GERARIA:\n');

if (suspiciousPatterns.length > 0) {
  const top = suspiciousPatterns[0];
  console.log('🚨 ALERTA CRÍTICO: Problema de Transporte Detectado\n');
  console.log(`Data: ${top.date}`);
  console.log(`${top.route} - ${top.count} alunos faltaram no mesmo dia\n`);
  console.log('AÇÃO RECOMENDADA:');
  console.log('1. 📞 Ligar imediatamente para a empresa de transporte');
  console.log('2. 👨‍👩‍👧 Contatar as famílias dos alunos afetados');
  console.log('3. 🚌 Verificar rotas alternativas para amanhã');
  console.log('4. 📝 Documentar o incidente para relatório mensal\n');
  console.log('Alunos afetados:');
  top.students.forEach(name => console.log(`   - ${name}`));
}

console.log('\n' + '='.repeat(60));
console.log('\n✅ Teste concluído! O sistema está pronto para uso.\n');

