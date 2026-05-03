"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Dices, Layers, BarChart2, History, User, LogOut, Info, AlertTriangle, RotateCcw, Save } from "lucide-react"
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

const LOTTERIES = [
  { id: "megasena",  label: "Mega-Sena",  emoji: "🟢", range: "1–60", draw: 6,  min: 6,  max: 20, price: 6    },
  { id: "quina",     label: "Quina",      emoji: "🔵", range: "1–80", draw: 5,  min: 5,  max: 15, price: 3    },
  { id: "lotofacil", label: "Lotofácil",  emoji: "🟡", range: "1–25", draw: 15, min: 15, max: 20, price: 3.50 },
]

const COMBS: Record<number, number> = {
  5:1,6:1,7:7,8:28,9:84,10:210,11:462,12:924,13:1716,14:3003,15:5005,16:8008,17:12376,18:18564,19:27132,20:38760
}

const COL_COLORS = [
  "bg-blue-500/20 border-blue-500/50 text-blue-200",
  "bg-amber-500/20 border-amber-500/50 text-amber-200",
  "bg-emerald-500/20 border-emerald-500/50 text-emerald-200",
  "bg-red-500/20 border-red-500/50 text-red-200",
  "bg-purple-500/20 border-purple-500/50 text-purple-200",
  "bg-cyan-500/20 border-cyan-500/50 text-cyan-200",
]

