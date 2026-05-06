"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Dices, Layers, BarChart2, History, User, LogOut, Loader2, Zap, Hand, RotateCcw, Save, ChevronRight, Lock } from "lucide-react"

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

type LotteryId = "megasena" | "lotofacil"
type Mode = "auto" | "manual"
type Group = "strong" | "medium" | "weak"

const LOTTERIES: { id: LotteryId; label: string; draw: number; universe: number; color: string }[] = [
  { id: "megasena",  label: "Mega-Sena",  draw: 6,  universe: 60, color: "bg-emerald-500" },
  { id: "lotofacil", label: "Lotofácil",  draw: 15, universe: 25, color: "bg-blue-500"    },
]

interface ColumnAnalysis {
  col: number
  totalDraws: number
  strong: { number: number; count: number; pct: number }[]
  medium: { number: number; count: number; pct: number }[]
  weak:   { number: number; count: number; pct: number }[]
  dominantGroup: Group
  groupProbabilities: { strong: number; medium: number; weak: number }
}

const GROUP_CFG = {
  strong: { label: "Forte",  bg: "bg-emerald-500/20", border: "border-emerald-500/50", text: "text-emerald-300", badge: "bg-emerald-500", dot: "bg-emerald-400" },
  medium: { label: "Médio",  bg: "bg-amber-500/20",   border: "border-amber-500/50",   text: "text-amber-300",   badge: "bg-amber-500",   dot: "bg-amber-400"   },
  weak:   { label: "Fraco",  bg: "bg-slate-600/20",   border: "border-slate-600/50",   text: "text-slate-400",   badge: "bg-slate-500",   dot: "bg-slate-500"   },
}

