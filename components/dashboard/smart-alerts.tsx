"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Users, Calendar, TrendingUp, GraduationCap } from "lucide-react"
import { StructuredAnalysis } from "./structured-analysis"

interface SmartAlertsProps {
  defaultTab?: string
}

export function SmartAlerts({ defaultTab = "attendance" }: SmartAlertsProps = {}) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [activeTab, setActiveTab] = useState(defaultTab)

  const analyzeAttendancePatterns = async () => {
    setLoading(true)
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
      setAnalysis(data)
    } catch (error) {
      console.error("Error analyzing attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeRiskStudents = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/smart-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "risk-students",
        }),
      })
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("Error analyzing risk students:", error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeDailyInsights = async () => {
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
      setAnalysis(data)
    } catch (error) {
      console.error("Error analyzing daily insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeAcademicPerformance = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/smart-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "academic-performance",
        }),
      })
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("Error analyzing academic performance:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Análises Inteligentes com IA
        </CardTitle>
        <CardDescription>
          Detecte padrões e receba alertas automáticos baseados em dados reais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance">
              <Calendar className="mr-2 h-4 w-4" />
              Padrões de Faltas
            </TabsTrigger>
            <TabsTrigger value="risk">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Alunos em Risco
            </TabsTrigger>
            <TabsTrigger value="performance">
              <GraduationCap className="mr-2 h-4 w-4" />
              Desempenho Acadêmico
            </TabsTrigger>
            <TabsTrigger value="daily">
              <Users className="mr-2 h-4 w-4" />
              Insights do Dia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Detecta padrões de faltas por região, linha de ônibus e possíveis problemas de transporte
              </p>
              <Button onClick={analyzeAttendancePatterns} disabled={loading}>
                {loading ? <Spinner className="mr-2" /> : null}
                Analisar Padrões
              </Button>
            </div>

            {analysis && analysis.patterns && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total de Faltas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.summary.totalAbsences}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Alunos Únicos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.summary.uniqueStudents}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Linhas Afetadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.summary.affectedBusRoutes}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Bairros Afetados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.summary.affectedNeighborhoods}</div>
                    </CardContent>
                  </Card>
                </div>

                {analysis.patterns.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Padrões Suspeitos Detectados</AlertTitle>
                    <AlertDescription>
                      Encontramos {analysis.patterns.length} padrão(ões) que podem indicar problemas de
                      transporte ou situações na região.
                    </AlertDescription>
                  </Alert>
                )}

                <StructuredAnalysis analysis={analysis.analysis} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Identifica grupos de alunos em risco com características similares e sugere intervenções
              </p>
              <Button onClick={analyzeRiskStudents} disabled={loading}>
                {loading ? <Spinner className="mr-2" /> : null}
                Analisar Riscos
              </Button>
            </div>

            {analysis && analysis.statistics && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total em Risco</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.statistics.total}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Alto Risco</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {analysis.statistics.highRisk}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Médio Risco</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">
                        {analysis.statistics.mediumRisk}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Por Bairro (Top 5)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.statistics.byNeighborhood.map((item: any) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <span className="text-sm">{item.name}</span>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Por Turma (Top 5)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.statistics.byClass.map((item: any) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <span className="text-sm">{item.name}</span>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <StructuredAnalysis analysis={analysis.analysis} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Analisa o desempenho acadêmico dos alunos por matéria e identifica oportunidades de melhoria
              </p>
              <Button onClick={analyzeAcademicPerformance} disabled={loading}>
                {loading ? <Spinner className="mr-2" /> : null}
                Analisar Desempenho
              </Button>
            </div>

            {analysis && analysis.performanceStats && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.performanceStats.overallAverage}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Acima da Média</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {analysis.performanceStats.aboveAverage}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Na Média</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">
                        {analysis.performanceStats.average}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Abaixo da Média</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {analysis.performanceStats.belowAverage}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Matérias com Melhor Desempenho</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.performanceStats.topSubjects.map((item: any) => (
                          <div key={item.subject} className="flex items-center justify-between">
                            <span className="text-sm">{item.subject}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{item.average}</Badge>
                              <span className="text-xs text-green-600">▲</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Matérias que Precisam de Atenção</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.performanceStats.bottomSubjects.map((item: any) => (
                          <div key={item.subject} className="flex items-center justify-between">
                            <span className="text-sm">{item.subject}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive">{item.average}</Badge>
                              <span className="text-xs text-red-600">▼</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {analysis.performanceStats.criticalStudents > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Alunos com Notas Críticas</AlertTitle>
                    <AlertDescription>
                      {analysis.performanceStats.criticalStudents} aluno(s) com média abaixo de 6.0 requerem
                      intervenção imediata para evitar reprovação.
                    </AlertDescription>
                  </Alert>
                )}

                <StructuredAnalysis analysis={analysis.analysis} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Resumo executivo das faltas de hoje com ações imediatas recomendadas
              </p>
              <Button onClick={analyzeDailyInsights} disabled={loading}>
                {loading ? <Spinner className="mr-2" /> : null}
                Analisar Hoje
              </Button>
            </div>

            {analysis && analysis.hasData !== undefined && (
              <div className="space-y-4">
                {analysis.hasData ? (
                  <>
                    <div className="grid grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total de Faltas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analysis.summary.totalAbsences}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Linhas de Ônibus</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{Object.keys(analysis.summary.byBusRoute).length}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Turmas Afetadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{Object.keys(analysis.summary.byClass).length}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Bairros Afetados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{Object.keys(analysis.summary.byNeighborhood).length}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Distribuição por Linha de Ônibus</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(analysis.summary.byBusRoute).map(([route, count]) => (
                              <div key={route} className="flex items-center justify-between">
                                <span className="text-sm">{route}</span>
                                <Badge variant="secondary">{count as number}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Distribuição por Turma</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(analysis.summary.byClass).map(([className, count]) => (
                              <div key={className} className="flex items-center justify-between">
                                <span className="text-sm">{className}</span>
                                <Badge variant="secondary">{count as number}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {analysis.patterns && analysis.patterns.length > 0 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Padrões Suspeitos Detectados Hoje</AlertTitle>
                        <AlertDescription>
                          Encontramos {analysis.patterns.length} padrão(ões) que podem indicar problemas
                          estruturais ou situações que requerem atenção imediata.
                        </AlertDescription>
                      </Alert>
                    )}

                    <StructuredAnalysis analysis={analysis.analysis} />
                  </>
                ) : (
                  <Alert>
                    <AlertDescription>{analysis.analysis}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

