"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send,
  Phone
} from "lucide-react"

interface Notification {
  id: string
  studentId: string
  studentName: string
  motherName: string
  motherPhone: string
  date: string
  messageSent: boolean
  sentAt: string
  status: "no_response" | "explained" | "attention"
  motherResponse: string | null
  aiInterpretation: {
    category: string
    summary: string
    requiresAction: boolean
    suggestedAction: string | null
  } | null
  respondedAt: string | null
}

export function AbsenceNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState({
    total: 0,
    noResponse: 0,
    explained: 0,
    attention: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [sending, setSending] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when changing tabs
    fetchNotifications()
  }, [activeTab])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const statusParam = activeTab === "all" ? "" : `&status=${activeTab}`
      const response = await fetch(`/api/absence-notifications?${statusParam}`)
      const data = await response.json()
      
      setNotifications(data.notifications)
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendNotifications = async () => {
    setSending(true)
    try {
      // Usar a data de hoje ou a data com mais faltas
      const today = new Date().toISOString().split('T')[0]
      
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-notifications',
          absenceDate: '2025-11-07' // Data mockada com faltas
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${data.sent} notificações enviadas com sucesso!`)
        fetchNotifications()
      }
    } catch (error) {
      console.error("Error sending notifications:", error)
      alert("❌ Erro ao enviar notificações")
    } finally {
      setSending(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "no_response":
        return (
          <Badge variant="outline" className="border-gray-400">
            <Clock className="mr-1 h-3 w-3" />
            Sem Resposta
          </Badge>
        )
      case "explained":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Explicado
          </Badge>
        )
      case "attention":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Requer Atenção
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Pagination calculations
  const totalPages = Math.ceil(notifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedNotifications = notifications.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of notifications list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notificações de Faltas via WhatsApp
            </CardTitle>
            <CardDescription>
              Sistema automático de contato com responsáveis e interpretação de respostas por IA
            </CardDescription>
          </div>
          <Button onClick={sendNotifications} disabled={sending}>
            {sending ? (
              <>
                <Spinner className="mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Notificações
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Estatísticas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Enviadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Sem Resposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.noResponse}</div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Explicado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.explained}</div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1 text-orange-700">
                <AlertTriangle className="h-4 w-4" />
                Requer Atenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.attention}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs com filtros */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="no_response">Sem Resposta</TabsTrigger>
            <TabsTrigger value="explained">Explicadas</TabsTrigger>
            <TabsTrigger value="attention">Atenção</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {loading ? (
              <div className="text-center py-8">
                <Spinner className="mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Carregando notificações...</p>
              </div>
            ) : notifications.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Nenhuma notificação encontrada para este filtro.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Exibindo {startIndex + 1}-{Math.min(endIndex, notifications.length)} de {notifications.length} notificações
                  </p>
                </div>
                
                <div className="space-y-3">
                  {paginatedNotifications.map((notification) => (
                    <Card key={notification.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{notification.studentName}</h4>
                            {getStatusBadge(notification.status)}
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p className="flex items-center gap-2">
                              <span className="font-medium">Responsável:</span>
                              {notification.motherName}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {notification.motherPhone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4')}
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="font-medium">Falta em:</span>
                              {formatDate(notification.date)}
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="font-medium">Mensagem enviada:</span>
                              {formatDate(notification.sentAt)} às {formatTime(notification.sentAt)}
                            </p>
                          </div>

                          {/* Resposta da mãe */}
                          {notification.motherResponse && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm font-medium text-blue-900 mb-1">
                                💬 Resposta da Mãe:
                              </p>
                              <p className="text-sm text-blue-800">
                                "{notification.motherResponse}"
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                Respondido em: {formatDate(notification.respondedAt!)} às {formatTime(notification.respondedAt!)}
                              </p>
                            </div>
                          )}

                          {/* Interpretação da IA */}
                          {notification.aiInterpretation && (
                            <div className={`mt-3 p-3 rounded-lg border ${
                              notification.status === "attention" 
                                ? "bg-orange-50 border-orange-200"
                                : "bg-green-50 border-green-200"
                            }`}>
                              <p className="text-sm font-medium mb-1">
                                🤖 Análise da IA:
                              </p>
                              <p className="text-sm mb-2">
                                {notification.aiInterpretation.summary}
                              </p>
                              
                              {notification.aiInterpretation.requiresAction && (
                                <Alert className="mt-2 bg-white border-orange-300">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertTitle className="text-sm">Ação Sugerida:</AlertTitle>
                                  <AlertDescription className="text-xs">
                                    {notification.aiInterpretation.suggestedAction}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1
                          
                          // Show first page, last page, current page, and pages around current
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  onClick={() => handlePageChange(pageNumber)}
                                  isActive={currentPage === pageNumber}
                                  className="cursor-pointer"
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )
                          }
                          return null
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

