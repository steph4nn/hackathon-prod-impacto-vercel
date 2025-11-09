# 🎓 Sistema de Gestão Escolar com IA e WhatsApp

> **Hackathon Dev Impacto** - Sistema inteligente para identificar e resolver problemas estruturais que afetam a educação

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green)](https://openai.com/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Web.js-25D366)](https://github.com/pedroslopez/whatsapp-web.js)

---

## 🌟 Visão Geral

Sistema completo de gestão escolar que combina **análise de dados**, **notificações automatizadas via WhatsApp** e **inteligência artificial** para ajudar gestores a identificar e resolver problemas estruturais que impedem alunos de frequentarem a escola.

### 🎯 Problema que Resolvemos

Quando um aluno falta, pode ser:
- ✅ **Justificativa normal** (doença, consulta) - Não requer ação
- 🚨 **Problema estrutural** (ônibus não passou, bullying, dificuldade financeira) - **REQUER AÇÃO IMEDIATA**

O sistema **automaticamente identifica** qual é qual usando IA, permitindo que gestores ajam rapidamente em casos críticos.

---

## ✨ Funcionalidades Principais

### 📱 1. Notificações Automáticas via WhatsApp

- Envia mensagens personalizadas para mães de alunos faltantes
- Recebe respostas automaticamente
- Confirma recebimento de forma educada

### 🤖 2. Análise com Inteligência Artificial (OpenAI GPT-4)

Classifica automaticamente as respostas em **3 categorias**:

| Categoria | Descrição | Ação |
|-----------|-----------|------|
| 📗 **Falta Explicada** | Doença, consulta, evento familiar | Nenhuma ação necessária |
| 🚨 **Alerta** | Transporte, financeiro, bullying, problemas estruturais | **Ação imediata da gestora** |
| ⏰ **Não Respondida** | Mãe ainda não respondeu | Aguardando resposta |

### 🎯 3. Sugestões Inteligentes de Ação

Para cada alerta, a IA sugere **ações específicas**:

```
Exemplo: "Ônibus não passou, já é a terceira vez esse mês"

Sugestão da IA:
"URGENTE: Gestora deve contatar a secretaria de transporte 
escolar imediatamente. Problema sistêmico afetando múltiplos 
alunos."
```

### 📊 4. Dashboard Analítico Completo

- Estatísticas em tempo real
- Gráficos de desempenho e frequência
- Alertas inteligentes
- Análise por turma e aluno
- Exportação de relatórios (CSV, PDF)

---

## 🚀 Início Rápido (5 minutos)

### 1️⃣ Instalação

```bash
# Clone o repositório
git clone [seu-repo]
cd hackathon-dev-impacto

# Instale as dependências
npm install
```

### 2️⃣ Configuração

Crie `.env.local` na raiz:

```env
OPENAI_API_KEY=sk-sua-key-aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3️⃣ Iniciar

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### 4️⃣ Conectar WhatsApp

1. Acesse: `http://localhost:3000/whatsapp`
2. Clique em "Conectar WhatsApp"
3. Escaneie o QR Code com seu celular
4. Aguarde a confirmação ✅

### 5️⃣ Enviar Notificações

1. Acesse: `http://localhost:3000/notificacoes`
2. Clique em "Enviar Notificações"
3. As respostas serão processadas automaticamente!

**📖 Guia completo:** Veja [`INICIO-RAPIDO.md`](./INICIO-RAPIDO.md)

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [`INICIO-RAPIDO.md`](./INICIO-RAPIDO.md) | ⚡ Comece em 5 minutos |
| [`SETUP-INSTRUCOES.md`](./SETUP-INSTRUCOES.md) | 📖 Instruções detalhadas de configuração |
| [`README-WHATSAPP.md`](./README-WHATSAPP.md) | 📱 Documentação da integração WhatsApp |
| [`COMO-FUNCIONA.md`](./COMO-FUNCIONA.md) | 🔧 Explicação técnica do sistema |

---

## 🎯 Casos de Uso Reais

### Caso 1: Problema de Transporte Escolar 🚌

**Resposta da Mãe:**
> "O ônibus não passou hoje, já é a terceira vez esse mês"

**Análise da IA:**
- **Categoria:** 🚨 Alerta
- **Resumo:** Problema de transporte escolar recorrente
- **Ação Sugerida:** Contatar secretaria de transporte imediatamente

**Resultado:** Gestora resolve problema sistêmico, **múltiplos alunos beneficiados**

### Caso 2: Bullying + Vulnerabilidade Social 👕

**Resposta da Mãe:**
> "Ela não quer ir. Os colegas zoam do uniforme velho. Não tenho dinheiro pra comprar novo"

**Análise da IA:**
- **Categoria:** 🚨 Alerta
- **Resumo:** Bullying + dificuldade financeira
- **Ação Sugerida:** 
  1. Providenciar uniforme via assistência social
  2. Conversar com turma sobre respeito
  3. Acompanhar a aluna

**Resultado:** Aluna volta à escola com dignidade, **problema social resolvido**

### Caso 3: Doença 🤒

**Resposta da Mãe:**
> "Ele está com febre alta, levei no médico"

**Análise da IA:**
- **Categoria:** 📗 Falta Explicada
- **Resumo:** Aluno doente, já em atendimento médico
- **Ação:** Nenhuma necessária

**Resultado:** Gestora foca em casos que **realmente precisam de intervenção**

---

## 🏗️ Tecnologias Utilizadas

### Frontend
- **Next.js 16** - Framework React com SSR
- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Recharts** - Gráficos e visualizações

### Backend
- **Next.js API Routes** - Backend serverless
- **whatsapp-web.js** - Integração WhatsApp
- **OpenAI SDK** - Análise com IA (GPT-4)
- **Node.js** - Runtime

### Banco de Dados
- **JSON local** - Demonstração (pode ser migrado para DB real)

---

## 📊 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js)                │
│  Dashboard │ Notificações │ Configuração WhatsApp   │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              BACKEND (API Routes)                   │
│  /api/whatsapp │ /api/absence-notifications        │
└─────────┬───────────────────────┬───────────────────┘
          │                       │
┌─────────▼─────────┐   ┌────────▼─────────┐
│  WhatsApp Web.js  │   │   OpenAI GPT-4   │
│  (Envio/Recebe)   │   │  (Classificação) │
└───────────────────┘   └──────────────────┘
```

**Fluxo completo:** Veja [`COMO-FUNCIONA.md`](./COMO-FUNCIONA.md)

---

## 🧪 Testes

### Teste Manual
```bash
# Inicie o servidor
npm run dev

# Conecte o WhatsApp em /whatsapp
# Envie notificações em /notificacoes
# Responda do seu celular
# Veja a análise automática
```

### Teste Automatizado
```bash
npm run test:whatsapp
```

Testa 5 cenários e valida a classificação da IA.

---

## 📁 Estrutura do Projeto

```
hackathon-dev-impacto/
├── app/
│   ├── api/
│   │   ├── whatsapp/              # API WhatsApp
│   │   │   ├── init/route.ts     # Inicialização
│   │   │   └── route.ts          # Envio de mensagens
│   │   └── absence-notifications/ # API de notificações
│   │       └── route.ts          # Processamento com IA
│   ├── whatsapp/page.tsx         # Página de configuração
│   ├── notificacoes/page.tsx     # Dashboard de notificações
│   └── page.tsx                  # Dashboard principal
├── components/
│   └── dashboard/
│       ├── whatsapp-connection.tsx
│       ├── absence-notifications.tsx
│       └── [outros componentes]
├── lib/
│   └── whatsapp-service.ts       # Serviço WhatsApp (核心)
├── data/
│   └── absence-notifications.json # Banco de notificações
├── scripts/
│   ├── test-whatsapp-integration.js
│   └── init-whatsapp.js
└── [documentação...]
```

---

## 🔒 Segurança

- ✅ API Keys em variáveis de ambiente
- ✅ `.env.local` no `.gitignore`
- ✅ Autenticação WhatsApp via QR Code
- ✅ Sessão persistente com LocalAuth
- ✅ Dados locais protegidos

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes

---

## 🎓 Desenvolvido para o Hackathon Dev Impacto

### 🎯 Missão

Usar tecnologia para **identificar e resolver problemas estruturais** que impedem alunos de terem acesso à educação de qualidade.

### 💡 Impacto Social

- ✅ Reduz evasão escolar
- ✅ Identifica problemas sistêmicos (transporte, merenda, etc)
- ✅ Detecta casos de vulnerabilidade social
- ✅ Permite intervenção rápida em casos de bullying
- ✅ Conecta escola e família de forma eficiente

### 🚀 Próximas Melhorias

- [ ] Integração com banco de dados real
- [ ] Dashboard de métricas e tendências
- [ ] Sistema de agendamento de envios
- [ ] Múltiplos idiomas
- [ ] Integração com SMS e Email
- [ ] Machine Learning para previsão de evasão

---

## 📞 Suporte

Encontrou algum problema? 

1. Verifique a [documentação](./SETUP-INSTRUCOES.md)
2. Veja o [troubleshooting](./SETUP-INSTRUCOES.md#troubleshooting)
3. Abra uma [issue](../../issues)

---

## ⭐ Agradecimentos

- **OpenAI** - Por democratizar o acesso à IA
- **WhatsApp Web.js** - Pela excelente biblioteca
- **Next.js** - Pelo incrível framework
- **Hackathon Dev Impacto** - Pela oportunidade de fazer a diferença

---

<div align="center">

**Desenvolvido com ❤️ para melhorar a educação**

[Ver Demo](#) | [Documentação](./INICIO-RAPIDO.md) | [Reportar Bug](../../issues)

</div>

