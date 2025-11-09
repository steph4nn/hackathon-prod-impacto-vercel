import { NextRequest } from "next/server"
import fs from "fs"
import path from "path"

// Importação dinâmica do serviço WhatsApp
async function getWhatsAppService() {
  return await import("@/lib/whatsapp-service")
}

// Caminho para o arquivo de notificações
const notificationsPath = path.join(process.cwd(), 'data', 'absence-notifications.json')

function readNotifications() {
  const data = fs.readFileSync(notificationsPath, 'utf-8')
  return JSON.parse(data)
}

function writeNotifications(notifications: any[]) {
  fs.writeFileSync(notificationsPath, JSON.stringify(notifications, null, 2), 'utf-8')
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action")

  try {
    if (action === "status") {
      // Retorna status real da conexão WhatsApp
      const whatsappService = await getWhatsAppService()
      const ready = whatsappService.isWhatsAppReady()
      return Response.json({
        connected: ready,
        qrCode: null,
        message: ready 
          ? "WhatsApp conectado e pronto para enviar mensagens" 
          : "WhatsApp não está conectado. Inicialize primeiro em /api/whatsapp/init"
      })
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error getting WhatsApp status:", error)
    return Response.json({ error: "Failed to get status" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, absenceDate, studentIds } = body

  try {
    if (action === "send-notifications") {
      // Enviar notificações para mães de alunos que faltaram
      return await sendAbsenceNotifications(absenceDate, studentIds)
    } else if (action === "send-single") {
      const { phoneNumber, message } = body
      return await sendSingleMessage(phoneNumber, message)
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing WhatsApp action:", error)
    return Response.json({ error: "Failed to process action" }, { status: 500 })
  }
}

async function sendAbsenceNotifications(absenceDate: string, studentIds?: string[]) {
  // Carregar dados de faltas e alunos
  const absencesPath = path.join(process.cwd(), 'data', 'daily-absences.json')
  const studentsPath = path.join(process.cwd(), 'data', 'students.json')
  
  const absences = JSON.parse(fs.readFileSync(absencesPath, 'utf-8'))
  const students = JSON.parse(fs.readFileSync(studentsPath, 'utf-8'))
  
  // Filtrar faltas do dia
  let targetAbsences = absences.filter((a: any) => a.date === absenceDate)
  
  // Se IDs específicos foram fornecidos, filtrar
  if (studentIds && studentIds.length > 0) {
    targetAbsences = targetAbsences.filter((a: any) => studentIds.includes(a.studentId))
  }

  const notifications = readNotifications()
  const sent: any[] = []
  const failed: any[] = []

  for (const absence of targetAbsences) {
    try {
      // Buscar dados do aluno
      const student = students.find((s: any) => s.id === absence.studentId)
      
      if (!student) {
        console.error(`Student ${absence.studentId} not found`)
        continue
      }

      // Verificar se já existe notificação para esse aluno neste dia
      const existingNotification = notifications.find(
        (n: any) => n.studentId === student.id && n.date === absenceDate
      )

      if (existingNotification) {
        console.log(`Notification already exists for student ${student.name}`)
        continue
      }

      // Mensagem para a mãe
      const message = `Olá ${student.motherName}! 👋

Sou da Escola Municipal e notamos que ${student.name} não compareceu à aula hoje (${new Date(absenceDate).toLocaleDateString('pt-BR')}).

Gostaríamos de saber o motivo da ausência para garantir que está tudo bem. 

Por favor, responda esta mensagem informando:
- O motivo da falta
- Se precisam de algum apoio da escola

Estamos aqui para ajudar! 🏫

Atenciosamente,
Equipe de Gestão Escolar`

      // Verifica se WhatsApp está pronto
      const whatsappService = await getWhatsAppService()
      
      if (whatsappService.isWhatsAppReady()) {
        try {
          // Envia mensagem real via WhatsApp
          await whatsappService.sendWhatsAppMessage(student.motherPhone, message)
          console.log(`✅ WhatsApp message sent to ${student.motherName} (${student.motherPhone})`)
        } catch (error) {
          console.error(`❌ Failed to send WhatsApp message to ${student.motherPhone}:`, error)
          // Continua mesmo se falhar para registrar a notificação
        }
      } else {
        // Modo de demonstração quando WhatsApp não está conectado
        console.log(`📱 [DEMO MODE] Simulating WhatsApp send to ${student.motherName} (${student.motherPhone})`)
      }

      // Criar registro de notificação
      const newNotification = {
        id: String(Date.now()), // Usar timestamp para ID único
        studentId: student.id,
        studentName: student.name,
        motherName: student.motherName,
        motherPhone: student.motherPhone,
        date: absenceDate,
        messageSent: true,
        sentAt: new Date().toISOString(),
        status: "no_response",
        motherResponse: null,
        aiInterpretation: null,
        respondedAt: null
      }

      notifications.push(newNotification)
      
      // Registra para processamento automático de respostas
      whatsappService.registerNotification(student.motherPhone, newNotification.id)
      sent.push({
        studentName: student.name,
        motherName: student.motherName,
        motherPhone: student.motherPhone
      })
    } catch (error) {
      console.error(`Error sending notification for student ${absence.studentId}:`, error)
      failed.push(absence.studentId)
    }
  }

  // Salvar notificações
  writeNotifications(notifications)

  return Response.json({
    success: true,
    sent: sent.length,
    failed: failed.length,
    details: {
      sent,
      failed
    },
    message: `${sent.length} notificações enviadas com sucesso!`
  })
}

async function sendSingleMessage(phoneNumber: string, message: string) {
  try {
    const whatsappService = await getWhatsAppService()
    
    if (whatsappService.isWhatsAppReady()) {
      // Envia mensagem real via WhatsApp
      await whatsappService.sendWhatsAppMessage(phoneNumber, message)
      console.log(`✅ WhatsApp message sent to ${phoneNumber}`)
      
      return Response.json({
        success: true,
        message: "Message sent successfully via WhatsApp"
      })
    } else {
      // Modo de demonstração
      console.log(`📱 [DEMO MODE] Simulating WhatsApp send to ${phoneNumber}`)
      console.log(`Message: ${message}`)

      return Response.json({
        success: true,
        message: "Message simulated (WhatsApp not connected)",
        demo: true
      })
    }
  } catch (error) {
    console.error("Error sending single message:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message"
    }, { status: 500 })
  }
}

