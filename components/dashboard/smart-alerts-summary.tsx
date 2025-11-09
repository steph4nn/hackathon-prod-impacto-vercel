"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ArrowRight, AlertTriangle, Calendar, Users, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"

export function SmartAlertsSummary() {
  const router = useRouter()

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análises Inteligentes com IA
            </CardTitle>
            <CardDescription>
              Detecte padrões e receba alertas automáticos baseados em dados reais
            </CardDescription>
          </div>
          <Button 
            onClick={() => router.push("/analises")}
            variant="default"
          >
            Ver Análises
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer" onClick={() => router.push("/analises?tab=attendance")}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-semibold">Padrões de Faltas</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Detecta padrões por região, linha de ônibus e problemas de transporte
            </p>
          </div>
          
          <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer" onClick={() => router.push("/analises?tab=risk")}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <h4 className="font-semibold">Alunos em Risco</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Identifica grupos em risco e sugere intervenções personalizadas
            </p>
          </div>
          
          <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer" onClick={() => router.push("/analises?tab=performance")}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-semibold">Desempenho Acadêmico</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Analisa notas por matéria e identifica oportunidades de melhoria
            </p>
          </div>
          
          <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer" onClick={() => router.push("/analises?tab=daily")}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-semibold">Insights do Dia</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Resumo executivo das faltas com ações imediatas recomendadas
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

