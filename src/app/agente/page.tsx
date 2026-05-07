"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Dices, Layers, BarChart2, History, User, LogOut, Loader2, Send, Bot, RefreshCw } from "lucide-react"

const API_BACKEND = "https://lotologic-api-production.up.railway.app"

function Logo() {
  return (
    <span className="text-2xl font-extrabold tracking-tight">
      <span className="text-amber-400">Loto</span>
      <span className="text-blue-500">Logic</span>
    </span>
  )
}

const NAV = [
  { href: "/dashboard",     label: "Dashboard",     icon: BarChart2 },
  { href: "/gerar",         label: "Gerar jogo",    icon: Dices     },
  { href: "/desdobramento", label: "Desdobramento", icon: Layers    },
  { href: "/analise",       label: "Análise",       icon: BarChart2 },
  { href: "/historico",     label: "Histórico",     icon: History   },
  { href: "/perfil",        label: "Perfil",        icon: User      },
]

interface Message {
  role: "user" | "assistant"
  content: string
}

const QUICK_QUESTIONS = [
  "Quais números saem mais na Mega-Sena?",
  "Como funciona a análise por coluna?",
  "O que são números fortes e fracos?",
  "Me ajuda a montar um jogo de 7 dezenas",
  "Qual a diferença entre par e ímpar nas colunas?",
  "Quais números âncora você sugere?",
]

export default function AgentePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou o assistente estatístico do LotoLogic. Posso te ajudar a entender os padrões históricos dos sorteios, explicar a análise por colunas, sugerir estratégias e responder qualquer dúvida sobre Mega-Sena e Lotofácil. O que você gostaria de saber? 🎯",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [statsContext, setStatsContext] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    loadStatsContext()
  }, [])

  async function loadStatsContext() {
    try {
      const [statusRes, megaRes, lotoRes] = await Promise.all([
        fetch(`${API_BACKEND}/api/stats/status`),
        fetch(`${API_BACKEND}/api/stats/megasena/column/1`),
        fetch(`${API_BACKEND}/api/stats/lotofacil/column/1`),
      ])
      const status = await statusRes.json()
      const mega = await megaRes.json()
      const loto = await lotoRes.json()

      setStatsContext(`
Base histórica: ${status.megasena} sorteios da Mega-Sena e ${status.lotofacil} sorteios da Lotofácil (todos de 2025).

Mega-Sena - Coluna 1 - Números fortes: ${mega.strong?.slice(0,5).map((e: any) => e.number).join(', ')}.
Mega-Sena - Coluna 1 - Par: ${mega.oddEven?.evenPct}%, Ímpar: ${mega.oddEven?.oddPct}%.

Lotofácil - Coluna 1 - Números fortes: ${loto.strong?.slice(0,5).map((e: any) => e.number).join(', ')}.
      `.trim())
    } catch {}
  }

  async function sendMessage(text?: string) {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput("")

    const newMessages: Message[] = [...messages, { role: "user", content: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const systemPrompt = `Você é o assistente especialista em loterias do LotoLogic, uma plataforma de análise estatística de loterias brasileiras (Mega-Sena e Lotofácil).

Você tem acesso aos dados estatísticos reais:
${statsContext}

Seu papel é:
- Explicar a lógica de análise por colunas (cada posição do sorteio analisada separadamente)
- Ajudar o apostador a entender números fortes, médios e fracos
- Explicar a importância do equilíbrio par/ímpar em cada coluna
- Sugerir estratégias baseadas no histórico real de 2025
- Explicar como usar números âncora
- Calcular custos de apostas com múltiplas dezenas
- Manter o apostador motivado com análises próximas ("você passou perto!")

Regras:
- Seja sempre positivo e encorajador
- Use dados reais quando disponíveis
- Explique de forma simples para leigos
- Nunca prometa ganhos — sempre fale em probabilidades
- Quando sugerir números, baseie-se na análise estatística
- Responda em português brasileiro, de forma natural e amigável
- Seja conciso mas completo`

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_KEY || "", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()
      const assistantText = data.content?.[0]?.text || "Desculpe, tive um problema ao responder. Tente novamente!"

      setMessages([...newMessages, { role: "assistant", content: assistantText }])
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Ops! Tive um problema de conexão. Tente novamente em instantes." }])
    }
    setLoading(false)
  }

  function clearChat() {
    setMessages([{
      role: "assistant",
      content: "Conversa reiniciada! Como posso te ajudar com a análise estatística? 🎯",
    }])
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A0E1A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden gap-1 sm:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                <Icon size={13} />{label}
              </Link>
            ))}
          </nav>
          <button className="flex items-center gap-1 text-xs text-slate-500"><LogOut size={13} /> Sair</button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Bot size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Agente Estatístico</p>
              <p className="text-xs text-slate-400">Especialista em Mega-Sena e Lotofácil</p>
            </div>
          </div>
          <button onClick={clearChat} className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 transition-colors">
            <RefreshCw size={12} /> Nova conversa
          </button>
        </div>

        {/* Quick questions */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-2 gap-2">
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                className="rounded-xl border border-slate-700 bg-[#111827] px-3 py-2.5 text-left text-xs text-slate-300 hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-white transition-colors">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <Bot size={14} className="text-blue-400" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-amber-500/20 border border-amber-500/30 text-amber-100 rounded-tr-sm"
                  : "bg-[#111827] border border-slate-700 text-slate-200 rounded-tl-sm"
              }`}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
                <Bot size={14} className="text-blue-400" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-[#111827] border border-slate-700 px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 rounded-xl border border-slate-700 bg-[#111827] p-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Pergunte sobre estratégias, números, probabilidades..."
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder-slate-500 outline-none"
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-[#0A0E1A] hover:bg-amber-400 disabled:opacity-40 transition-colors">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
