"use client"

import { useState } from "react"
import Link from "next/link"
import { Dices, Layers, BarChart2, History, User, LogOut, Info, FileDown, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

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

type LotteryId = "megasena" | "quina" | "lotofacil"

const LOTTERIES = {
  megasena:  { label: "Mega-Sena",  draw: 6,  min: 7,  max: 15, price: 6    },
  quina:     { label: "Quina",      draw: 5,  min: 6,  max: 15, price: 3    },
  lotofacil: { label: "Lotofácil",  draw: 15, min: 16, max: 20, price: 3.50 },
}

function comb(n: number, k: number): number {
  if (k > n) return 0
  let r = 1
  for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1)
  return Math.round(r)
}

const COL_STYLES = [
  { ball: "bg-blue-500/20 border-blue-500/50 text-blue-200",     header: "bg-blue-500/10 text-blue-400"     },
  { ball: "bg-amber-500/20 border-amber-500/50 text-amber-200",  header: "bg-amber-500/10 text-amber-400"   },
  { ball: "bg-emerald-500/20 border-emerald-500/50 text-emerald-200", header: "bg-emerald-500/10 text-emerald-400" },
  { ball: "bg-red-500/20 border-red-500/50 text-red-200",        header: "bg-red-500/10 text-red-400"       },
  { ball: "bg-purple-500/20 border-purple-500/50 text-purple-200", header: "bg-purple-500/10 text-purple-400" },
  { ball: "bg-cyan-500/20 border-cyan-500/50 text-cyan-200",     header: "bg-cyan-500/10 text-cyan-400"     },
]

// Mock combinations
function genCombos(nums: number[], k: number) {
  const result: number[][] = []
  function bt(start: number, cur: number[]) {
    if (cur.length === k) { result.push([...cur]); return }
    for (let i = start; i < nums.length; i++) { cur.push(nums[i]); bt(i+1, cur); cur.pop() }
  }
  bt(0, [])
  return result
}

