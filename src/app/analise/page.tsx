"use client"

import { useState } from "react"
import Link from "next/link"
import { Dices, Layers, BarChart2, History, User, LogOut, CheckCircle2, Circle, AlertCircle, XCircle, TrendingUp, TrendingDown, Minus } from "lucide-react"
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

type Status = "exact" | "group" | "nearby" | "miss"

const STATUS_CFG = {
  exact:  { label: "Exact",  cardCls: "border-emerald-500/30 bg-emerald-500/5",  ballCls: "bg-emerald-500/20 border-emerald-500/60 text-emerald-200", drawnCls: "text-emerald-400", icon: CheckCircle2, iconCls: "text-emerald-400" },
  group:  { label: "Group",  cardCls: "border-amber-500/30 bg-amber-500/5",      ballCls: "bg-amber-500/20 border-amber-500/60 text-amber-200",       drawnCls: "text-amber-400",   icon: Circle,       iconCls: "text-amber-400"   },
  nearby: { label: "Nearby", cardCls: "border-orange-500/30 bg-orange-500/5",    ballCls: "bg-orange-500/20 border-orange-500/60 text-orange-200",     drawnCls: "text-orange-400",  icon: AlertCircle,  iconCls: "text-orange-400"  },
  miss:   { label: "Miss",   cardCls: "border-slate-600/30 bg-slate-800/30",     ballCls: "bg-slate-700/40 border-slate-600 text-slate-400",           drawnCls: "text-slate-400",   icon: XCircle,      iconCls: "text-slate-500"   },
}

const MOCK_RESULT = [
  { col: 1, played: 7,  drawn: 8,  status: "miss"   as Status, diff: 1  },
  { col: 2, played: 18, drawn: 17, status: "nearby" as Status, diff: 1  },
  { col: 3, played: 29, drawn: 29, status: "exact"  as Status, diff: 0  },
  { col: 4, played: 37, drawn: 37, status: "exact"  as Status, diff: 0  },
  { col: 5, played: 45, drawn: 46, status: "group"  as Status, diff: 1  },
  { col: 6, played: 58, drawn: 58, status: "exact"  as Status, diff: 0  },
]

export default function AnalisePage() {
  const [analyzed, setAnalyzed] = useState(false)
  const [drawn, setDrawn] = useState(["08","17","29","37","46","58"])
  const [played, setPlayed] = useState(["07","18","29","37","45","58"])

  const exact  = MOCK_RESULT.filter(c => c.status === "exact").length
  const group  = MOCK_RESULT.filter(c => c.status === "group").length
  const nearby = MOCK_RESULT.filter(c => c.status === "nearby").length
  const miss   = MOCK_RESULT.filter(c => c.status === "miss").length
  const score  = Math.round((exact*100 + group*60 + nearby*30) / MOCK_RESULT.length)

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

        {/* Config */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
            <p className="mb-3 text-sm font-semibold text-white">Resultado oficial</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {drawn.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-semibold text-slate-500">Col {i+1}</span>
                  <input type="number" min={1} max={60} value={v}
                    onChange={e => { const a=[...drawn]; a[i]=e.target.value; setDrawn(a) }}
                    className="w-12 rounded-lg border border-slate-700 bg-[#1a2035] py-1.5 text-center text-sm font-bold text-white outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              ))}
            </div>
            <p className="mb-3 text-sm font-semibold text-white">Seu jogo</p>
            <div className="flex flex-wrap gap-2">
              {played.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-semibold text-slate-500">Col {i+1}</span>
                  <input type="number" min={1} max={60} value={v}
                    onChange={e => { const a=[...played]; a[i]=e.target.value; setPlayed(a) }}
                    className="w-12 rounded-lg border border-slate-700 bg-[#1a2035] py-1.5 text-center text-sm font-bold text-white outline-none focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            {analyzed && (
              <Button variant="outline" onClick={() => setAnalyzed(false)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Nova análise
              </Button>
            )}
            <Button onClick={() => setAnalyzed(true)}
              className="flex-1 bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">
              Analisar resultado
            </Button>
          </div>
        </div>

        {/* Results */}
        {analyzed && (
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
              <div className="grid grid-cols-4 gap-2 text-center mb-3">
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
              <div className="flex h-1.5 w-full overflow-hidden rounded-full">
                {exact>0  && <div className="bg-emerald-500" style={{flex:exact}} />}
                {group>0  && <div className="bg-amber-500"   style={{flex:group}} />}
                {nearby>0 && <div className="bg-orange-500"  style={{flex:nearby}} />}
                {miss>0   && <div className="bg-slate-700"   style={{flex:miss}} />}
              </div>
            </div>

            {/* Column cards */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Resultado por coluna</p>
              <div className="grid grid-cols-6 gap-2">
                {MOCK_RESULT.map(col => {
                  const cfg = STATUS_CFG[col.status]
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
                  {exact>=3 ? `Excelente! ${exact} de ${MOCK_RESULT.length} colunas com acerto exato.` : "Alinhamento de tiers sólido — continue ajustando."}
                </p>
              </div>
              <p className="text-sm text-slate-300">
                Seu jogo apresentou {exact} acerto{exact!==1?"s":""} exato{exact!==1?"s":""}, {group} no mesmo tier e {nearby} próximo{nearby!==1?"s":""}.
                {exact>=3 ? " O alinhamento estatístico por colunas foi validado." : " Ajuste as colunas com miss para melhorar na próxima aposta."}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                {[
                  {label:`${exact} exact`,  cls:"text-emerald-400"},
                  {label:`${group} group`,  cls:"text-amber-400"},
                  {label:`${nearby} nearby`,cls:"text-orange-400"},
                  {label:`${miss} miss`,    cls:"text-slate-500"},
                ].map(({label,cls})=>(
                  <span key={label} className={`font-semibold ${cls}`}>{label}</span>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Legenda</p>
              <div className="space-y-2">
                {(["exact","group","nearby","miss"] as Status[]).map(s => {
                  const cfg = STATUS_CFG[s]
                  const Icon = cfg.icon
                  const descs: Record<Status,string> = {
                    exact:  "Número idêntico ao sorteado na mesma coluna",
                    group:  "Mesmo tier (forte/médio/fraco), número diferente",
                    nearby: "Diferença ≤ 3 entre o jogado e o sorteado",
                    miss:   "Tiers diferentes — sem alinhamento nesta coluna",
                  }
                  return (
                    <div key={s} className="flex items-start gap-2">
                      <Icon size={14} className={`mt-0.5 shrink-0 ${cfg.iconCls}`} />
                      <div>
                        <span className={`text-xs font-bold ${cfg.iconCls}`}>{cfg.label}</span>
                        <span className="ml-2 text-xs text-slate-400">{descs[s]}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
