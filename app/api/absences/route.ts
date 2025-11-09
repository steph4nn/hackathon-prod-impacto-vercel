import { NextRequest } from "next/server"
import {
  dailyAbsences,
  dailyAbsencesSummary,
  getAbsencesByDate,
  getRecentAbsencesSummary,
  getAbsencesByStudent,
} from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type")
  const date = searchParams.get("date")
  const studentId = searchParams.get("studentId")
  const days = Number.parseInt(searchParams.get("days") || "7")

  try {
    if (type === "by-date" && date) {
      const absences = getAbsencesByDate(date)
      return Response.json({ absences })
    }

    if (type === "by-student" && studentId) {
      const absences = getAbsencesByStudent(studentId)
      return Response.json({ absences })
    }

    if (type === "summary") {
      const summary = getRecentAbsencesSummary(days)
      return Response.json({ summary })
    }

    if (type === "all") {
      return Response.json({ absences: dailyAbsences })
    }

    // Default: retorna resumo dos últimos 7 dias
    const summary = getRecentAbsencesSummary(7)
    return Response.json({ summary })
  } catch (error) {
    console.error("Error fetching absences:", error)
    return Response.json({ error: "Failed to fetch absences" }, { status: 500 })
  }
}