export default function DesdobramentoPage() {
  const [lotteryId, setLotteryId] = useState<LotteryId>("megasena")
  const [groupSize, setGroupSize] = useState(8)
  const [generated, setGenerated] = useState(false)
  const [saved, setSaved] = useState(false)
  const [page, setPage] = useState(1)
  const [scoreFilter, setScoreFilter] = useState(0)

  const cfg = LOTTERIES[lotteryId]
  const totalCombs = comb(groupSize, cfg.draw)
  const totalCost = (totalCombs * cfg.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  // Mock group numbers
  const groupNums = [7, 12, 18, 29, 33, 37, 45, 58].slice(0, groupSize)
  const allCombos = generated ? genCombos(groupNums, Math.min(cfg.draw, groupNums.length)) : []
  const scores = allCombos.map((_, i) => 86 - i * 2)
  const filtered = allCombos.filter((_, i) => scores[i] >= scoreFilter)
  const pageSize = 8
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page-1)*pageSize, page*pageSize)

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A0E1A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden gap-1 sm:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                href === "/desdobramento" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}><Icon size={13} />{label}</Link>
            ))}
          </nav>
          <button className="flex items-center gap-1 text-xs text-slate-500"><LogOut size={13} /> Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-white">Desdobramento inteligente</h1>
          <p className="mt-1 text-sm text-slate-400">Escolha um grupo de dezenas e gere todas as combinações</p>
        </div>

        {/* Config */}
        <div className="space-y-4">
          {/* Lottery tabs */}
          <div className="flex gap-1 rounded-xl border border-slate-800 bg-[#111827] p-1">
            {(Object.entries(LOTTERIES) as [LotteryId, typeof LOTTERIES.megasena][]).map(([id, l]) => (
              <button key={id} onClick={() => { setLotteryId(id); setGroupSize(LOTTERIES[id].min); setGenerated(false); setSaved(false) }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  lotteryId === id ? "bg-amber-500 text-[#0A0E1A]" : "text-slate-400 hover:text-white"
                }`}>{l.label}</button>
            ))}
          </div>

          {/* Slider */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Dezenas no grupo</p>
              <span className="rounded-full bg-amber-500 px-3 py-0.5 text-sm font-extrabold text-[#0A0E1A]">{groupSize}</span>
            </div>
            <p className="mb-3 text-xs text-slate-500">{cfg.label} · sorteio de {cfg.draw} dezenas</p>
            <input type="range" min={cfg.min} max={cfg.max} value={groupSize} step={1}
              onChange={e => { setGroupSize(Number(e.target.value)); setGenerated(false); setSaved(false) }}
              className="mb-3 w-full accent-amber-500" />
            <div className="flex justify-between text-xs text-slate-500 mb-4">
              <span>Mín. {cfg.min}</span><span>Máx. {cfg.max}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Dezenas",      value: String(groupSize) },
                { label: "Combinações",  value: totalCombs.toLocaleString("pt-BR") },
                { label: "Custo total",  value: totalCost, gold: true },
              ].map(({ label, value, gold }) => (
                <div key={label} className="rounded-lg bg-[#1a2035] p-2 text-center">
                  <p className={`text-sm font-extrabold ${gold ? "text-amber-400" : "text-white"}`}>{value}</p>
                  <p className="text-[10px] text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-300">
            <Info size={13} className="mt-0.5 shrink-0" />
            <span>O sistema distribui as {groupSize} dezenas pelas {cfg.draw} colunas e gera todas as <strong className="text-white">C({groupSize},{cfg.draw}) = {totalCombs.toLocaleString("pt-BR")} combinações</strong>.</span>
          </div>

          <Button onClick={() => { setGenerated(true); setPage(1) }}
            className="w-full bg-amber-500 text-[#0A0E1A] font-bold text-base hover:bg-amber-400">
            Gerar desdobramento — {totalCombs.toLocaleString("pt-BR")} combinações
          </Button>
        </div>

        {/* Results */}
        {generated && (
          <>
            {/* Group view */}
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-white">Grupo de {groupSize} dezenas — {cfg.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{allCombos.length} combinações · <span className="text-amber-400 font-semibold">{totalCost}</span></p>
                </div>
                <div className="flex gap-3 text-center">
                  <div><p className="text-lg font-extrabold text-amber-400">78%</p><p className="text-[10px] text-slate-500">Score médio</p></div>
                  <div><p className="text-lg font-extrabold text-emerald-400">{allCombos.filter((_,i)=>scores[i]>=80).length}</p><p className="text-[10px] text-slate-500">Score ≥ 80%</p></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {groupNums.map((n, i) => (
                  <div key={n} className="flex flex-col items-center gap-0.5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-extrabold ${COL_STYLES[i % COL_STYLES.length].ball}`}>
                      {String(n).padStart(2,"0")}
                    </div>
                    <span className="text-[9px] font-semibold text-slate-500">C{i+1}</span>
                  </div>
                ))}
              </div>
              {/* Column breakdown */}
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(cfg.draw,6)},minmax(0,1fr))` }}>
                {groupNums.slice(0, Math.min(cfg.draw,6)).map((n, i) => (
                  <div key={n} className={`rounded-lg p-2 text-center ${COL_STYLES[i%COL_STYLES.length].header}`}>
                    <p className="text-[10px] font-bold opacity-80 mb-1">Col {i+1}</p>
                    <span className="text-sm font-extrabold">{String(n).padStart(2,"0")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Combination list */}
            <div className="rounded-xl border border-slate-800 bg-[#111827]">
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 p-4">
                <span className="text-sm font-semibold text-white">
                  Combinações <span className="text-amber-400">{filtered.length}</span>
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-slate-400">Score mín.</span>
                  <input type="range" min={0} max={80} step={5} value={scoreFilter}
                    onChange={e => { setScoreFilter(Number(e.target.value)); setPage(1) }}
                    className="w-24 accent-amber-500" />
                  <span className="text-xs font-bold text-amber-400 min-w-[36px]">{scoreFilter}%</span>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 w-10">#</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">Dezenas</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 w-24">Score</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 w-20">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((combo, i) => {
                    const idx = (page-1)*pageSize + i
                    const score = scores[idx] ?? 60
                    const scoreColor = score >= 80 ? "text-emerald-400" : score >= 65 ? "text-amber-400" : "text-red-400"
                    const barColor  = score >= 80 ? "bg-emerald-500"   : score >= 65 ? "bg-amber-500"   : "bg-red-500"
                    return (
                      <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                        <td className="px-4 py-2.5 text-xs text-slate-500">{idx+1}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {combo.map((n, ci) => (
                              <span key={n} className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold ${COL_STYLES[ci%COL_STYLES.length].ball}`}>
                                {String(n).padStart(2,"0")}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
                            </div>
                            <span className={`text-xs font-bold ${scoreColor}`}>{score}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          {score >= 80
                            ? <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">OK</span>
                            : <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">Aviso</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
                  <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-30">
                    ← Anterior
                  </button>
                  <span className="text-xs text-slate-500">Página {page} de {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-30">
                    Próxima →
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
              <div className="mb-4 grid grid-cols-4 gap-3 text-sm">
                {[
                  { label: "Loteria",       value: cfg.label },
                  { label: "Grupo",         value: `${groupSize} dezenas` },
                  { label: "Combinações",   value: allCombos.length.toLocaleString("pt-BR") },
                  { label: "Custo total",   value: totalCost },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => setSaved(true)} disabled={saved}
                  className={saved ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400"}>
                  {saved ? <><Check size={14} className="mr-1"/>Salvo!</> : "Salvar"}
                </Button>
                <Button variant="outline" disabled={!saved}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40">
                  <FileDown size={14} className="mr-1" /> Exportar PDF
                </Button>
                <Button variant="outline" onClick={() => { setGenerated(false); setSaved(false) }}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <RotateCcw size={14} className="mr-1" /> Novo
                </Button>
              </div>
              {saved && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400">
                  <Check size={13} /> Desdobramento salvo. PDF disponível no histórico por 6 meses.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
