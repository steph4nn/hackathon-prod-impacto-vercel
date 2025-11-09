/**
 * Serviço de integração com WhatsApp
 * 
 * Este serviço gerencia a conexão com WhatsApp Web e o envio/recebimento de mensagens
 * Processa automaticamente as respostas das mães usando OpenAI
 * 
 * IMPORTANTE: Este arquivo só deve ser usado no servidor (API Routes)
 */

import fs from 'fs'
import path from 'path'

// Usar any ao invés de importar tipos do whatsapp-web.js para evitar erros de compilação
let whatsappClient: any = null
let isReady = false
let qrCode: string | null = null

// Callbacks para eventos
const messageHandlers: Array<(msg: any) => void> = []

// Mapa de números de telefone para IDs de notificação
const phoneToNotificationMap = new Map<string, string>()

export async function initializeWhatsApp() {
  console.log('[MOCK] Initializing WhatsApp client...')
  console.log('[MOCK] WhatsApp service is in DEMO mode for Vercel deployment')
  
  // Mock: Sempre retorna falso para modo desconectado
  isReady = false
  qrCode = null
  whatsappClient = null
  
  return null
}

export function getWhatsAppClient() {
  return whatsappClient
}

export function isWhatsAppReady() {
  return isReady
}

export function getQRCode() {
  console.log('🔍 getQRCode called, current value:', qrCode ? 'QR Code exists' : 'null')
  return qrCode
}

export function clearSession() {
  // Limpa a sessão salva para forçar novo QR Code
  const sessionPath = './.wwebjs_auth'
  try {
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true })
      console.log('🗑️ Session cleared successfully')
      return true
    }
    console.log('ℹ️ No session to clear')
    return false
  } catch (error) {
    console.error('❌ Error clearing session:', error)
    return false
  }
}

export function onMessage(handler: (msg: any) => void) {
  messageHandlers.push(handler)
}

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  console.log(`[MOCK] Simulating WhatsApp message to ${phoneNumber}`)
  console.log(`[MOCK] Message: ${message.substring(0, 100)}...`)
  
  // Mock: Simula envio bem-sucedido
  return { success: true, phoneNumber }
}

export async function destroyWhatsAppClient() {
  console.log('[MOCK] Destroying WhatsApp client...')
  whatsappClient = null
  isReady = false
  phoneToNotificationMap.clear()
  console.log('[MOCK] WhatsApp client destroyed')
}

// Carrega o mapeamento de telefones para notificações
function loadNotificationMapping() {
  try {
    const notificationsPath = path.join(process.cwd(), 'data', 'absence-notifications.json')
    const notifications = JSON.parse(fs.readFileSync(notificationsPath, 'utf-8'))
    
    phoneToNotificationMap.clear()
    
    notifications.forEach((notification: any) => {
      if (notification.motherPhone && notification.status === 'no_response') {
        // Normaliza o número
        const normalizedPhone = notification.motherPhone.replace(/[^0-9]/g, '')
        phoneToNotificationMap.set(normalizedPhone, notification.id)
      }
    })
    
    console.log(`📋 Loaded ${phoneToNotificationMap.size} pending notifications`)
  } catch (error) {
    console.error('Error loading notification mapping:', error)
  }
}

// Processa mensagem recebida automaticamente (MOCK)
async function processIncomingMessage(msg: any) {
  console.log('[MOCK] Processing incoming message (mock mode)')
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

