"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Clock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function AbsenceNotificationsSummary() {
  const router = useRouter()
  const [stats, setStats] = useState({
    total: 0,
    noResponse: 0,
    explained: 0,
    attention: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/absence-notifications')
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching notification stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notificações de Faltas via WhatsApp
            </CardTitle>
            <CardDescription>
              Resumo do sistema automático de contato com responsáveis
            </CardDescription>
          </div>
          <Button 
            onClick={() => router.push("/notificacoes")}
            variant="default"
          >
            Ver Detalhes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Carregando estatísticas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium text-muted-foreground">Total Enviadas</p>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Sem Resposta</p>
              </div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.noResponse}</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Explicadas</p>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.explained}</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Requer Atenção</p>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.attention}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

