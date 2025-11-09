"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"
import { getSubjectPerformanceByClass, getAttendanceTrendsByClass, getSubjectHistoryByClass } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"

interface OverviewChartsProps {
  classFilter: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-3 shadow-md">
        <p className="font-medium text-popover-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
            {entry.dataKey === "rate" && "%"}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function OverviewCharts({ classFilter }: OverviewChartsProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const subjectData = getSubjectPerformanceByClass(classFilter)
  const attendanceTrends = getAttendanceTrendsByClass(classFilter)

  const handleBarClick = (data: any) => {
    if (data && data.activeLabel) {
      setSelectedSubject(data.activeLabel)
    }
  }

  const handleBackToOverview = () => {
    setSelectedSubject(null)
  }

  const subjectHistory = selectedSubject ? getSubjectHistoryByClass(classFilter, selectedSubject) : []

  return (
    <div className="space-y-6">
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
                    Histórico de Desempenho - {selectedSubject}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Evolução das médias nos últimos 6 meses
                  </p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={subjectHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#8b5cf6", strokeWidth: 1 }} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-foreground">Média</span>}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                  name="Média"
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Desempenho Médio por Matéria</h3>
              <p className="text-sm text-muted-foreground">Clique em uma matéria para ver o histórico detalhado</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="subject"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-foreground">Média</span>}
                />
                <Bar 
                  dataKey="average" 
                  fill="#8b5cf6" 
                  radius={[8, 8, 0, 0]} 
                  name="Média" 
                  animationDuration={800}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Taxa de Frequência (Últimos 6 Meses)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3b82f6", strokeWidth: 1 }} />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
              formatter={(value) => <span className="text-sm text-foreground">Taxa (%)</span>}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7, strokeWidth: 2 }}
              name="Taxa"
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