function StepIndicator({ current }: { current: number }) {
  const steps = ["Loteria", "Dezenas", "Âncoras", "Resultado"]
  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((label, i) => {
        const s = i + 1
        const done = s < current
        const active = s === current
        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                done ? "border-emerald-500 bg-emerald-500 text-white" :
                active ? "border-amber-500 bg-amber-500 text-[#0A0E1A]" :
                "border-slate-700 bg-transparent text-slate-500"
              }`}>
                {done ? <Check size={13} /> : s}
              </div>
              <span className={`mt-1 text-[10px] font-medium ${active ? "text-amber-400" : done ? "text-emerald-400" : "text-slate-500"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mb-4 h-0.5 flex-1 transition-colors ${done ? "bg-emerald-500/40" : "bg-slate-800"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function GerarPage() {
  const [step, setStep] = useState(1)
  const [lottery, setLottery] = useState<typeof LOTTERIES[0] | null>(null)
  const [betSize, setBetSize] = useState(6)
  const [anchors, setAnchors] = useState<number[]>([])
  const [saved, setSaved] = useState(false)

  // Mock generated game
  const mockGame = { numbers: [7, 18, 29, 37, 45, 58], score: 82, tiers: { strong: 3, medium: 2, weak: 1 }, parityPct: 50 }

  function toggleAnchor(n: number) {
    setAnchors(prev => prev.includes(n) ? prev.filter(a => a !== n) : anchors.length < betSize ? [...prev, n] : prev)
  }

  const combs = COMBS[betSize] ?? 1
  const cost = lottery ? (combs * lottery.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0"

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
          <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"><LogOut size={13} /> Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-white">Gerar jogo</h1>
          <p className="mt-1 text-sm text-slate-400">Análise estatística por colunas com score 0–100%</p>
        </div>

        <StepIndicator current={step} />

        {/* Step 1 — Loteria */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {LOTTERIES.map((lot) => (
                <button key={lot.id} onClick={() => setLottery(lot)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 text-center transition-all ${
                    lottery?.id === lot.id ? "border-amber-500/60 bg-amber-500/5 ring-2 ring-amber-500/40" : "border-slate-800 bg-[#111827] hover:border-slate-700"
                  }`}>
                  <span className="text-3xl">{lot.emoji}</span>
                  <span className={`font-bold ${lottery?.id === lot.id ? "text-amber-400" : "text-white"}`}>{lot.label}</span>
                  <span className="text-xs text-slate-400">{lot.range} · {lot.draw} dezenas</span>
                  {lottery?.id === lot.id && <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-[#0A0E1A]">Selecionada</span>}
                </button>
              ))}
            </div>
            <Button onClick={() => { if(lottery){ setBetSize(lottery.min); setStep(2) } }} disabled={!lottery}
              className="w-full bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400 disabled:opacity-40">
              Continuar →
            </Button>
          </div>
        )}

        {/* Step 2 — Dezenas */}
        {step === 2 && lottery && (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Quantidade de dezenas</p>
                <span className="rounded-full bg-amber-500 px-3 py-0.5 text-sm font-extrabold text-[#0A0E1A]">{betSize}</span>
              </div>
              <input type="range" min={lottery.min} max={lottery.max} value={betSize} step={1}
                onChange={e => setBetSize(Number(e.target.value))}
                className="mb-4 w-full accent-amber-500" />
              <div className="flex justify-between text-xs text-slate-500 mb-4">
                <span>Mín. {lottery.min}</span><span>Máx. {lottery.max}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Dezenas", value: String(betSize) },
                  { label: "Combinações", value: combs.toLocaleString("pt-BR") },
                  { label: "Custo total", value: cost, gold: true },
                ].map(({ label, value, gold }) => (
                  <div key={label} className="rounded-lg bg-[#1a2035] p-2 text-center">
                    <p className={`text-base font-extrabold ${gold ? "text-amber-400" : "text-white"}`}>{value}</p>
                    <p className="text-[10px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
              {betSize > lottery.min && (
                <div className="mt-3 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2 text-xs text-blue-300">
                  {combs.toLocaleString("pt-BR")}× mais chances que uma aposta mínima
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="border-slate-700 text-slate-300 hover:bg-slate-800">← Voltar</Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">Continuar →</Button>
            </div>
          </div>
        )}

        {/* Step 3 — Âncoras */}
        {step === 3 && lottery && (
          <div className="space-y-5">
            <div className="flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-300">
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>Âncoras são opcionais. Clique para fixar um número. O sistema escolhe os demais pela análise de colunas.</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{lottery.label} — 1 a {lottery.range.split("–")[1]}</p>
                {anchors.length > 0 && (
                  <button onClick={() => setAnchors([])} className="text-xs text-red-400 hover:text-red-300">Limpar</button>
                )}
              </div>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${lottery.range.split("–")[1] === "25" ? 5 : 10}, minmax(0,1fr))` }}>
                {Array.from({ length: Number(lottery.range.split("–")[1]) }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => toggleAnchor(n)}
                    disabled={!anchors.includes(n) && anchors.length >= betSize}
                    className={`aspect-square rounded-lg border text-xs font-bold transition-all ${
                      anchors.includes(n) ? "border-amber-500 bg-amber-500 text-[#0A0E1A]" :
                      "border-slate-700 bg-[#1a2035] text-slate-400 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30"
                    }`}>
                    {String(n).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
            {anchors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anchors.map(n => (
                  <span key={n} onClick={() => toggleAnchor(n)}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
                    {String(n).padStart(2,"0")} ×
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="border-slate-700 text-slate-300 hover:bg-slate-800">← Voltar</Button>
              <Button onClick={() => setStep(4)} className="flex-1 bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">Gerar jogo →</Button>
            </div>
          </div>
        )}

        {/* Step 4 — Resultado */}
        {step === 4 && lottery && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{lottery.label} · {betSize} dezenas</p>
                  <p className="mt-0.5 text-sm font-semibold text-white">Jogo gerado</p>
                </div>
                {/* Score ring */}
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                    <circle cx="32" cy="32" r="24" strokeWidth="5" stroke="#1E2D45" fill="none" />
                    <circle cx="32" cy="32" r="24" strokeWidth="5" fill="none" stroke="#10B981"
                      strokeDasharray={`${(mockGame.score/100)*150.8} 150.8`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-base font-extrabold text-emerald-400">{mockGame.score}%</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {mockGame.numbers.map((n, i) => (
                  <div key={n} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-extrabold ${COL_COLORS[i % COL_COLORS.length]}`}>
                    {String(n).padStart(2,"0")}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-slate-800 bg-[#111827] p-3 text-center">
                  <p className="text-sm font-extrabold text-white">3F·2M·1Fr</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Tiers</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#111827] p-3 text-center">
                  <p className="text-sm font-extrabold text-white">50% / 50%</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Par/Ímpar</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#111827] p-3 text-center">
                  <p className="text-sm font-extrabold text-amber-400">R$ {(betSize * lottery.price).toLocaleString("pt-BR",{minimumFractionDigits:2})}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Custo</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => { setStep(1); setLottery(null); setAnchors([]); setSaved(false) }}
                className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <RotateCcw size={14} className="mr-1" /> Gerar outro
              </Button>
              <Button onClick={() => setSaved(true)} disabled={saved}
                className={saved ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400"}>
                <Save size={14} className="mr-1" /> {saved ? "Salvo!" : "Salvar jogo"}
              </Button>
            </div>
            <Button variant="outline" asChild className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
              <Link href="/desdobramento"><Layers size={14} className="mr-1" /> Desdobrar este grupo</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
