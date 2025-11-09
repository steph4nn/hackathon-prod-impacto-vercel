/**
 * Exemplos de Uso do Sistema de Alertas Inteligentes
 * 
 * Este arquivo demonstra diferentes formas de usar o sistema
 * em componentes React.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

// ============================================================
// EXEMPLO 1: Análise Simples de Padrões de Faltas
// ============================================================

export function QuickAttendanceAlert() {
  const [alert, setAlert] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const checkToday = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/smart-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "daily-insights",
        }),
      })
      const data = await response.json()
      setAlert(data.analysis)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Faltas de Hoje</h3>
      <Button onClick={checkToday} disabled={loading}>
        {loading ? "Analisando..." : "Verificar Agora"}
      </Button>
      
      {alert && (
        <Alert className="mt-4">
          <AlertDescription className="whitespace-pre-wrap">
            {alert}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  )
}

// ============================================================
// EXEMPLO 2: Detector Automático na Carga da Página
// ============================================================

export function AutomaticPatternDetector() {
  const [patterns, setPatterns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Executa automaticamente ao carregar
  React.useEffect(() => {
    async function detectPatterns() {
      try {
        const response = await fetch("/api/smart-alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysisType: "attendance-patterns",
            days: 7,
          }),
        })
        const data = await response.json()
        setPatterns(data.patterns || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    detectPatterns()
  }, [])

  if (loading) return <div>Analisando padrões...</div>

  return (
    <div>
      {patterns.length > 0 ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Detectados {patterns.length} padrões suspeitos de faltas!
            {patterns.slice(0, 3).map((p, i) => (
              <div key={i} className="mt-2">
                <strong>{p.date}</strong>: {p.count} alunos da{" "}
                {p.type === "bus_route" ? p.route : `região ${p.neighborhood}`}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertDescription>
            ✅ Nenhum padrão suspeito detectado nos últimos 7 dias
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// ============================================================
// EXEMPLO 3: Card de Alunos em Risco com Ações
// ============================================================

export function RiskStudentsCard() {
  const [analysis, setAnalysis] = useState<any>(null)
  const [expanded, setExpanded] = useState(false)

  const analyzeRisks = async () => {
    const response = await fetch("/api/smart-alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysisType: "risk-students" }),
    })
    const data = await response.json()
    setAnalysis(data)
    setExpanded(true)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Alunos em Risco</h3>
          <p className="text-sm text-muted-foreground">
            Análise inteligente de grupos e padrões
          </p>
        </div>
        <Button onClick={analyzeRisks}>Analisar</Button>
      </div>

      {analysis && (
        <div className="space-y-4">
          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{analysis.statistics.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {analysis.statistics.highRisk}
              </div>
              <div className="text-sm text-muted-foreground">Alto Risco</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {analysis.statistics.mediumRisk}
              </div>
              <div className="text-sm text-muted-foreground">Médio Risco</div>
            </div>
          </div>

          {/* Análise do GPT */}
          {expanded && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Estratégias de Intervenção</h4>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {analysis.analysis}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// ============================================================
// EXEMPLO 4: Banner de Alerta Crítico
// ============================================================

export function CriticalAlertBanner() {
  const [hasAlert, setHasAlert] = useState(false)
  const [alertDetails, setAlertDetails] = useState<any>(null)

  React.useEffect(() => {
    // Verifica alertas críticos a cada 30 minutos
    const checkCriticalAlerts = async () => {
      const response = await fetch("/api/smart-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisType: "daily-insights" }),
      })
      const data = await response.json()
      
      // Verifica se há muitas faltas
      if (data.summary?.totalAbsences > 20) {
        setHasAlert(true)
        setAlertDetails(data)
      }
    }

    checkCriticalAlerts()
    const interval = setInterval(checkCriticalAlerts, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (!hasAlert) return null

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>⚠️ Alerta: Faltas Acima do Normal</strong>
        <p className="mt-2">
          {alertDetails.summary.totalAbsences} faltas registradas hoje.
          Clique para ver detalhes e ações recomendadas.
        </p>
        <Button variant="outline" size="sm" className="mt-2">
          Ver Análise Completa
        </Button>
      </AlertDescription>
    </Alert>
  )
}

// ============================================================
// EXEMPLO 5: Widget de Dashboard com Múltiplas Métricas
// ============================================================

export function SmartDashboardWidget() {
  const [metrics, setMetrics] = useState({
    dailyAbsences: 0,
    suspiciousPatterns: 0,
    highRiskStudents: 0,
    criticalBusRoutes: [],
  })

  React.useEffect(() => {
    async function fetchMetrics() {
      // Combina múltiplas análises
      const [patterns, risks, daily] = await Promise.all([
        fetch("/api/smart-alerts", {
          method: "POST",
          body: JSON.stringify({ analysisType: "attendance-patterns", days: 1 }),
        }).then((r) => r.json()),
        fetch("/api/smart-alerts", {
          method: "POST",
          body: JSON.stringify({ analysisType: "risk-students" }),
        }).then((r) => r.json()),
        fetch("/api/smart-alerts", {
          method: "POST",
          body: JSON.stringify({ analysisType: "daily-insights" }),
        }).then((r) => r.json()),
      ])

      setMetrics({
        dailyAbsences: daily.summary?.totalAbsences || 0,
        suspiciousPatterns: patterns.patterns?.length || 0,
        highRiskStudents: risks.statistics?.highRisk || 0,
        criticalBusRoutes: patterns.patterns
          ?.filter((p: any) => p.type === "bus_route")
          .map((p: any) => p.route) || [],
      })
    }

    fetchMetrics()
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <div className="text-2xl font-bold">{metrics.dailyAbsences}</div>
        <div className="text-sm text-muted-foreground">Faltas Hoje</div>
      </Card>

      <Card className="p-4">
        <div className="text-2xl font-bold">{metrics.highRiskStudents}</div>
        <div className="text-sm text-muted-foreground">Alto Risco</div>
      </Card>

      {metrics.suspiciousPatterns > 0 && (
        <Card className="p-4 col-span-2 border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-semibold">
                {metrics.suspiciousPatterns} Padrão(ões) Suspeito(s)
              </div>
              {metrics.criticalBusRoutes.length > 0 && (
                <div className="text-sm text-red-600">
                  Linhas afetadas: {metrics.criticalBusRoutes.join(", ")}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// ============================================================
// EXEMPLO 6: Integração com Notificações
// ============================================================

export function NotificationSystem() {
  React.useEffect(() => {
    // Verifica alertas críticos a cada hora
    const checkAndNotify = async () => {
      const response = await fetch("/api/smart-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "attendance-patterns",
          days: 1,
        }),
      })
      const data = await response.json()

      // Se houver padrões críticos, notifica
      if (data.patterns && data.patterns.length > 0) {
        const criticalPatterns = data.patterns.filter((p: any) => p.count >= 10)
        
        if (criticalPatterns.length > 0) {
          // Aqui você integraria com seu sistema de notificação
          // Email, SMS, WhatsApp, etc.
          console.log("🚨 Alerta crítico detectado:", criticalPatterns)
          
          // Exemplo: mostrar notificação do navegador
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("⚠️ Alerta Escolar", {
              body: `Detectado problema de transporte: ${criticalPatterns[0].route}`,
              icon: "/icon.png",
            })
          }
        }
      }
    }

    checkAndNotify()
    const interval = setInterval(checkAndNotify, 60 * 60 * 1000) // a cada hora
    return () => clearInterval(interval)
  }, [])

  return null // Componente invisível que só monitora
}

// ============================================================
// EXEMPLO 7: Exportar Análise para PDF/Email
// ============================================================

export function ExportAnalysisButton() {
  const exportAnalysis = async () => {
    // Busca todas as análises
    const [patterns, risks] = await Promise.all([
      fetch("/api/smart-alerts", {
        method: "POST",
        body: JSON.stringify({ analysisType: "attendance-patterns", days: 7 }),
      }).then((r) => r.json()),
      fetch("/api/smart-alerts", {
        method: "POST",
        body: JSON.stringify({ analysisType: "risk-students" }),
      }).then((r) => r.json()),
    ])

    // Monta relatório
    const report = `
RELATÓRIO SEMANAL DE ANÁLISES INTELIGENTES
Data: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════

1. PADRÕES DE FALTAS

${patterns.analysis}

Estatísticas:
- Total de faltas: ${patterns.summary.totalAbsences}
- Alunos únicos: ${patterns.summary.uniqueStudents}
- Padrões detectados: ${patterns.patterns.length}

═══════════════════════════════════════════════

2. ALUNOS EM RISCO

${risks.analysis}

Estatísticas:
- Total em risco: ${risks.statistics.total}
- Alto risco: ${risks.statistics.highRisk}
- Médio risco: ${risks.statistics.mediumRisk}

═══════════════════════════════════════════════
    `.trim()

    // Opção 1: Download como TXT
    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${new Date().toISOString().split("T")[0]}.txt`
    a.click()

    // Opção 2: Enviar por email (integração com seu backend)
    // await fetch('/api/send-report', {
    //   method: 'POST',
    //   body: JSON.stringify({ report, to: 'coordenacao@escola.com' })
    // })
  }

  return (
    <Button onClick={exportAnalysis}>
      📄 Exportar Relatório Semanal
    </Button>
  )
}

