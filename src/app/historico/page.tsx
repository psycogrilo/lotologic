"use client"

import { useState } from "react"
import Link from "next/link"
import { Dices, Layers, BarChart2, History, User, LogOut, Search, ArrowUpDown, FileDown, X } from "lucide-react"
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

const COL_BALL = [
  "bg-blue-500/20 border-blue-500/40 text-blue-200",
  "bg-amber-500/20 border-amber-500/40 text-amber-200",
  "bg-emerald-500/20 border-emerald-500/40 text-emerald-200",
  "bg-red-500/20 border-red-500/40 text-red-200",
  "bg-purple-500/20 border-purple-500/40 text-purple-200",
  "bg-cyan-500/20 border-cyan-500/40 text-cyan-200",
]

const LOTTERY_CLS: Record<string,string> = {
  megasena:  "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  quina:     "border-blue-500/30 bg-blue-500/10 text-blue-300",
  lotofacil: "border-amber-500/30 bg-amber-500/10 text-amber-300",
}
const LOTTERY_LABEL: Record<string,string> = {
  megasena: "Mega-Sena", quina: "Quina", lotofacil: "Lotofácil",
}

const MOCK_GAMES = [
  { id:"g12", lottery:"megasena",  numbers:[7,15,28,39,44,57],           score:82, date:"03/mai/2026" },
  { id:"g11", lottery:"quina",     numbers:[4,19,33,47,61],              score:74, date:"02/mai/2026" },
  { id:"g10", lottery:"lotofacil", numbers:[1,3,5,7,9,11,14,16,18,20,21,22,23,24,25], score:79, date:"28/abr/2026" },
  { id:"g9",  lottery:"megasena",  numbers:[9,22,31,40,48,55],           score:58, date:"27/abr/2026" },
  { id:"g8",  lottery:"quina",     numbers:[2,11,25,38,52],              score:71, date:"26/abr/2026" },
  { id:"g7",  lottery:"megasena",  numbers:[3,17,26,35,49,60],           score:85, date:"25/abr/2026" },
]

const MOCK_SPREADS = [
  { id:"s3", lottery:"megasena",  groupSize:8,  totalCombinations:28,  totalCost:168,  score:78, date:"03/mai/2026" },
  { id:"s2", lottery:"lotofacil", groupSize:16, totalCombinations:16,  totalCost:56,   score:81, date:"28/abr/2026" },
  { id:"s1", lottery:"quina",     groupSize:7,  totalCombinations:21,  totalCost:63,   score:74, date:"25/abr/2026" },
]

