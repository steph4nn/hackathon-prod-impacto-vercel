/**
 * Script de teste para integração WhatsApp + OpenAI
 * 
 * Este script testa o fluxo completo:
 * 1. Simula o recebimento de uma resposta
 * 2. Envia para análise da OpenAI
 * 3. Exibe a classificação
 */

const testResponses = [
  {
    name: "Teste 1 - Falta Explicada (Doença)",
    response: "Ele está com febre alta desde ontem à noite. Já levei no posto mas não tinha médico.",
    expectedCategory: "explained"
  },
  {
    name: "Teste 2 - Alerta (Transporte)",
    response: "O ônibus não passou hoje. Já é a terceira vez esse mês que isso acontece.",
    expectedCategory: "attention"
  },
  {
    name: "Teste 3 - Alerta (Bullying/Financeiro)",
    response: "Ela não quer mais ir pra escola. Disse que os colegas ficam zoando dela por causa do uniforme velho. Estou sem dinheiro pra comprar novo.",
    expectedCategory: "attention"
  },
  {
    name: "Teste 4 - Falta Explicada (Consulta)",
    response: "Bom dia! Ela foi ao dentista hoje de manhã, consulta marcada há muito tempo. Volta pra aula amanhã.",
    expectedCategory: "explained"
  },
  {
    name: "Teste 5 - Alerta (Área de Risco)",
    response: "Teve tiroteio aqui perto de manhã cedo, não consegui levar ele na escola. É perigoso passar na rua principal quando tem operação.",
    expectedCategory: "attention"
  }
]

async function testInterpretation(testCase) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🧪 ${testCase.name}`)
  console.log(`${'='.repeat(60)}`)
  console.log(`📝 Resposta da Mãe: "${testCase.response}"`)
  
  try {
    const response = await fetch('http://localhost:3000/api/absence-notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'interpret-response',
        notificationId: 'test-' + Date.now(),
        motherResponse: testCase.response
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    const interpretation = data.interpretation

    console.log(`\n🤖 Análise da IA:`)
    console.log(`   Categoria: ${interpretation.category}`)
    console.log(`   Resumo: ${interpretation.summary}`)
    console.log(`   Requer Ação: ${interpretation.requiresAction ? 'Sim' : 'Não'}`)
    
    if (interpretation.suggestedAction) {
      console.log(`   Ação Sugerida: ${interpretation.suggestedAction}`)
    }

    // Verifica se a categoria está correta
    const isCorrect = interpretation.category === testCase.expectedCategory
    console.log(`\n${isCorrect ? '✅' : '❌'} Resultado: ${isCorrect ? 'PASSOU' : 'FALHOU'}`)
    console.log(`   Esperado: ${testCase.expectedCategory}`)
    console.log(`   Obtido: ${interpretation.category}`)

    return isCorrect
  } catch (error) {
    console.error(`\n❌ Erro no teste: ${error.message}`)
    return false
  }
}

async function runAllTests() {
  console.log(`\n${'#'.repeat(60)}`)
  console.log(`# 🚀 Iniciando testes de integração WhatsApp + OpenAI`)
  console.log(`${'#'.repeat(60)}\n`)

  // Verifica se o servidor está rodando
  try {
    await fetch('http://localhost:3000/api/absence-notifications')
  } catch (error) {
    console.error('❌ Erro: Servidor não está rodando!')
    console.error('   Execute "npm run dev" primeiro')
    process.exit(1)
  }

  // Verifica se a OpenAI API está configurada
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Erro: OPENAI_API_KEY não configurada!')
    console.error('   Configure a variável de ambiente no arquivo .env.local')
    process.exit(1)
  }

  let passed = 0
  let failed = 0

  for (const testCase of testResponses) {
    const result = await testInterpretation(testCase)
    if (result) {
      passed++
    } else {
      failed++
    }
    
    // Aguarda um pouco entre os testes para não sobrecarregar a API
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`\n${'#'.repeat(60)}`)
  console.log(`# 📊 Resultados Finais`)
  console.log(`${'#'.repeat(60)}`)
  console.log(`✅ Testes Passou: ${passed}`)
  console.log(`❌ Testes Falhou: ${failed}`)
  console.log(`📈 Taxa de Sucesso: ${((passed / testResponses.length) * 100).toFixed(1)}%`)
  console.log(`${'#'.repeat(60)}\n`)

  if (failed === 0) {
    console.log('🎉 Todos os testes passaram! Sistema funcionando perfeitamente!')
  } else {
    console.log('⚠️  Alguns testes falharam. Revise a configuração da IA.')
  }
}

// Executa os testes
runAllTests().catch(error => {
  console.error('❌ Erro fatal:', error)
  process.exit(1)
})

