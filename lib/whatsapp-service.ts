/**
 * Serviço de integração com WhatsApp (MOCKADO)
 * 
 * Este serviço simula a conexão com WhatsApp Web para fins de demonstração
 * Em produção, seria integrado com a biblioteca whatsapp-web.js
 */

interface MockMessage {
  from: string
  body: string
  timestamp: Date
  fromMe?: boolean
}

let isReady = false
let qrCode: string | null = null

// Callbacks para eventos
const messageHandlers: Array<(msg: MockMessage) => void> = []

// Mapa de números de telefone para IDs de notificação
const phoneToNotificationMap = new Map<string, string>()

// Dados mockados de mensagens recebidas
const mockIncomingMessages: MockMessage[] = [
  {
    from: '5511987654321@c.us',
    body: 'Oi, o Pedro estava com febre alta ontem, por isso não foi à escola',
    timestamp: new Date()
  },
  {
    from: '5511987654322@c.us',
    body: 'O ônibus não passou hoje de manhã, já é a terceira vez esse mês',
    timestamp: new Date()
  },
  {
    from: '5511987654323@c.us',
    body: 'Tá tudo bem, ele está na escola agora',
    timestamp: new Date()
  }
]

export async function initializeWhatsApp() {
  console.log('🔔 WhatsApp Service (MOCK MODE) - Inicializando...')
  
  // Simula delay de inicialização
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  isReady = true
  qrCode = null
  
  // Simula carregamento de mapeamento
  loadNotificationMapping()
  
  console.log('✅ WhatsApp Mock Client está pronto!')
  
  return null
}

export function getWhatsAppClient() {
  console.log('📱 Retornando WhatsApp Mock Client')
  return null
}

export function isWhatsAppReady() {
  return isReady
}

export function getQRCode() {
  return qrCode
}

export function onMessage(handler: (msg: any) => void) {
  messageHandlers.push(handler)
}

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  if (!isReady) {
    throw new Error('WhatsApp client not ready.')
  }

  try {
    console.log(`📤 [MOCK] Enviando mensagem para ${phoneNumber}: "${message}"`)
    return { success: true, phoneNumber }
  } catch (error) {
    console.error(`❌ Error sending message to ${phoneNumber}:`, error)
    throw error
  }
}

export async function destroyWhatsAppClient() {
  isReady = false
  phoneToNotificationMap.clear()
  console.log('WhatsApp mock client destroyed')
}

// Carrega o mapeamento de telefones para notificações
function loadNotificationMapping() {
  try {
    // Simula carregamento
    console.log(`📋 [MOCK] Carregando notificações pendentes...`)
  } catch (error) {
    console.error('Error loading notification mapping:', error)
  }
}

// Processa mensagem recebida automaticamente
async function processIncomingMessage(msg: MockMessage) {
  try {
    // Ignora mensagens enviadas por nós
    if (msg.fromMe) return
    
    console.log(`� [MOCK] Processando resposta: ${msg.body}`)
    
    // Simula processamento
    return { success: true }
  } catch (error) {
    console.error('Error processing incoming message:', error)
  }
}

// Atualiza o mapeamento quando novas notificações são enviadas
export function registerNotification(phoneNumber: string, notificationId: string) {
  const normalizedPhone = phoneNumber.replace(/[^0-9]/g, '')
  phoneToNotificationMap.set(normalizedPhone, notificationId)
  console.log(`📝 Registered notification ${notificationId} for ${phoneNumber}`)
}

// Remove notificação do mapeamento
export function unregisterNotification(phoneNumber: string) {
  const normalizedPhone = phoneNumber.replace(/[^0-9]/g, '')
  phoneToNotificationMap.delete(normalizedPhone)
}

