"use client"

import { Button } from "@/components/ui/button"
import { AbsenceNotifications } from "@/components/dashboard/absence-notifications"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotificacoesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.push("/")}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Notificações do WhatsApp</h1>
                <p className="text-sm text-muted-foreground">Sistema de acompanhamento de faltas e respostas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={() => router.push("/whatsapp")}
              >
                Configurar WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <AbsenceNotifications />
      </main>
    </div>
  )
}

