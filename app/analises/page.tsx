"use client"

import { Button } from "@/components/ui/button"
import { SmartAlerts } from "@/components/dashboard/smart-alerts"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function AnalisesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "attendance"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.push("/")}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Análises Inteligentes com IA</h1>
                <p className="text-sm text-muted-foreground">Detecte padrões e receba alertas automáticos</p>
              </div>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <SmartAlerts defaultTab={tab} />
      </main>
    </div>
  )
}

export default function AnalisesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AnalisesContent />
    </Suspense>
  )
}