export default function GerarPage() {
  const [lotteryId, setLotteryId] = useState<LotteryId>("megasena")
  const [mode, setMode] = useState<Mode>("auto")
  const [chosen, setChosen] = useState<(number | null)[]>([])
  const [anchors, setAnchors] = useState<number[]>([])
  const [analysis, setAnalysis] = useState<ColumnAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [currentCol, setCurrentCol] = useState(0)
  const [suggestedNumbers, setSuggestedNumbers] = useState<number[]>([])
  const [anchorInput, setAnchorInput] = useState("")
  const [syncing, setSyncing] = useState(false)
  const [dbStatus, setDbStatus] = useState<{ megasena: number; lotofacil: number } | null>(null)

  const lottery = LOTTERIES.find(l => l.id === lotteryId)!

  useEffect(() => {
    reset()
    checkDbStatus()
  }, [lotteryId])

  async function checkDbStatus() {
    try {
      const res = await fetch(`${API}/api/stats/status`)
      const data = await res.json()
      setDbStatus(data)
    } catch {}
  }

  async function syncData() {
    setSyncing(true)
    try {
      await fetch(`${API}/api/stats/sync/${lotteryId}`, { method: "POST" })
      await checkDbStatus()
    } catch {}
    setSyncing(false)
  }

  function reset() {
    setChosen([])
    setAnchors([])
    setAnalysis(null)
    setCurrentCol(0)
    setSuggestedNumbers([])
    setSaved(false)
    setAnchorInput("")
    if (mode === "manual") loadColumnAnalysis(0, [])
  }

  async function loadColumnAnalysis(col: number, previous: number[]) {
    setLoading(true)
    setAnalysis(null)
    try {
      const prev = previous.filter(Boolean).join(",")
      const url = `${API}/api/stats/${lotteryId}/column/${col + 1}${prev ? `?previous=${prev}` : ""}`
      const res = await fetch(url)
      const data = await res.json()
      setAnalysis(data)
    } catch {}
    setLoading(false)
  }

  async function generateAuto() {
    setGenerating(true)
    try {
      const body = {
        lottery: lotteryId,
        anchors: anchors.map((num, idx) => ({ col: idx + 1, number: num })).filter(a => a.number > 0),
      }
      const res = await fetch(`${API}/api/stats/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setChosen(data.numbers)
      setSuggestedNumbers(data.suggestedNumbers || [])
      setCurrentCol(lottery.draw)
    } catch {}
    setGenerating(false)
  }

  function pickNumber(num: number) {
    if (currentCol >= lottery.draw) return
    const next = [...chosen]
    next[currentCol] = num
    setChosen(next)
    const nextCol = currentCol + 1
    setCurrentCol(nextCol)
    if (nextCol < lottery.draw) {
      loadColumnAnalysis(nextCol, next.filter(Boolean) as number[])
    }
  }

  function unpickCol(col: number) {
    const next = [...chosen]
    next[col] = null
    for (let i = col + 1; i < next.length; i++) next[i] = null
    setChosen(next)
    setCurrentCol(col)
    loadColumnAnalysis(col, next.slice(0, col).filter(Boolean) as number[])
  }

  function addAnchor() {
    const num = Number(anchorInput)
    if (!num || num < 1 || num > lottery.universe) return
    if (anchors.includes(num)) return
    setAnchors([...anchors, num])
    setAnchorInput("")
  }

  async function saveGame() {
    if (chosen.filter(Boolean).length < lottery.draw) return
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      await fetch(`${API}/api/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          lottery: lotteryId,
          numbers: chosen,
          suggestedNumbers,
          anchors,
          betSize: lottery.draw,
          score: 80,
          mode,
        }),
      })
      setSaved(true)
    } catch {}
    setSaving(false)
  }

  const isDone = chosen.filter(Boolean).length === lottery.draw
  const dbCount = dbStatus?.[lotteryId] ?? 0

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A0E1A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden gap-1 sm:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                href === "/gerar" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}><Icon size={13} />{label}</Link>
            ))}
          </nav>
          <button className="flex items-center gap-1 text-xs text-slate-500"><LogOut size={13} /> Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-white">Gerar jogo</h1>
          <p className="mt-1 text-sm text-slate-400">Análise estatística coluna a coluna com base no histórico de 2025</p>
        </div>

        {/* Lottery tabs */}
        <div className="flex gap-1 rounded-xl border border-slate-800 bg-[#111827] p-1">
          {LOTTERIES.map(({ id, label }) => (
            <button key={id} onClick={() => setLotteryId(id)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${lotteryId === id ? "bg-amber-500 text-[#0A0E1A]" : "text-slate-400 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* DB status */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111827] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${dbCount > 0 ? "bg-emerald-400" : "bg-red-400"}`} />
            <span className="text-xs text-slate-400">
              {dbCount > 0 ? `${dbCount} sorteios na base histórica` : "Sem dados históricos"}
            </span>
          </div>
          <button onClick={syncData} disabled={syncing}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#1a2035] px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40">
            {syncing ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
            {syncing ? "Sincronizando..." : "Sincronizar"}
          </button>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2">
          <button onClick={() => { setMode("auto"); reset() }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
              mode === "auto" ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
            }`}>
            <Zap size={15} /> Automático
          </button>
          <button onClick={() => { setMode("manual"); reset(); loadColumnAnalysis(0, []) }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
              mode === "manual" ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
            }`}>
            <Hand size={15} /> Manual
          </button>
        </div>

        {/* Anchors */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
          <p className="mb-3 text-sm font-semibold text-white">Números âncora <span className="text-xs font-normal text-slate-500">(opcional — seus números favoritos)</span></p>
          <div className="flex gap-2">
            <input type="number" min={1} max={lottery.universe} value={anchorInput}
              onChange={e => setAnchorInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addAnchor()}
              placeholder={`1 a ${lottery.universe}`}
              className="w-28 rounded-lg border border-slate-700 bg-[#1a2035] px-3 py-1.5 text-sm text-white outline-none focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <button onClick={addAnchor}
              className="rounded-lg border border-slate-700 bg-[#1a2035] px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800">
              Adicionar
            </button>
          </div>
          {anchors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {anchors.map(n => (
                <div key={n} className="flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-500/40 px-2 py-1">
                  <Lock size={10} className="text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">{String(n).padStart(2, "0")}</span>
                  <button onClick={() => setAnchors(anchors.filter(a => a !== n))} className="ml-1 text-amber-500 hover:text-amber-300">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Numbers chosen so far */}
        {chosen.filter(Boolean).length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Jogo em construção</p>
            <div className="flex flex-wrap gap-2">
              {chosen.map((num, idx) => num ? (
                <button key={idx} onClick={() => !isDone && unpickCol(idx)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-500/60 bg-amber-500/20 text-sm font-extrabold text-amber-200 hover:border-red-500/60 hover:bg-red-500/10 transition-colors">
                  {String(num).padStart(2, "0")}
                </button>
              ) : (
                <div key={idx} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  idx === currentCol ? "border-amber-500 bg-amber-500/10 text-amber-400 animate-pulse" : "border-slate-700 text-slate-600"
                }`}>
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUTO MODE */}
        {mode === "auto" && !isDone && (
          <button onClick={generateAuto} disabled={generating || dbCount === 0}
            className="w-full rounded-xl bg-amber-500 py-4 text-base font-extrabold text-[#0A0E1A] hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
            {generating ? <><Loader2 size={18} className="animate-spin" /> Gerando jogo...</> : <><Zap size={18} /> Gerar jogo estatístico</>}
          </button>
        )}

        {/* MANUAL MODE — column analysis */}
        {mode === "manual" && !isDone && (
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Coluna {currentCol + 1} de {lottery.draw}</p>
                {analysis && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Baseado em <strong className="text-slate-300">{analysis.totalDraws}</strong> sorteios históricos
                    {chosen.filter(Boolean).length > 0 && <> · contexto das colunas anteriores aplicado</>}
                  </p>
                )}
              </div>
              {analysis && (
                <div className={`rounded-lg px-3 py-1.5 text-xs font-bold ${GROUP_CFG[analysis.dominantGroup].bg} ${GROUP_CFG[analysis.dominantGroup].text} border ${GROUP_CFG[analysis.dominantGroup].border}`}>
                  {analysis.groupProbabilities[analysis.dominantGroup]}% chance de {GROUP_CFG[analysis.dominantGroup].label}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
                <Loader2 size={14} className="animate-spin text-amber-400" /> Analisando histórico...
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                {/* Group probabilities bar */}
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-500">Probabilidade por grupo nesta coluna</p>
                  <div className="flex h-2 w-full overflow-hidden rounded-full gap-0.5">
                    <div className="bg-emerald-500 rounded-l-full transition-all" style={{ width: `${analysis.groupProbabilities.strong}%` }} />
                    <div className="bg-amber-500 transition-all" style={{ width: `${analysis.groupProbabilities.medium}%` }} />
                    <div className="bg-slate-600 rounded-r-full transition-all" style={{ width: `${analysis.groupProbabilities.weak}%` }} />
                  </div>
                  <div className="flex gap-4 text-[10px] text-slate-500">
                    <span><span className="text-emerald-400 font-bold">{analysis.groupProbabilities.strong}%</span> Forte</span>
                    <span><span className="text-amber-400 font-bold">{analysis.groupProbabilities.medium}%</span> Médio</span>
                    <span><span className="text-slate-400 font-bold">{analysis.groupProbabilities.weak}%</span> Fraco</span>
                  </div>
                </div>

                {/* Number groups */}
                {(["strong", "medium", "weak"] as Group[]).map(group => {
                  const cfg = GROUP_CFG[group]
                  const nums = analysis[group]
                  if (nums.length === 0) return null
                  return (
                    <div key={group}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                        <p className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}s</p>
                        <span className="text-[10px] text-slate-600">({nums.length} números)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {nums.slice(0, 20).map(({ number, pct }) => (
                          <button key={number}
                            onClick={() => pickNumber(number)}
                            disabled={chosen.includes(number)}
                            className={`relative flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                            {String(number).padStart(2, "0")}
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-slate-500">{pct}%</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : dbCount === 0 ? (
              <p className="text-sm text-red-400 py-2">Sincronize os dados históricos primeiro!</p>
            ) : null}
          </div>
        )}

        {/* DONE — result */}
        {isDone && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4">
            <p className="text-sm font-bold text-emerald-400">Jogo gerado com sucesso!</p>

            <div className="flex flex-wrap gap-2">
              {chosen.map((num, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-500">Col {idx + 1}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-500/60 bg-amber-500/20 text-sm font-extrabold text-amber-200">
                    {String(num).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested vs chosen comparison */}
            {suggestedNumbers.length > 0 && (
              <div className="rounded-lg border border-slate-700 bg-[#111827] p-3">
                <p className="text-xs font-semibold text-slate-400 mb-2">Sistema sugeriu vs você escolheu</p>
                <div className="grid gap-1">
                  {chosen.map((num, idx) => {
                    const sug = suggestedNumbers[idx]
                    const match = num === sug
                    return (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 w-12">Col {idx + 1}</span>
                        <span className={`font-bold ${match ? "text-emerald-400" : "text-amber-300"}`}>
                          {String(num).padStart(2, "0")}
                        </span>
                        {!match && (
                          <>
                            <ChevronRight size={10} className="text-slate-600" />
                            <span className="text-slate-500">sugerido: <strong className="text-slate-300">{String(sug).padStart(2, "0")}</strong></span>
                          </>
                        )}
                        {match && <span className="text-emerald-600 text-[10px]">✓ coincide com sugestão</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={reset}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
                <RotateCcw size={14} /> Novo jogo
              </button>
              <button onClick={saveGame} disabled={saving || saved}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-[#0A0E1A] hover:bg-amber-400 disabled:opacity-50 transition-colors">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saved ? "Salvo!" : saving ? "Salvando..." : "Salvar no histórico"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
