"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API = "https://lotologic-api-production.up.railway.app"

function Logo() {
  return (
    <span className="text-4xl font-extrabold tracking-tight">
      <span className="text-amber-400">Loto</span>
      <span className="text-blue-500">Logic</span>
    </span>
  )
}

const schema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<Form>({ resolver: zodResolver(schema) })

  async function onSubmit(data: Form) {
    setError("")
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      })
      const body = await res.json()
      if (!res.ok) { setError(body.message || "Erro ao cadastrar"); return }
      setEmail(data.email)
      setSent(true)
    } catch (e) {
      setError("Erro de conexão. Tente novamente.")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0E1A] px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/"><Logo /></Link>
        <p className="mt-2 text-sm text-slate-400">Crie sua conta e comece a jogar com inteligência</p>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
        {sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
              <Mail size={28} className="text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Confirme seu e-mail</h2>
            <p className="text-sm text-slate-400">
              Enviamos um link para <strong className="text-white">{email}</strong>.
            </p>
            <Link href="/login" className="block text-xs text-slate-500 hover:text-slate-300">
              Já confirmei → ir para login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h1 className="text-lg font-bold text-white">Criar conta</h1>
            {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Nome completo</Label>
              <Input {...register("name")} placeholder="João Silva"
                className="bg-[#1a2035] border-slate-700 text-white placeholder:text-slate-600" />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">E-mail</Label>
              <Input {...register("email")} type="email" placeholder="joao@email.com"
                className="bg-[#1a2035] border-slate-700 text-white placeholder:text-slate-600" />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Senha</Label>
              <div className="relative">
                <Input {...register("password")} type={showPw ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className="bg-[#1a2035] border-slate-700 text-white placeholder:text-slate-600 pr-10" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Confirmar senha</Label>
              <Input {...register("confirmPassword")} type="password" placeholder="Repita a senha"
                className="bg-[#1a2035] border-slate-700 text-white placeholder:text-slate-600" />
              {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting}
              className="w-full bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Criar conta"}
            </Button>
          </form>
        )}
        <div className="mt-5 border-t border-slate-800 pt-4 text-center text-sm text-slate-400">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-amber-400 hover:underline">Entrar</Link>
        </div>
      </div>
    </main>
  )
}
