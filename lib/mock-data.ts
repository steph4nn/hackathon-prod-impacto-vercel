import studentsData from "@/data/students.json"
import classesData from "@/data/classes.json"
import subjectPerformanceDataImport from "@/data/subject-performance.json"
import attendanceDataImport from "@/data/attendance-trends.json"
import dailyAbsencesData from "@/data/daily-absences.json"
import dailyAbsencesSummaryData from "@/data/daily-absences-summary.json"

export interface Student {
  id: string
  name: string
  phone: string
  cpf: string
  motherName: string
  motherCpf: string
  motherPhone: string
  neighborhood: string
  address: string
  busRoute: string
  class: string
  grade: number
  attendance: number
  risk: "low" | "medium" | "high"
  gradesHistory: Array<{ month: string; grade: number }>
  subjectGrades: Array<{ subject: string; grade: number }>
  alerts: string[]
}

export interface ClassData {
  id: string
  name: string
  totalStudents: number
  averageGrade: number
  attendanceRate: number
  atRiskCount: number
}

export interface DailyAbsence {
  studentId: string
  studentName: string
  class: string
  date: string
  neighborhood: string
  busRoute: string
  reason: string | null
}

export interface DailyAbsenceSummary {
  date: string
  totalAbsences: number
  byNeighborhood: Record<string, number>
  byBusRoute: Record<string, number>
  byClass: Record<string, number>
}

export const classes: ClassData[] = classesData
export const students: Student[] = studentsData
export const subjectPerformanceData = subjectPerformanceDataImport
export const attendanceData = attendanceDataImport
export const dailyAbsences: DailyAbsence[] = dailyAbsencesData
export const dailyAbsencesSummary: DailyAbsenceSummary[] = dailyAbsencesSummaryData

// Helper functions
export function getStudentsByClass(classId: string): Student[] {
  if (classId === "all") return students
  return students.filter((student) => student.class === classId)
}

export function getStudentById(id: string): Student | undefined {
  return students.find((student) => student.id === id)
}

export function getClassStats(classId: string) {
  const classStudents = getStudentsByClass(classId)
  const totalStudents = classStudents.length
  const averageGrade = classStudents.reduce((sum, s) => sum + s.grade, 0) / totalStudents
  const averageAttendance = classStudents.reduce((sum, s) => sum + s.attendance, 0) / totalStudents
  const atRiskCount = classStudents.filter((s) => s.risk === "high" || s.risk === "medium").length

  return {
    totalStudents,
    averageGrade: Number.parseFloat(averageGrade.toFixed(1)),
    attendanceRate: Math.round(averageAttendance),
    atRiskCount,
  }
}

export function getSubjectPerformanceByClass(classId: string) {
  const classStudents = getStudentsByClass(classId)

  if (classStudents.length === 0) return subjectPerformanceData

  // Calculate average per subject from filtered students
  const subjectMap = new Map<string, { total: number; count: number }>()

  classStudents.forEach((student) => {
    student.subjectGrades.forEach((subjectGrade) => {
      const existing = subjectMap.get(subjectGrade.subject) || { total: 0, count: 0 }
      subjectMap.set(subjectGrade.subject, {
        total: existing.total + subjectGrade.grade,
        count: existing.count + 1,
      })
    })
  })

  // Convert to array format
  return Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    average: Number.parseFloat((data.total / data.count).toFixed(1)),
  }))
}

export function getAttendanceTrendsByClass(classId: string) {
  const classStudents = getStudentsByClass(classId)

  if (classStudents.length === 0) return attendanceData

  // For mock purposes, we'll adjust the attendance data proportionally
  // In a real app, this would come from historical attendance records
  const avgAttendance = classStudents.reduce((sum, s) => sum + s.attendance, 0) / classStudents.length
  const adjustmentFactor = avgAttendance / 85 // 85 is the base average from mock data

  return attendanceData.map((item) => ({
    ...item,
    rate: Math.round(item.rate * adjustmentFactor),
  }))
}

export function getSubjectHistoryByClass(classId: string, subject: string) {
  const classStudents = getStudentsByClass(classId)
  
  // Generate historical data for the last 6 months
  const months = ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"]
  
  // Calculate current average for the subject
  const subjectGrades = classStudents
    .map((student) => student.subjectGrades.find((sg) => sg.subject === subject))
    .filter((grade) => grade !== undefined)
    .map((grade) => grade!.grade)
  
  const currentAverage = subjectGrades.length > 0
    ? subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length
    : 7.5
  
  // Generate historical trend with some variation
  return months.map((month, index) => {
    // Add some realistic variation (-0.5 to +0.5)
    const variation = (Math.random() - 0.5) * 1.0
    // Earlier months have slightly lower averages (improvement trend)
    const trendAdjustment = (index - 2) * 0.15
    const average = Math.max(5, Math.min(10, currentAverage + variation - trendAdjustment))
    
    return {
      month,
      average: Number.parseFloat(average.toFixed(1)),
    }
  })
}

export function getAbsencesByDate(date: string): DailyAbsence[] {
  return dailyAbsences.filter((absence) => absence.date === date)
}

export function getRecentAbsencesSummary(days: number = 7): DailyAbsenceSummary[] {
  return dailyAbsencesSummary
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, days)
}

export function getAbsencesByStudent(studentId: string): DailyAbsence[] {
  return dailyAbsences.filter((absence) => absence.studentId === studentId)
}

export function getStudentSubjectHistory(studentId: string, subject: string) {
  const student = getStudentById(studentId)
  
  if (!student) {
    return []
  }
  
  // Generate historical data for the last 6 months
  const months = ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"]
  
  // Find current grade for the subject
  const subjectGrade = student.subjectGrades.find((sg) => sg.subject === subject)
  const currentGrade = subjectGrade ? subjectGrade.grade : 7.0
  
  // Generate historical trend with some variation
  return months.map((month, index) => {
    // Add some realistic variation (-0.5 to +0.5)
    const variation = (Math.random() - 0.5) * 1.2
    // Earlier months have slightly lower grades (improvement trend)
    const trendAdjustment = (index - 2) * 0.15
    const grade = Math.max(3, Math.min(10, currentGrade + variation - trendAdjustment))
    
    return {
      month,
      grade: Number.parseFloat(grade.toFixed(1)),
    }
  })
}
