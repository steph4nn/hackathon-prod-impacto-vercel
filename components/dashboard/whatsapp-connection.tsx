"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  QrCode,
  RefreshCw,
  Power
} from "lucide-react"

interface WhatsAppStatus {
  ready: boolean
  qrCode: string | null
  message: string
}

export function WhatsAppConnection() {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(false)

  useEffect(() => {
    checkStatus()
    
    // Verifica status a cada 5 segundos
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp/init?action=status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Error checking WhatsApp status:", error)
    }
  }

  const initializeWhatsApp = async () => {
    setInitializing(true)
    try {
      const response = await fetch('/api/whatsapp/init', {
        method: 'GET'
      })
      const data = await response.json()
      
      if (data.success) {
        // Aguarda alguns segundos e verifica o status
        setTimeout(checkStatus, 2000)
      }
    } catch (error) {
      console.error("Error initializing WhatsApp:", error)
      alert("❌ Erro ao inicializar WhatsApp")
    } finally {
      setInitializing(false)
    }
  }

  const disconnectWhatsApp = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/whatsapp/init?action=disconnect')
      const data = await response.json()
      
      if (data.success) {
        await checkStatus()
        alert("✅ WhatsApp desconectado")
      }
    } catch (error) {
      console.error("Error disconnecting WhatsApp:", error)
      alert("❌ Erro ao desconectar WhatsApp")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Conexão WhatsApp
            </CardTitle>
            <CardDescription>
              Status da conexão com WhatsApp Web
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkStatus}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          {status ? (
            status.ready ? (
              <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="outline" className="border-gray-400">
                <XCircle className="mr-1 h-3 w-3" />
                Desconectado
              </Badge>
            )
          ) : (
            <Spinner className="h-4 w-4" />
          )}
        </div>

        {/* Mensagem de Status */}
        {status && (
          <Alert>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {/* QR Code */}
        {status?.qrCode && (
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="h-4 w-4" />
              <span className="text-sm font-medium">Escaneie o QR Code:</span>
            </div>
            <div className="flex justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(status.qrCode)}`}
                alt="QR Code do WhatsApp"
                className="border rounded"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Abra o WhatsApp no seu celular e escaneie este código
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          {!status?.ready ? (
            <Button 
              onClick={initializeWhatsApp}
              disabled={initializing}
              className="flex-1"
            >
              {initializing ? (
                <>
                  <Spinner className="mr-2" />
                  Inicializando...
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Conectar WhatsApp
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={disconnectWhatsApp}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? (
                <>
                  <Spinner className="mr-2" />
                  Desconectando...
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Desconectar
                </>
              )}
            </Button>
          )}
        </div>

        {/* Instruções */}
        {!status?.ready && (
          <Alert>
            <AlertTitle className="text-sm">Como conectar:</AlertTitle>
            <AlertDescription className="text-xs space-y-1">
              <ol className="list-decimal list-inside space-y-1">
                <li>Clique em "Conectar WhatsApp"</li>
                <li>Aguarde o QR Code aparecer</li>
                <li>Abra o WhatsApp no seu celular</li>
                <li>Toque em "Aparelhos conectados"</li>
                <li>Escaneie o QR Code</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {/* Info sobre funcionalidade automática */}
        {status?.ready && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="text-sm text-blue-900">Sistema Automático Ativo</AlertTitle>
            <AlertDescription className="text-xs text-blue-800">
              As respostas das mães serão automaticamente processadas pela IA e classificadas em:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Falta explicada:</strong> Justificativas comuns (doença, consulta)</li>
                <li><strong>Alerta:</strong> Problemas que requerem ação da gestora</li>
                <li><strong>Não respondida:</strong> Sem resposta ainda</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

