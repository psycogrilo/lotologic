"use client"

import Link from "next/link"
import { Dices, Layers, BarChart2, History, User, LogOut, Calendar, TrendingUp, Clock } from "lucide-react"
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

const QUICK = [
  { href: "/gerar",         icon: Dices,    title: "Gerar novo jogo",      desc: "Mega-Sena, Quina ou Lotofácil com score de colunas",            color: "text-amber-400",  bg: "bg-amber-500/10"  },
  { href: "/desdobramento", icon: Layers,   title: "Criar desdobramento",  desc: "Escolha o grupo e gere todas as combinações automaticamente",    color: "text-blue-400",   bg: "bg-blue-500/10"   },
  { href: "/analise",       icon: BarChart2,title: "Analisar resultado",   desc: "Compare seu jogo com o sorteio coluna a coluna",                 color: "text-purple-400", bg: "bg-purple-500/10" },
  { href: "/historico",     icon: History,  title: "Ver histórico",        desc: "Todos os seus jogos e desdobramentos salvos",                    color: "text-emerald-400",bg: "bg-emerald-500/10"},
]

// Plan status bar colors
function PlanStatusBar() {
  const days = 142
  const color = days > 90 ? "bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-300"
              : days > 30 ? "bg-blue-500/10 border-b border-blue-500/30 text-blue-300"
              : days > 7  ? "bg-amber-500/10 border-b border-amber-500/30 text-amber-300"
              :              "bg-red-500/10 border-b border-red-500/30 text-red-300"
  return (
    <div className={`px-4 py-2 ${color}`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between text-xs font-medium">
        <span>✅ Plano ativo — vence em <strong>{days} dias</strong></span>
        <span className="opacity-60">Expira em 29/out/2025</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A0E1A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden gap-1 sm:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  href === "/dashboard"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}>
                <Icon size={13} />{label}
              </Link>
            ))}
          </nav>
          <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300">
            <LogOut size={13} /> Sair
          </button>
        </div>
      </header>

      <PlanStatusBar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Greeting */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Olá, João 👋</h1>
            <p className="mt-1 text-sm text-slate-400">Pronto para o próximo sorteio?</p>
          </div>
          {/* Countdown */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] px-4 py-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
              <Clock size={11} /> Próximo sorteio em
            </div>
            <div className="flex gap-2">
              {[{ v: "14", l: "horas" }, { v: "32", l: "min" }, { v: "07", l: "seg" }].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <div className="min-w-[36px] rounded-lg bg-[#1a2035] px-2 py-1 text-center text-lg font-extrabold text-amber-400 tabular-nums">{v}</div>
                  <div className="mt-0.5 text-[9px] text-slate-500">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-slate-500">Plano até 29/out/2025</div>
          </div>
        </div>

        {/* Next draw banner */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <Calendar size={18} className="shrink-0 text-amber-400" />
          <div className="flex-1">
            <p className="text-xs text-slate-400">Próximo sorteio</p>
            <p className="font-semibold text-white">Mega-Sena — <span className="text-amber-400">Sábado, 04/mai às 20h</span></p>
          </div>
          <Button size="sm" asChild className="bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">
            <Link href="/gerar">Gerar jogo</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Dices,     label: "Jogos gerados",    value: "12",    color: "text-blue-400"    },
            { icon: Layers,    label: "Desdobramentos",   value: "3",     color: "text-purple-400"  },
            { icon: TrendingUp,label: "Score médio",      value: "78%",   color: "text-emerald-400" },
            { icon: BarChart2, label: "Loteria favorita", value: "Mega",  color: "text-amber-400"   },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-[#111827] p-4">
              <Icon size={16} className={`mb-2 ${color}`} />
              <p className="text-xl font-extrabold text-white">{value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          {QUICK.map(({ href, icon: Icon, title, desc, color, bg }) => (
            <Link key={href} href={href}
              className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-[#111827] p-4 transition-colors hover:border-slate-700">
              <div className={`mt-0.5 rounded-lg p-2 ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-800 bg-[#111827] sm:hidden">
        {NAV.slice(0, 5).map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] ${
              href === "/dashboard" ? "text-amber-400" : "text-slate-500"
            }`}>
            <Icon size={18} />{label.split(" ")[0]}
          </Link>
        ))}
      </nav>
    </div>
  )
}
