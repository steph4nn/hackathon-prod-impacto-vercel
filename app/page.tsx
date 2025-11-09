"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GraduationCap, Users, TrendingUp, AlertTriangle, Download, MessageSquare, Smartphone } from "lucide-react"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { StudentList } from "@/components/dashboard/student-list"
import { StudentDetail } from "@/components/dashboard/student-detail"
import { SmartAlertsSummary } from "@/components/dashboard/smart-alerts-summary"
import { AbsenceNotificationsSummary } from "@/components/dashboard/absence-notifications-summary"
import { getClassStats, getStudentsByClass } from "@/lib/mock-data"
import { exportToCSV, exportDetailedCSV, exportToPDF } from "@/lib/export-utils"
import Link from "next/link"

export default function DashboardPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  const stats = getClassStats(selectedClass)
  const students = getStudentsByClass(selectedClass)

  const handleExportCSV = () => {
    const filename = `students-${selectedClass}-${new Date().toISOString().split("T")[0]}.csv`
    exportToCSV(students, filename)
  }

  const handleExportDetailedCSV = () => {
    const filename = `students-detailed-${selectedClass}-${new Date().toISOString().split("T")[0]}.csv`
    exportDetailedCSV(students, filename)
  }

  const handleExportPDF = () => {
    exportToPDF(students, stats, selectedClass)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Dashboard Analítico</h1>
                <p className="text-sm text-muted-foreground">Sistema de Acompanhamento de Alunos</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/whatsapp">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Smartphone className="h-4 w-4" />
                  WhatsApp
                </Button>
              </Link>
              
              <Link href="/notificacoes">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Notificações
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportCSV}>Exportar CSV (Resumo)</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportDetailedCSV}>Exportar CSV (Detalhado)</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>Exportar PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecionar turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Turmas</SelectItem>
                  <SelectItem value="6a">6º Ano A</SelectItem>
                  <SelectItem value="6b">6º Ano B</SelectItem>
                  <SelectItem value="6c">6º Ano C</SelectItem>
                  <SelectItem value="7a">7º Ano A</SelectItem>
                  <SelectItem value="7b">7º Ano B</SelectItem>
                  <SelectItem value="7c">7º Ano C</SelectItem>
                  <SelectItem value="8a">8º Ano A</SelectItem>
                  <SelectItem value="8b">8º Ano B</SelectItem>
                  <SelectItem value="8c">8º Ano C</SelectItem>
                  <SelectItem value="9a">9º Ano A</SelectItem>
                  <SelectItem value="9b">9º Ano B</SelectItem>
                  <SelectItem value="9c">9º Ano C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Key Metrics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Alunos</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
              </div>
              <div className="rounded-full bg-blue-500/10 p-3">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
                <p className="text-2xl font-bold text-foreground">{stats.averageGrade}</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 p-3">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Frequência</p>
                <p className="text-2xl font-bold text-foreground">{stats.attendanceRate}%</p>
              </div>
              <div className="rounded-full bg-cyan-500/10 p-3">
                <GraduationCap className="h-5 w-5 text-cyan-500" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alunos em Risco</p>
                <p className="text-2xl font-bold text-orange-600">{stats.atRiskCount}</p>
              </div>
              <div className="rounded-full bg-orange-500/10 p-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        {selectedStudent ? (
          <div>
            <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="mb-4">
              ← Voltar para lista
            </Button>
            <StudentDetail studentId={selectedStudent} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Absence Notifications Summary - Card Resumido com botão para ver detalhes */}
            <AbsenceNotificationsSummary />

            {/* Smart Alerts Summary - Card Resumido com botão para ver análises */}
            <SmartAlertsSummary />

            {/* Dashboard Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <OverviewCharts classFilter={selectedClass} />
              </div>
              <div>
                <StudentList classFilter={selectedClass} onSelectStudent={setSelectedStudent} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
