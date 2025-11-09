import { NextRequest } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import fs from "fs"
import path from "path"

// Configurar OpenAI
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
  const status = searchParams.get("status")
  const date = searchParams.get("date")

  try {
    let notifications = readNotifications()

    // Filtrar por status
    if (status && status !== "all") {
      notifications = notifications.filter((n: any) => n.status === status)
    }

    // Filtrar por data
    if (date) {
      notifications = notifications.filter((n: any) => n.date === date)
    }

    // Estatísticas
    const allNotifications = readNotifications()
    const stats = {
      total: allNotifications.length,
      noResponse: allNotifications.filter((n: any) => n.status === "no_response").length,
      explained: allNotifications.filter((n: any) => n.status === "explained").length,
      attention: allNotifications.filter((n: any) => n.status === "attention").length,
    }

    return Response.json({
      notifications,
      stats
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return Response.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, notificationId, motherResponse } = body

  try {
    if (action === "interpret-response") {
      // Interpretar resposta da mãe com IA
      return await interpretMotherResponse(notificationId, motherResponse)
    } else if (action === "mark-as-read") {
      // Marcar como lida
      const notifications = readNotifications()
      const notification = notifications.find((n: any) => n.id === notificationId)
      
      if (notification) {
        notification.readByManager = true
        notification.readAt = new Date().toISOString()
        writeNotifications(notifications)
      }

      return Response.json({ success: true })
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing notification action:", error)
    return Response.json({ error: "Failed to process action" }, { status: 500 })
  }
}

async function interpretMotherResponse(notificationId: string, motherResponse: string) {
  const notifications = readNotifications()
  const notification = notifications.find((n: any) => n.id === notificationId)

  if (!notification) {
    return Response.json({ error: "Notification not found" }, { status: 404 })
  }

  // Usar IA para interpretar a resposta
  const { text } = await generateText({
    model: openai("gpt-5-mini"),
    prompt: `Você é um assistente educacional analisando a resposta de uma mãe sobre a falta do filho na escola.

Resposta da mãe: "${motherResponse}"

Analise e classifique em uma das 3 categorias:

1. **explained** - Motivos justificados onde a GESTORA NÃO PODE INTERFERIR:
   - Doença (febre, gripe, dor, etc.)
   - Consultas médicas/dentista
   - Viagens familiares
   - Luto, casamento, eventos familiares
   - Qualquer situação pessoal/médica fora do controle da escola

2. **attention** - APENAS situações onde a GESTORA PODE E DEVE AGIR:
   - Problema de transporte escolar (ônibus não passou, atraso recorrente)
   - Dificuldade financeira (falta de uniforme, material, dinheiro para transporte)
   - Bullying ou problemas com colegas/professores
   - Falta de interesse motivada por problemas na escola
   - Situações sociais que a escola pode apoiar (assistência social, vale-transporte, uniforme, etc.)
   
3. **no_response** - Use apenas se a resposta for vazia ou não fizer sentido

**IMPORTANTE**: 
- Se é doença/médico = explained (gestora não pode curar o aluno)
- Se é problema de transporte/financeiro/escola = attention (gestora PODE resolver)

Responda APENAS em formato JSON:
{
  "category": "explained" ou "attention" ou "no_response",
  "summary": "Resumo breve em 1 frase do motivo",
  "requiresAction": true ou false,
  "suggestedAction": "Ação específica que a gestora pode tomar (ou null se não aplicável)"
}

Seja prático e focado APENAS em ações que a gestora/escola REALMENTE pode fazer.`,
    temperature: 0.3,
  })

  try {
    // Parse da resposta JSON do GPT
    const interpretation = JSON.parse(text)

    // Atualizar notificação
    notification.status = interpretation.category
    notification.motherResponse = motherResponse
    notification.aiInterpretation = interpretation
    notification.respondedAt = new Date().toISOString()

    writeNotifications(notifications)

    return Response.json({
      success: true,
      notification,
      interpretation
    })
  } catch (error) {
    console.error("Error parsing AI response:", error)
    return Response.json({ 
      error: "Failed to interpret response",
      details: text 
    }, { status: 500 })
  }
}

