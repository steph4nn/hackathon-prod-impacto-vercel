"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MarkdownViewer } from "@/components/ui/markdown-viewer"
import { AlertTriangle, CheckCircle2, Info, Copy, ChevronDown, ChevronUp, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StructuredAnalysisProps {
  analysis: string
  className?: string
}

interface Section {
  title: string
  content: string
  type: "alert" | "action" | "context"
}

export function StructuredAnalysis({ analysis, className }: StructuredAnalysisProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    alert: true,
    action: true,
    context: true,
  })
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  // Parse the analysis text into sections
  const parseAnalysis = (text: string): Section[] => {
    const sectionMap: Record<string, Section> = {
      alert: { title: "Alertas Prioritários", content: "", type: "alert" },
      action: { title: "Ações Recomendadas", content: "", type: "action" },
      context: { title: "Contexto", content: "", type: "context" },
    }
    
    // Split by main section headers (###)
    const parts = text.split(/###\s+/)
    
    parts.forEach((part, index) => {
      if (index === 0 && !part.includes("###")) {
        // This is content before the first section header (if any)
        if (part.trim()) {
          sectionMap.context.content += part.trim() + "\n\n"
        }
        return
      }
      
      const lines = part.split("\n")
      const title = lines[0].trim()
      const content = lines.slice(1).join("\n").trim()
      
      if (!content) return
      
      // Determine section type based on title - more robust matching
      let type: "alert" | "action" | "context" = "context"
      const titleLower = title.toLowerCase()
      
      // Check for alerts (prioritize this check)
      if (titleLower.includes("alerta") || 
          titleLower.includes("prioritário") || 
          titleLower.includes("crítico") ||
          titleLower.includes("padrões identificados") ||
          titleLower.includes("status do dia")) {
        type = "alert"
        if (!sectionMap.alert.content) {
          sectionMap.alert.title = title
        }
      } 
      // Check for actions
      else if (titleLower.includes("ação") || 
               titleLower.includes("ações") || 
               titleLower.includes("recomenda") ||
               titleLower.includes("estratégia") ||
               titleLower.includes("intervenção") ||
               titleLower.includes("próximos passos")) {
        type = "action"
        if (!sectionMap.action.content) {
          sectionMap.action.title = title
        }
      } 
      // Check for context
      else if (titleLower.includes("contexto") || 
               titleLower.includes("resumo") ||
               titleLower.includes("recursos necessários") ||
               titleLower.includes("panorama")) {
        type = "context"
        if (!sectionMap.context.content) {
          sectionMap.context.title = title
        }
      }
      
      // Append content to the appropriate section
      sectionMap[type].content += content + "\n\n"
    })
    
    // Return only sections that have content, in the desired order
    return [sectionMap.alert, sectionMap.action, sectionMap.context]
      .filter((section) => section.content.trim().length > 0)
  }

  const sections = parseAnalysis(analysis)

  const toggleSection = (type: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(sectionId)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const copyAllAnalysis = () => {
    copyToClipboard(analysis, "all")
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5" />
      case "action":
        return <CheckCircle2 className="h-5 w-5" />
      case "context":
        return <Info className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getSectionColor = (type: string) => {
    switch (type) {
      case "alert":
        return {
          border: "border-red-200 dark:border-red-900",
          bg: "bg-red-50 dark:bg-red-950/20",
          iconColor: "text-red-600 dark:text-red-400",
          titleColor: "text-red-900 dark:text-red-100",
        }
      case "action":
        return {
          border: "border-blue-200 dark:border-blue-900",
          bg: "bg-blue-50 dark:bg-blue-950/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          titleColor: "text-blue-900 dark:text-blue-100",
        }
      case "context":
        return {
          border: "border-gray-200 dark:border-gray-800",
          bg: "bg-gray-50 dark:bg-gray-900/20",
          iconColor: "text-gray-600 dark:text-gray-400",
          titleColor: "text-gray-900 dark:text-gray-100",
        }
      default:
        return {
          border: "border-gray-200",
          bg: "bg-gray-50",
          iconColor: "text-gray-600",
          titleColor: "text-gray-900",
        }
    }
  }

  if (sections.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none">
            <MarkdownViewer content={analysis} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={copyAllAnalysis}
          className="gap-2"
        >
          {copiedSection === "all" ? (
            <>
              <Check className="h-4 w-4" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copiar Análise Completa
            </>
          )}
        </Button>
      </div>

      {sections.map((section) => {
        const colors = getSectionColor(section.type)
        const isExpanded = expandedSections[section.type]
        const sectionId = section.type

        return (
          <Card
            key={sectionId}
            className={cn("border-2 transition-colors", colors.border, colors.bg)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn("rounded-full p-2 bg-background", colors.iconColor)}>
                    {getSectionIcon(section.type)}
                  </div>
                  <CardTitle className={cn("text-lg", colors.titleColor)}>
                    {section.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(section.content, sectionId)}
                    className="h-8 w-8 p-0"
                  >
                    {copiedSection === sectionId ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection(section.type)}
                    className="h-8 w-8 p-0"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none">
                  <MarkdownViewer content={section.content} />
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}

