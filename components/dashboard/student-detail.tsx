"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StructuredAnalysis } from "./structured-analysis"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  BarChart,
  Legend,
} from "recharts"
import { AlertTriangle, TrendingUp, AlertCircle, Sparkles, RefreshCw, ArrowLeft } from "lucide-react"
import { getStudentById, getStudentSubjectHistory } from "@/lib/mock-data"
import { useState } from "react"

interface StudentDetailProps {
  studentId: string
}

export function StudentDetail({ studentId }: StudentDetailProps) {
  const student = getStudentById(studentId)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  const generateAnalysis = async () => {
    setIsLoadingAnalysis(true)
    setAnalysisError(null)

    try {
      const response = await fetch("/api/student-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate analysis")
      }

      const data = await response.json()
      setAiAnalysis(data.analysis)
    } catch (error) {
      console.error("Error:", error)
      setAnalysisError("Não foi possível gerar a análise. Tente novamente.")
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const handleBarClick = (data: any) => {
    if (data && data.activeLabel) {
      setSelectedSubject(data.activeLabel)
    }
  }

  const handleBackToOverview = () => {
    setSelectedSubject(null)
  }

  if (!student) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Aluno não encontrado.</p>
      </Card>
    )
  }

  const getRiskInfo = () => {
    if (student.risk === "high") {
      return {
        badge: (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Alto Risco de Evasão
          </Badge>
        ),
        message: "Este aluno apresenta sinais de risco. Recomenda-se intervenção imediata.",
        bgColor: "bg-red-500/10",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      }
    }
    if (student.risk === "medium") {
      return {
        badge: (
          <Badge variant="outline" className="gap-1 border-orange-500 text-orange-500">
            <AlertCircle className="h-3 w-3" />
            Atenção Necessária
          </Badge>
        ),
        message: "Aluno requer atenção. Monitore o desempenho e frequência.",
        bgColor: "bg-orange-500/10",
        icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
      }
    }
    return {
      badge: (
        <Badge variant="outline" className="border-emerald-500 text-emerald-500">
          Baixo Risco
        </Badge>
      ),
      message: "Aluno com bom desempenho e frequência adequada.",
      bgColor: "bg-emerald-500/10",
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
    }
  }

  const riskInfo = getRiskInfo()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-md">
          <p className="font-medium text-popover-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Student Header */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-xl text-primary">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
            <p className="text-muted-foreground">{student.class}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="rounded-lg bg-blue-500/10 px-3 py-1">
                <p className="text-xs text-muted-foreground">Média Geral</p>
                <p className="text-lg font-bold text-foreground">{student.grade.toFixed(1)}</p>
              </div>
              <div className="rounded-lg bg-cyan-500/10 px-3 py-1">
                <p className="text-xs text-muted-foreground">Frequência</p>
                <p className="text-lg font-bold text-foreground">{student.attendance}%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Alert */}
      <Card className={`p-6 ${riskInfo.bgColor}`}>
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-background p-2">{riskInfo.icon}</div>
          <div className="flex-1">
            <div className="mb-2">{riskInfo.badge}</div>
            <p className="text-sm text-muted-foreground">{riskInfo.message}</p>
            {student.alerts.length > 0 && (
              <ul className="mt-3 space-y-1">
                {student.alerts.map((alert, index) => (
                  <li key={index} className="text-sm text-foreground">
                    • {alert}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>

      {/* AI Analysis Section */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Análise Inteligente</h3>
          </div>
          <Button onClick={generateAnalysis} disabled={isLoadingAnalysis} size="sm" variant="outline">
            {isLoadingAnalysis ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {aiAnalysis ? "Atualizar Análise" : "Gerar Análise"}
              </>
            )}
          </Button>
        </div>

        {analysisError && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{analysisError}</div>
        )}

        {aiAnalysis ? (
          <StructuredAnalysis analysis={aiAnalysis} />
        ) : !isLoadingAnalysis ? (
          <p className="text-sm text-muted-foreground">
            Clique no botão acima para gerar uma análise detalhada do desempenho do aluno com recomendações
            personalizadas de ação.
          </p>
        ) : null}
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Evolução das Notas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={student.gradesHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#8b5cf6", strokeWidth: 1 }} />
              <Legend
                wrapperStyle={{ paddingTop: "10px" }}
                iconType="circle"
                formatter={(value) => <span className="text-sm text-foreground">Nota</span>}
              />
              <Line
                type="monotone"
                dataKey="grade"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7, strokeWidth: 2 }}
                name="Nota"
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          {selectedSubject ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToOverview}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Button>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Histórico - {selectedSubject}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Evolução das notas nos últimos 6 meses
                    </p>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={getStudentSubjectHistory(studentId, selectedSubject)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3b82f6", strokeWidth: 1 }} />
                  <Legend
                    wrapperStyle={{ paddingTop: "10px" }}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-foreground">Nota</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="grade"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7, strokeWidth: 2 }}
                    name="Nota"
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Notas por Matéria</h3>
                <p className="text-sm text-muted-foreground">Clique em uma matéria para ver o histórico detalhado</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={student.subjectGrades} onClick={handleBarClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="subject"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 10]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }} />
                  <Legend
                    wrapperStyle={{ paddingTop: "10px" }}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-foreground">Nota</span>}
                  />
                  <Bar 
                    dataKey="grade" 
                    fill="#3b82f6" 
                    radius={[8, 8, 0, 0]} 
                    name="Nota" 
                    animationDuration={800}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
