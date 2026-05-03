"use client"

import { useState } from "react"
import Link from "next/link"
import { Dices, Layers, BarChart2, History, User, LogOut, Lock, Bell, AlertTriangle, CheckCircle2, Eye, EyeOff, Calendar, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

const NOTIFS = [
  { id:"draw_reminder", label:"Lembretes de sorteio",  desc:"E-mail antes de cada sorteio das loterias favoritas", def:true  },
  { id:"plan_expiry",   label:"Vencimento do plano",   desc:"Alertas em D-15, D-7 e D-1 antes do vencimento",      def:true  },
  { id:"draw_result",   label:"Resultado do sorteio",  desc:"E-mail com o resultado logo após cada sorteio",        def:false },
  { id:"newsletter",    label:"Dicas e novidades",     desc:"Conteúdo sobre estratégias e atualizações",            def:false },
]

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full border-2 transition-colors ${value ? "border-amber-500 bg-amber-500" : "border-slate-600 bg-slate-700"}`}>
      <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${value ? "left-[18px]" : "left-0.5"}`} />
    </button>
  )
}

export default function PerfilPage() {
  const [name, setName] = useState("João Silva")
  const [whatsapp, setWhatsapp] = useState("")
  const [favs, setFavs] = useState(["megasena"])
  const [profileSaved, setProfileSaved] = useState(false)
  const [notifs, setNotifs] = useState(Object.fromEntries(NOTIFS.map(n => [n.id, n.def])))
  const [notifSaved, setNotifSaved] = useState(false)
  const [showCur, setShowCur] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")

  const days = 142
  const planColor = days > 90 ? "border-emerald-500/30 bg-emerald-500/5"
                 : days > 30  ? "border-blue-500/30 bg-blue-500/5"
                 : days > 7   ? "border-amber-500/30 bg-amber-500/5"
                 :               "border-red-500/30 bg-red-500/5"

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A0E1A]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden gap-1 sm:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                href === "/perfil" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}><Icon size={13} />{label}</Link>
            ))}
          </nav>
          <button className="flex items-center gap-1 text-xs text-slate-500"><LogOut size={13} /> Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-white">Perfil</h1>
          <p className="mt-1 text-sm text-slate-400">Gerencie seus dados, plano e preferências</p>
        </div>

        {/* Plan card */}
        <div id="renovar" className={`rounded-2xl border p-5 ${planColor}`}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <div>
                <p className="font-bold text-emerald-400">Plano ativo</p>
                <p className="text-xs text-slate-400">LotoLogic — Acesso completo</p>
              </div>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">ATIVO</span>
          </div>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              { icon: Calendar, label: "Vencimento", value: "29/out/2025" },
              { icon: Clock,    label: "Dias restantes", value: `${days} dias` },
              { icon: BarChart2,label: "Loterias", value: "3 loterias" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg bg-[#1a2035] p-3 text-center">
                <Icon size={14} className="mx-auto mb-1 text-slate-400" />
                <p className="text-sm font-extrabold text-white">{value}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <div className="mb-5">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Progresso do plano</span>
              <span>{Math.round((days/182)*100)}% restante</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-emerald-500" style={{width:`${Math.round((days/182)*100)}%`}} />
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <div className="mb-4 flex items-center gap-2">
            <User size={16} className="text-slate-400" />
            <h2 className="font-bold text-white">Dados pessoais</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Nome completo</Label>
              <Input value={name} onChange={e => { setName(e.target.value); setProfileSaved(false) }}
                className="bg-[#1a2035] border-slate-700 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">E-mail</Label>
              <Input value="joao@email.com" readOnly
                className="bg-[#1a2035] border-slate-700 text-slate-400 cursor-not-allowed" />
              <p className="text-[11px] text-slate-600">O e-mail não pode ser alterado.</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">WhatsApp (opcional)</Label>
              <Input value={whatsapp} onChange={e => { setWhatsapp(e.target.value); setProfileSaved(false) }}
                placeholder="(11) 99999-9999"
                className="bg-[#1a2035] border-slate-700 text-white placeholder:text-slate-600" />
            </div>
            <div>
              <Label className="mb-2 block text-xs text-slate-400">Loterias favoritas</Label>
              <div className="flex gap-2">
                {[
                  { id:"megasena",  label:"Mega-Sena"  },
                  { id:"quina",     label:"Quina"      },
                  { id:"lotofacil", label:"Lotofácil"  },
                ].map(({ id, label }) => (
                  <button key={id} type="button"
                    onClick={() => { setFavs(prev => prev.includes(id) ? prev.filter(f=>f!==id) : [...prev,id]); setProfileSaved(false) }}
                    className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                      favs.includes(id) ? "border-amber-500/60 bg-amber-500/10 text-amber-400" : "border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}>{label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button onClick={() => setProfileSaved(true)}
                className="bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">
                Salvar alterações
              </Button>
              {profileSaved && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 size={14} /> Salvo!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Bell size={16} className="text-slate-400" />
            <h2 className="font-bold text-white">Notificações</h2>
          </div>
          <div className="space-y-3">
            {NOTIFS.map(({ id, label, desc }) => (
              <div key={id} className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
                <Toggle value={notifs[id]} onChange={() => { setNotifs(p => ({...p,[id]:!p[id]})); setNotifSaved(false) }} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-4">
            <button onClick={() => setNotifSaved(true)}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-[#0A0E1A] hover:bg-amber-400">
              Salvar preferências
            </button>
            {notifSaved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={13} /> Salvo!
              </span>
            )}
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Lock size={16} className="text-slate-400" />
            <h2 className="font-bold text-white">Segurança</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Senha atual</Label>
              <div className="relative">
                <Input type={showCur?"text":"password"} placeholder="••••••••"
                  className="bg-[#1a2035] border-slate-700 text-white pr-10" />
                <button type="button" onClick={() => setShowCur(v=>!v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showCur ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Nova senha</Label>
              <div className="relative">
                <Input type={showNew?"text":"password"} placeholder="Mínimo 8 caracteres"
                  className="bg-[#1a2035] border-slate-700 text-white pr-10" />
                <button type="button" onClick={() => setShowNew(v=>!v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showNew ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Confirmar nova senha</Label>
              <Input type="password" placeholder="Repita a senha"
                className="bg-[#1a2035] border-slate-700 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setPwSaved(true)}
                className="bg-blue-600 text-white font-bold hover:bg-blue-500">
                Alterar senha
              </Button>
              {pwSaved && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 size={13} /> Senha alterada!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="font-bold text-red-400">Zona de perigo</h2>
          </div>
          {!confirm ? (
            <>
              <p className="mb-4 text-sm text-slate-400">
                A exclusão da conta é permanente e remove todos os seus dados. Esta ação não pode ser desfeita.
              </p>
              <Button variant="outline" onClick={() => setConfirm(true)}
                className="border-red-500/40 text-red-400 hover:bg-red-500/10">
                Excluir minha conta
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-red-300">Tem certeza absoluta? Esta ação não pode ser desfeita.</p>
              <p className="text-xs text-slate-400">Digite <strong className="text-white">EXCLUIR</strong> para confirmar:</p>
              <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                placeholder="EXCLUIR"
                className="w-full rounded-lg border border-red-500/30 bg-[#1a2035] px-3 py-2 text-sm text-white outline-none focus:border-red-500 placeholder:text-slate-600" />
              <div className="flex gap-2">
                <Button disabled={deleteInput !== "EXCLUIR"}
                  className="bg-red-600 text-white font-bold hover:bg-red-500 disabled:opacity-40">
                  Confirmar exclusão
                </Button>
                <Button variant="outline" onClick={() => { setConfirm(false); setDeleteInput("") }}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
