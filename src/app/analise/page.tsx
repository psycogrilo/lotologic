"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Dices, Layers, BarChart2, History, User, LogOut, CheckCircle2, Circle, AlertCircle, XCircle, TrendingUp, Minus, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const API = "https://lotologic-api-production.up.railway.app"

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

type Status = "exact" | "group" | "nearby" | "miss"
type LotteryId = "megasena" | "quina" | "lotofacil"

const STATUS_CFG = {
  exact:  { label: "Exact",  cardCls: "border-emerald-500/30 bg-emerald-500/5",  ballCls: "bg-emerald-500/20 border-emerald-500/60 text-emerald-200", drawnCls: "text-emerald-400", icon: CheckCircle2, iconCls: "text-emerald-400" },
  group:  { label: "Group",  cardCls: "border-amber-500/30 bg-amber-500/5",      ballCls: "bg-amber-500/20 border-amber-500/60 text-amber-200",       drawnCls: "text-amber-400",   icon: Circle,       iconCls: "text-amber-400"   },
  nearby: { label: "Nearby", cardCls: "border-orange-500/30 bg-orange-500/5",    ballCls: "bg-orange-500/20 border-orange-500/60 text-orange-200",     drawnCls: "text-orange-400",  icon: AlertCircle,  iconCls: "text-orange-400"  },
  miss:   { label: "Miss",   cardCls: "border-slate-600/30 bg-slate-800/30",     ballCls: "bg-slate-700/40 border-slate-600 text-slate-400",           drawnCls: "text-slate-400",   icon: XCircle,      iconCls: "text-slate-500"   },
}

const LOTTERIES: { id: LotteryId; label: string; draw: number }[] = [
  { id: "megasena",  label: "Mega-Sena",  draw: 6  },
  { id: "quina",     label: "Quina",      draw: 5  },
  { id: "lotofacil", label: "Lotofácil",  draw: 15 },
]

