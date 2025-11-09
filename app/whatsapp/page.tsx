"use client"

import { WhatsAppConnection } from "@/components/dashboard/whatsapp-connection"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { 
  MessageSquare, 
  Brain, 
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowLeft,
  GraduationCap,
  Download,
  Smartphone
} from "lucide-react"

export default function WhatsAppPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Integração WhatsApp + IA</h1>
                <p className="text-sm text-muted-foreground">Sistema automatizado de notificação</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/notificacoes">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <AlertTriangle className="h-4 w-4" />
                  Notificações
                </Button>
              </Link>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Seção: Como Funciona */}
        <div className="mb-8 space-y-4">
          <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
            <CardHeader className="pb-3">
              <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle className="text-lg">Envio Automático</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mensagens enviadas automaticamente via WhatsApp para as mães dos alunos faltantes
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/30">
            <CardHeader className="pb-3">
              <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle className="text-lg">Análise com IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Respostas processadas automaticamente pela OpenAI e classificadas em categorias
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30">
            <CardHeader className="pb-3">
              <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" />
              <CardTitle className="text-lg">Alertas Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Problemas estruturais identificados e notificados para ação imediata da gestora
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Conexão WhatsApp */}
        <WhatsAppConnection />

        {/* Como funciona */}
        <Card>
          <CardHeader>
            <CardTitle>Como Funciona o Sistema</CardTitle>
            <CardDescription>
              Fluxo completo de automação de notificações e análise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Passo 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Detecção de Faltas</h3>
                <p className="text-sm text-muted-foreground">
                  O sistema monitora diariamente as faltas dos alunos. Quando uma falta é detectada, 
                  uma notificação é automaticamente preparada.
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Envio via WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  Uma mensagem educada e profissional é enviada para o telefone da mãe/responsável, 
                  perguntando sobre o motivo da falta e oferecendo ajuda.
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Recebimento Automático</h3>
                <p className="text-sm text-muted-foreground">
                  Quando a mãe responde, o sistema captura automaticamente a mensagem e envia 
                  uma confirmação de recebimento.
                </p>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Análise com IA (OpenAI)</h3>
                <p className="text-sm text-muted-foreground">
                  A resposta é enviada para a OpenAI GPT-4 que analisa e classifica em 3 categorias:
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-green-700">Falta Explicada:</strong> Justificativas comuns 
                      como doença, consulta médica, viagem familiar
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-orange-700">Alerta:</strong> Problemas que a gestora pode 
                      resolver: transporte, dificuldade financeira, bullying, problemas estruturais
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Ação da Gestora</h3>
                <p className="text-sm text-muted-foreground">
                  Casos marcados como "Alerta" aparecem no dashboard com sugestões de ação. 
                  A gestora pode tomar medidas imediatas para resolver problemas estruturais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exemplos de Classificação */}
        <Card>
          <CardHeader>
            <CardTitle>Exemplos de Classificação pela IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-300">Falta Explicada</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                <strong>Resposta:</strong> "Ele está com febre alta, levei no médico"<br/>
                <strong>Ação:</strong> Nenhuma ação necessária, situação compreensível
              </AlertDescription>
            </Alert>

            <Alert className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertTitle className="text-orange-800 dark:text-orange-300">Alerta - Requer Atenção</AlertTitle>
              <AlertDescription className="text-orange-700 dark:text-orange-400">
                <strong>Resposta:</strong> "O ônibus não passou hoje, já é a terceira vez esse mês"<br/>
                <strong>Ação Sugerida:</strong> Gestora deve contatar a secretaria de transporte escolar 
                imediatamente. Problema sistêmico afetando múltiplos alunos.
              </AlertDescription>
            </Alert>

            <Alert className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertTitle className="text-orange-800 dark:text-orange-300">Alerta - Bullying</AlertTitle>
              <AlertDescription className="text-orange-700 dark:text-orange-400">
                <strong>Resposta:</strong> "Ela não quer ir porque os colegas ficam zoando do uniforme velho"<br/>
                <strong>Ação Sugerida:</strong> 1) Providenciar uniforme através da assistência social, 
                2) Conversar com a turma sobre respeito, 3) Acompanhar a aluna
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Requisitos */}
        <Card>
          <CardHeader>
            <CardTitle>Requisitos Técnicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <strong>whatsapp-web.js:</strong> Biblioteca para integração com WhatsApp Web
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <strong>OpenAI API:</strong> GPT-4 para análise inteligente das respostas
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <strong>Processamento Automático:</strong> Sistema detecta e processa respostas em tempo real
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

