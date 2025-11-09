import type { Student } from "./mock-data"

// CSV Export
export function exportToCSV(data: Student[], filename = "students-report.csv") {
  // Create CSV header
  const headers = ["ID", "Nome", "Turma", "Média", "Frequência (%)", "Nível de Risco", "Alertas"]

  // Create CSV rows
  const rows = data.map((student) => [
    student.id,
    student.name,
    student.class,
    student.grade.toString(),
    student.attendance.toString(),
    student.risk === "high" ? "Alto" : student.risk === "medium" ? "Médio" : "Baixo",
    student.alerts.join("; "),
  ])

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Detailed CSV Export with subject grades
export function exportDetailedCSV(data: Student[], filename = "students-detailed-report.csv") {
  // Create CSV header
  const headers = [
    "ID",
    "Nome",
    "Turma",
    "Média Geral",
    "Frequência (%)",
    "Nível de Risco",
    "Matemática",
    "Português",
    "História",
    "Geografia",
    "Ciências",
    "Inglês",
    "Alertas",
  ]

  // Create CSV rows
  const rows = data.map((student) => {
    const subjectMap = student.subjectGrades.reduce(
      (acc, sg) => {
        acc[sg.subject] = sg.grade
        return acc
      },
      {} as Record<string, number>,
    )

    return [
      student.id,
      student.name,
      student.class,
      student.grade.toString(),
      student.attendance.toString(),
      student.risk === "high" ? "Alto" : student.risk === "medium" ? "Médio" : "Baixo",
      (subjectMap["Matemática"] || 0).toString(),
      (subjectMap["Português"] || 0).toString(),
      (subjectMap["História"] || 0).toString(),
      (subjectMap["Geografia"] || 0).toString(),
      (subjectMap["Ciências"] || 0).toString(),
      (subjectMap["Inglês"] || 0).toString(),
      student.alerts.join("; "),
    ]
  })

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// PDF Export using browser print
export function exportToPDF(
  data: Student[],
  stats: { totalStudents: number; averageGrade: number; attendanceRate: number; atRiskCount: number },
  classFilter: string,
) {
  // Create a new window with formatted content
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const className = classFilter === "all" ? "Todas as Turmas" : classFilter.toUpperCase()

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Relatório de Alunos - ${className}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          h1 { font-size: 24px; margin-bottom: 10px; color: #8b5cf6; }
          h2 { font-size: 18px; margin: 30px 0 15px; color: #666; }
          .subtitle { color: #666; margin-bottom: 30px; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
          .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; }
          .stat-label { font-size: 12px; color: #666; margin-bottom: 5px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
          td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
          .risk-high { color: #dc2626; font-weight: 600; }
          .risk-medium { color: #f59e0b; font-weight: 600; }
          .risk-low { color: #10b981; font-weight: 600; }
          .alerts { font-size: 12px; color: #666; max-width: 250px; }
          @media print {
            body { padding: 20px; }
            .stats { page-break-inside: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <h1>Dashboard Analítico - Relatório de Alunos</h1>
        <div class="subtitle">Sistema de Acompanhamento de Alunos | ${className}</div>
        
        <h2>Resumo Geral</h2>
        <div class="stats">
          <div class="stat-card">
            <div class="stat-label">Total de Alunos</div>
            <div class="stat-value">${stats.totalStudents}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Média Geral</div>
            <div class="stat-value">${stats.averageGrade}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Taxa de Frequência</div>
            <div class="stat-value">${stats.attendanceRate}%</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Alunos em Risco</div>
            <div class="stat-value">${stats.atRiskCount}</div>
          </div>
        </div>

        <h2>Lista de Alunos</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Turma</th>
              <th>Média</th>
              <th>Frequência</th>
              <th>Nível de Risco</th>
              <th>Alertas</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (student) => `
              <tr>
                <td>${student.name}</td>
                <td>${student.class.toUpperCase()}</td>
                <td>${student.grade}</td>
                <td>${student.attendance}%</td>
                <td class="risk-${student.risk}">
                  ${student.risk === "high" ? "Alto" : student.risk === "medium" ? "Médio" : "Baixo"}
                </td>
                <td class="alerts">${student.alerts.length > 0 ? student.alerts.join("; ") : "-"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
    </html>
  `)

  printWindow.document.close()
}
