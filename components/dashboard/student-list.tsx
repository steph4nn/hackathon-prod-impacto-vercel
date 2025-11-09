"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getStudentsByClass } from "@/lib/mock-data"

interface StudentListProps {
  classFilter: string
  onSelectStudent: (id: string) => void
}

export function StudentList({ classFilter, onSelectStudent }: StudentListProps) {
  const students = getStudentsByClass(classFilter)

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            Alto Risco
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-orange-500 text-xs text-orange-500">
            Médio
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="border-emerald-500 text-xs text-emerald-500">
            Baixo
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Lista de Alunos</h3>
      <div className="max-h-[600px] space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => onSelectStudent(student.id)}
            className="w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{student.name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Média: {student.grade.toFixed(1)}</span>
                  <span>•</span>
                  <span>Freq: {student.attendance}%</span>
                </div>
                <div className="mt-2">{getRiskBadge(student.risk)}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}