function ScoreBadge({ score }: { score: number }) {
  const cls = score>=80 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : score>=65 ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
            :             "border-red-500/30 bg-red-500/10 text-red-400"
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${cls}`}>{score}%</span>
}

export default function HistoricoPage() {
  const [tab, setTab] = useState<"games"|"spreads">("games")
  const [search, setSearch] = useState("")
  const [lottery, setLottery] = useState("all")
  const [sortDir, setSortDir] = useState<"desc"|"asc">("desc")
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filteredGames = MOCK_GAMES
    .filter(g => lottery === "all" || g.lottery === lottery)
    .filter(g => !search || g.numbers.some(n => String(n).includes(search)))
    .sort((a,b) => sortDir==="desc" ? b.score-a.score : a.score-b.score)

  const filteredSpreads = MOCK_SPREADS
    .filter(s => lottery === "all" || s.lottery === lottery)
    .sort((a,b) => sortDir==="desc" ? b.score-a.score : a.score-b.score)

  const items = tab === "games" ? filteredGames : filteredSpreads
  const totalPages = Math.ceil(items.length / pageSize)
  const paged = items.slice((page-1)*pageSize, page*pageSize)

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A0E1A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden gap-1 sm:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                href === "/historico" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}><Icon size={13} />{label}</Link>
            ))}
          </nav>
          <button className="flex items-center gap-1 text-xs text-slate-500"><LogOut size={13} /> Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-white">Histórico</h1>
          <p className="mt-1 text-sm text-slate-400">Todos os seus jogos e desdobramentos salvos</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-slate-800 bg-[#111827] p-1">
          {[
            { id:"games",   label:"Jogos",          icon:Dices  },
            { id:"spreads", label:"Desdobramentos",  icon:Layers },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setTab(id as any); setPage(1) }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${
                tab===id ? "bg-amber-500 text-[#0A0E1A]" : "text-slate-400 hover:text-white"
              }`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar dezenas…"
              className="w-full rounded-lg border border-slate-700 bg-[#1a2035] pl-8 pr-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                <X size={12} />
              </button>
            )}
          </div>
          <select value={lottery} onChange={e => { setLottery(e.target.value); setPage(1) }}
            className="rounded-lg border border-slate-700 bg-[#1a2035] px-3 py-2 text-sm text-white outline-none cursor-pointer">
            <option value="all">Todas as loterias</option>
            <option value="megasena">Mega-Sena</option>
            <option value="quina">Quina</option>
            <option value="lotofacil">Lotofácil</option>
          </select>
          <button onClick={() => setSortDir(d => d==="desc"?"asc":"desc")}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-[#1a2035] px-3 py-2 text-sm text-slate-400 hover:text-white">
            <ArrowUpDown size={13} className={sortDir==="asc"?"rotate-180 text-amber-400":""} />
            {sortDir==="desc"?"Maior score":"Menor score"}
          </button>
        </div>

        {/* Count */}
        <p className="text-xs text-slate-500">{items.length} {tab==="games"?"jogo":"desdobramento"}{items.length!==1?"s":""} encontrado{items.length!==1?"s":""}</p>

        {/* Game list */}
        {tab === "games" && (
          <div className="space-y-2">
            {(paged as typeof MOCK_GAMES).map(game => (
              <div key={game.id} className="group flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-[#111827] px-4 py-3 hover:border-slate-700 transition-colors">
                <span className="text-xs text-slate-600 w-8">#{game.id.slice(-2)}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold shrink-0 ${LOTTERY_CLS[game.lottery]}`}>
                  {LOTTERY_LABEL[game.lottery]}
                </span>
                <div className="flex flex-wrap gap-1 flex-1">
                  {game.numbers.slice(0,6).map((n,i) => (
                    <span key={n} className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold ${COL_BALL[i%COL_BALL.length]}`}>
                      {String(n).padStart(2,"0")}
                    </span>
                  ))}
                  {game.numbers.length > 6 && <span className="self-center text-xs text-slate-500">+{game.numbers.length-6}</span>}
                </div>
                <ScoreBadge score={game.score} />
                <span className="hidden text-xs text-slate-500 sm:block shrink-0">{game.date}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/analise?gameId=${game.id}`}
                    className="rounded-lg border border-slate-700 p-1.5 text-slate-400 hover:border-amber-500/50 hover:text-amber-400 transition-colors" title="Analisar">
                    <BarChart2 size={13} />
                  </Link>
                </div>
              </div>
            ))}
            {paged.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-800 py-12 text-center">
                <p className="font-semibold text-slate-400">Nenhum jogo encontrado</p>
                <Link href="/gerar" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-[#0A0E1A] hover:bg-amber-400">Gerar jogo</Link>
              </div>
            )}
          </div>
        )}

        {/* Spread list */}
        {tab === "spreads" && (
          <div className="space-y-3">
            {(paged as typeof MOCK_SPREADS).map(sp => (
              <div key={sp.id} className="rounded-xl border border-slate-800 bg-[#111827] p-4 hover:border-slate-700 transition-colors">
                <div className="mb-3 flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-purple-400" />
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${LOTTERY_CLS[sp.lottery]}`}>
                      {LOTTERY_LABEL[sp.lottery]}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{sp.groupSize} dezenas</span>
                    <span className="text-xs text-slate-600">→</span>
                    <span className="text-xs text-slate-300 font-semibold">{sp.totalCombinations.toLocaleString("pt-BR")} combinações</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={sp.score} />
                    <span className="text-xs font-bold text-amber-400">
                      {sp.totalCost.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{sp.date}</span>
                  <button className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-500/50 hover:text-amber-400 transition-colors">
                    <FileDown size={12} /> Exportar PDF
                  </button>
                </div>
              </div>
            ))}
            {paged.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-800 py-12 text-center">
                <p className="font-semibold text-slate-400">Nenhum desdobramento encontrado</p>
                <Link href="/desdobramento" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-[#0A0E1A] hover:bg-amber-400">Criar desdobramento</Link>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
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
      </main>
    </div>
  )
}