export default function AnalisePage() {
  const [lotteryId, setLotteryId] = useState<LotteryId>("megasena")
  const [concurso, setConcurso]   = useState("")
  const [concursoDate, setConcursoDate] = useState("")
  const [drawnNumbers, setDrawnNumbers] = useState<(number|"")[]>(Array(6).fill(""))
  const [playedNumbers, setPlayedNumbers] = useState<(number|"")[]>(Array(6).fill(""))
  const [analyzed, setAnalyzed]   = useState(false)
  const [loadingDraw, setLoadingDraw] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [cols, setCols]           = useState<any[]>([])
  const [score, setScore]         = useState(0)
  const [insight, setInsight]     = useState("")

  const lottery = LOTTERIES.find(l => l.id === lotteryId)!

  // Buscar último resultado automaticamente ao trocar loteria
  useEffect(() => {
    fetchLatest()
  }, [lotteryId])

  async function fetchLatest() {
    setLoadingDraw(true)
    setAnalyzed(false)
    try {
      const res  = await fetch(`${API}/api/draws/latest/${lotteryId}`)
      const data = await res.json()
      if (data.numbers?.length) {
        setDrawnNumbers(data.numbers)
        setConcurso(String(data.concurso))
        setConcursoDate(data.date ? new Date(data.date).toLocaleDateString("pt-BR") : "")
      }
    } catch {}
    setLoadingDraw(false)
  }

  async function fetchByConcurso() {
    if (!concurso) return
    setLoadingDraw(true)
    setAnalyzed(false)
    try {
      const res  = await fetch(`${API}/api/draws/${lotteryId}/${concurso}`)
      const data = await res.json()
      if (data.numbers?.length) {
        setDrawnNumbers(data.numbers)
        setConcursoDate(data.date ? new Date(data.date).toLocaleDateString("pt-BR") : "")
      }
    } catch {}
    setLoadingDraw(false)
  }

  async function analyze() {
    const drawn  = drawnNumbers.map(Number).filter(n => n > 0)
    const played = playedNumbers.map(Number).filter(n => n > 0)
    if (drawn.length !== lottery.draw || played.length !== lottery.draw) return
    setAnalyzing(true)
    try {
      const res  = await fetch(`${API}/api/analysis/post-draw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lottery: lotteryId, drawn, played }),
      })
      const data = await res.json()
      setCols(data.cols || [])
      setScore(data.overallScore || 0)
      setInsight(data.insight || "")
      setAnalyzed(true)
    } catch {}
    setAnalyzing(false)
  }

  const drawnFilled  = drawnNumbers.filter(n => n !== "").length
  const playedFilled = playedNumbers.filter(n => n !== "").length
  const canAnalyze   = drawnFilled === lottery.draw && playedFilled === lottery.draw

  const exact  = cols.filter(c => c.status === "exact").length
  const group  = cols.filter(c => c.status === "group").length
  const nearby = cols.filter(c => c.status === "nearby").length
  const miss   = cols.filter(c => c.status === "miss").length

  const gridCols = lottery.draw <= 6 ? lottery.draw : lottery.draw <= 10 ? 5 : 8

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A0E1A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden gap-1 sm:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                href === "/analise" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}><Icon size={13} />{label}</Link>
            ))}
          </nav>
          <button className="flex items-center gap-1 text-xs text-slate-500"><LogOut size={13} /> Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-white">Análise pós-sorteio</h1>
          <p className="mt-1 text-sm text-slate-400">Compare seu jogo com o resultado oficial coluna a coluna</p>
        </div>

        {/* Lottery tabs */}
        <div className="flex gap-1 rounded-xl border border-slate-800 bg-[#111827] p-1">
          {LOTTERIES.map(({ id, label }) => (
            <button key={id} onClick={() => { setLotteryId(id); setPlayedNumbers(Array(LOTTERIES.find(l=>l.id===id)!.draw).fill("")); setAnalyzed(false) }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${lotteryId===id ? "bg-amber-500 text-[#0A0E1A]" : "text-slate-400 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Resultado oficial */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
          <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm font-semibold text-white">Resultado oficial</p>
              {concurso && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Concurso <strong className="text-amber-400">{concurso}</strong>
                  {concursoDate && <> · {concursoDate}</>}
                </p>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" placeholder="Nº concurso" value={concurso}
                onChange={e => setConcurso(e.target.value)}
                className="w-32 rounded-lg border border-slate-700 bg-[#1a2035] px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={fetchByConcurso} disabled={loadingDraw}
                className="rounded-lg border border-slate-700 bg-[#1a2035] px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40">
                Buscar
              </button>
              <button onClick={fetchLatest} disabled={loadingDraw} title="Buscar último resultado"
                className="rounded-lg border border-slate-700 bg-[#1a2035] p-1.5 text-slate-300 hover:bg-slate-800 disabled:opacity-40">
                {loadingDraw ? <Loader2 size={14} className="animate-spin"/> : <RefreshCw size={14}/>}
              </button>
            </div>
          </div>

          {loadingDraw ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 size={14} className="animate-spin text-amber-400"/> Buscando resultado da Caixa...
            </div>
          ) : (
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0,1fr))` }}>
              {drawnNumbers.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-semibold text-slate-500">Col {i+1}</span>
                  <input type="number" min={1} max={60} value={v === "" ? "" : v}
                    onChange={e => { const a=[...drawnNumbers]; a[i]=e.target.value===""?"":Number(e.target.value); setDrawnNumbers(a); setAnalyzed(false) }}
                    className="w-full rounded-lg border border-slate-700 bg-[#1a2035] py-1.5 text-center text-sm font-bold text-white outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="—" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seu jogo */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
          <p className="mb-3 text-sm font-semibold text-white">Seu jogo</p>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0,1fr))` }}>
            {playedNumbers.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-semibold text-slate-500">Col {i+1}</span>
                <input type="number" min={1} max={60} value={v === "" ? "" : v}
                  onChange={e => { const a=[...playedNumbers]; a[i]=e.target.value===""?"":Number(e.target.value); setPlayedNumbers(a); setAnalyzed(false) }}
                  className="w-full rounded-lg border border-amber-500/30 bg-[#1a2035] py-1.5 text-center text-sm font-bold text-white outline-none focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="—" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {analyzed && (
            <Button variant="outline" onClick={() => { setAnalyzed(false); setPlayedNumbers(Array(lottery.draw).fill("")) }}
              className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Nova análise
            </Button>
          )}
          <Button onClick={analyze} disabled={!canAnalyze || analyzing}
            className="flex-1 bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400 disabled:opacity-40">
            {analyzing ? <><Loader2 size={15} className="animate-spin mr-2"/>Analisando…</> : "Analisar resultado"}
          </Button>
        </div>

        {/* Results */}
        {analyzed && cols.length > 0 && (
          <>
            {/* Score bar */}
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Resultado geral</p>
                <span className={`text-2xl font-extrabold ${score>=75?"text-emerald-400":score>=50?"text-amber-400":"text-red-400"}`}>{score}%</span>
              </div>
              <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full rounded-full ${score>=75?"bg-emerald-500":score>=50?"bg-amber-500":"bg-red-500"}`} style={{width:`${score}%`}} />
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label:"Exact",  count:exact,  cls:"text-emerald-400" },
                  { label:"Group",  count:group,  cls:"text-amber-400"   },
                  { label:"Nearby", count:nearby, cls:"text-orange-400"  },
                  { label:"Miss",   count:miss,   cls:"text-slate-500"   },
                ].map(({label,count,cls}) => (
                  <div key={label} className="rounded-lg bg-[#1a2035] px-2 py-2">
                    <p className={`text-lg font-extrabold ${cls}`}>{count}</p>
                    <p className="text-[10px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column cards */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Resultado por coluna</p>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(cols.length,6)},minmax(0,1fr))` }}>
                {cols.map((col: any) => {
                  const cfg = STATUS_CFG[col.status as Status]
                  const Icon = cfg.icon
                  return (
                    <div key={col.col} className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center ${cfg.cardCls}`}>
                      <span className="text-[10px] font-semibold text-slate-400">Col {col.col}</span>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-extrabold ${cfg.ballCls}`}>
                        {String(col.played).padStart(2,"0")}
                      </div>
                      <span className="text-[10px] text-slate-600">vs</span>
                      <span className={`text-lg font-extrabold ${cfg.drawnCls}`}>{String(col.drawn).padStart(2,"0")}</span>
                      <div className="flex items-center gap-1">
                        <Icon size={11} className={cfg.iconCls} />
                        <span className={`text-[10px] font-bold ${cfg.iconCls}`}>{cfg.label}</span>
                      </div>
                      {col.diff > 0 && <span className="text-[9px] text-slate-500">Δ {col.diff}</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Insight */}
            <div className={`rounded-xl border p-4 ${score>=75?"border-emerald-500/30 bg-emerald-500/5":"border-amber-500/30 bg-amber-500/5"}`}>
              <div className="mb-2 flex items-center gap-2">
                {score>=75 ? <TrendingUp size={18} className="text-emerald-400"/> : <Minus size={18} className="text-amber-400"/>}
                <p className={`font-bold ${score>=75?"text-emerald-400":"text-amber-400"}`}>
                  {exact>=3 ? `Excelente! ${exact} de ${cols.length} colunas com acerto exato.` : "Continue ajustando as colunas."}
                </p>
              </div>
              <p className="text-sm text-slate-300">{insight}</p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
