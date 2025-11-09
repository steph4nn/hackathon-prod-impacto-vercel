import { NextRequest } from "next/server"

// Importação dinâmica das funções do serviço WhatsApp
async function getWhatsAppService() {
  return await import("@/lib/whatsapp-service")
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action")

  try {
    const whatsappService = await getWhatsAppService()
    
    if (action === "status") {
      // Verifica status da conexão
      const ready = whatsappService.isWhatsAppReady()
      const qrCode = whatsappService.getQRCode()

      return Response.json({
        ready,
        qrCode,
        message: ready 
          ? "WhatsApp conectado e pronto!" 
          : qrCode 
            ? "Escaneie o QR Code para conectar" 
            : "Inicializando..."
      })
    }

    if (action === "disconnect") {
      // Desconecta o cliente
      await whatsappService.destroyWhatsAppClient()
      return Response.json({
        success: true,
        message: "WhatsApp desconectado"
      })
    }

    if (action === "clear-session") {
      // Limpa a sessão e desconecta
      await whatsappService.destroyWhatsAppClient()
      whatsappService.clearSession()
      return Response.json({
        success: true,
        message: "Sessão limpa. Inicie novamente para ver QR Code."
      })
    }

    // Ação padrão: inicializar
    console.log('🚀 Initializing WhatsApp...')
    await whatsappService.initializeWhatsApp()
    console.log('✅ WhatsApp initialization started')
    
    return Response.json({
      success: true,
      message: "WhatsApp iniciado. Consulte o status para obter o QR Code."
    })
  } catch (error) {
    console.error("Error in WhatsApp init:", error)
    return Response.json({ 
      error: "Failed to initialize WhatsApp",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

