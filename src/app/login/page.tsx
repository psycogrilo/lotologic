"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Logo() {
  return (
    <span className="text-4xl font-extrabold tracking-tight">
      <span className="text-amber-400">Loto</span>
      <span className="text-blue-500">Logic</span>
    </span>
  )
}

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
})
const forgotSchema = z.object({
  email: z.string().email("E-mail inválido"),
})
type LoginForm = z.infer<typeof loginSchema>
type ForgotForm = z.infer<typeof forgotSchema>

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const [forgot, setForgot] = useState(false)
  const [fSent, setFSent] = useState(false)
  const [fEmail, setFEmail] = useState("")
  const [loginErr, setLoginErr] = useState("")

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const forgotForm = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) })

  async function onLogin(data: LoginForm) {
    setLoginErr("")
    await new Promise(r => setTimeout(r, 800))
    setLoginErr("E-mail ou senha incorretos")
  }

  async function onForgot(data: ForgotForm) {
    await new Promise(r => setTimeout(r, 800))
    setFEmail(data.email)
    setFSent(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0E1A] px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/"><Logo /></Link>
        <p className="mt-2 text-sm text-slate-400">
          {forgot ? "Recupere o acesso à sua conta" : "Bem-vindo de volta"}
        </p>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
        {forgot ? (
          fSent ? (
            <div className="space-y-4 text-center">
              <CheckCircle2 size={48} className="mx-auto text-emerald-400" />
              <h2 className="text-lg font-bold text-white">E-mail enviado!</h2>
              <p className="text-sm text-slate-400">
                Enviamos instruções para <strong className="text-white">{fEmail}</strong>.
              </p>
              <Button variant="outline" onClick={() => { setForgot(false); setFSent(false) }}
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                Voltar ao login
              </Button>
            </div>
          ) : (
            <form onSubmit={forgotForm.handleSubmit(onForgot)} className="space-y-4">
              <h1 className="text-lg font-bold text-white">Recuperar senha</h1>
              <p className="text-sm text-slate-400">Informe seu e-mail para receber o link de redefinição.</p>
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">E-mail</Label>
                <Input {...forgotForm.register("email")} type="email" placeholder="joao@email.com"
                  className="bg-[#1a2035] border-slate-700 text-white placeholder:text-slate-600" />
                {forgotForm.formState.errors.email && (
                  <p className="text-xs text-red-400">{forgotForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" disabled={forgotForm.formState.isSubmitting}
                className="w-full bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">
                {forgotForm.formState.isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Enviar link"}
              </Button>
              <button type="button" onClick={() => setForgot(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300">
                ← Voltar ao login
              </button>
            </form>
          )
        ) : (
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <h1 className="text-lg font-bold text-white">Entrar</h1>
            {loginErr && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {loginErr}
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">E-mail</Label>
              <Input {...loginForm.register("email")} type="email" placeholder="joao@email.com"
                className="bg-[#1a2035] border-slate-700 text-white placeholder:text-slate-600" />
              {loginForm.formState.errors.email && (
                <p className="text-xs text-red-400">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-400">Senha</Label>
                <button type="button" onClick={() => setForgot(true)}
                  className="text-xs text-blue-400 hover:underline">
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Input {...loginForm.register("password")} type={showPw ? "text" : "password"}
                  placeholder="Sua senha"
                  className="bg-[#1a2035] border-slate-700 text-white placeholder:text-slate-600 pr-10" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loginForm.formState.isSubmitting}
              className="w-full bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">
              {loginForm.formState.isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
            </Button>
          </form>
        )}
        <div className="mt-5 border-t border-slate-800 pt-4 text-center text-sm text-slate-400">
          Não tem conta?{" "}
          <Link href="/register" className="font-semibold text-amber-400 hover:underline">Criar conta</Link>
        </div>
      </div>
    </main>
  )
}
