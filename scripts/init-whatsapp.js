/**
 * Script para inicializar o WhatsApp automaticamente
 * 
 * Este script é executado quando o servidor inicia para
 * preparar o cliente WhatsApp para receber mensagens
 */

async function initWhatsApp() {
  console.log('\n' + '='.repeat(60))
  console.log('📱 Inicializando WhatsApp Client...')
  console.log('='.repeat(60) + '\n')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    // Verifica se o servidor está rodando
    console.log('🔍 Verificando servidor...')
    const healthCheck = await fetch(baseUrl)
    if (!healthCheck.ok) {
      throw new Error('Servidor não está respondendo')
    }
    console.log('✅ Servidor está rodando\n')

    // Inicializa o WhatsApp
    console.log('🚀 Iniciando cliente WhatsApp...')
    const initResponse = await fetch(`${baseUrl}/api/whatsapp/init`)
    const initData = await initResponse.json()
    
    if (initData.success) {
      console.log('✅ WhatsApp inicializado com sucesso!')
      console.log('   ' + initData.message + '\n')
    } else {
      console.log('⚠️  WhatsApp pode já estar inicializado\n')
    }

    // Aguarda 3 segundos e verifica o status
    console.log('⏳ Aguardando inicialização...')
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Verifica status
    console.log('🔍 Verificando status da conexão...')
    const statusResponse = await fetch(`${baseUrl}/api/whatsapp/init?action=status`)
    const statusData = await statusResponse.json()

    console.log('\n' + '-'.repeat(60))
    console.log('📊 Status da Conexão WhatsApp:')
    console.log('-'.repeat(60))
    console.log(`   Status: ${statusData.ready ? '✅ Conectado' : '⏳ Aguardando conexão'}`)
    console.log(`   Mensagem: ${statusData.message}`)
    
    if (statusData.qrCode) {
      console.log('\n⚠️  QR CODE NECESSÁRIO!')
      console.log('   Acesse: http://localhost:3000/whatsapp')
      console.log('   E escaneie o QR Code para conectar\n')
    } else if (statusData.ready) {
      console.log('\n🎉 Sistema pronto para enviar e receber mensagens!')
      console.log('   As respostas serão processadas automaticamente pela IA\n')
    } else {
      console.log('\n⏳ Aguardando autenticação...')
      console.log('   Acesse: http://localhost:3000/whatsapp\n')
    }

    console.log('-'.repeat(60) + '\n')

    // Informações adicionais
    console.log('💡 Próximos passos:')
    console.log('   1. Acesse http://localhost:3000/whatsapp para gerenciar a conexão')
    console.log('   2. Se necessário, escaneie o QR Code')
    console.log('   3. Acesse http://localhost:3000/notificacoes para enviar notificações')
    console.log('   4. As respostas serão processadas automaticamente\n')

  } catch (error) {
    console.error('\n❌ Erro ao inicializar WhatsApp:', error.message)
    console.error('   Certifique-se de que o servidor está rodando (npm run dev)\n')
  }
}

// Auto-execução com delay para dar tempo do servidor iniciar
setTimeout(() => {
  initWhatsApp().catch(console.error)
}, 5000) // Aguarda 5 segundos após o servidor iniciar

