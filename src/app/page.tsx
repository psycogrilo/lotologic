import Link from "next/link"
import { CheckCircle2, Bell, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cls = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" }[size]
  return (
    <span className={`font-extrabold tracking-tight ${cls}`}>
      <span className="text-amber-400">Loto</span>
      <span className="text-blue-500">Logic</span>
    </span>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0A0E1A]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="hidden gap-6 text-sm text-slate-400 sm:flex">
          <a href="#features" className="hover:text-amber-400 transition-colors">Recursos</a>
          <a href="#precos" className="hover:text-amber-400 transition-colors">Preços</a>
          <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
        </nav>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild className="text-slate-300">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button size="sm" asChild className="bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">
            <Link href="/register">Começar agora</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center">
      <Badge className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400">
        Mega-Sena · Quina · Lotofácil
      </Badge>
      <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
        Jogue com{" "}
        <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          inteligência
        </span>{" "}
        estatística
      </h1>
      <p className="mx-auto mb-8 max-w-xl text-base text-slate-400 sm:text-lg">
        Desdobramentos automáticos, análise por colunas e histórico completo.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" asChild className="w-full sm:w-auto bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">
          <Link href="/register">Quero acessar por R$ 89,90</Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800">
          <a href="#precos">Ver preços</a>
        </Button>
      </div>
      <p className="mt-3 text-xs text-slate-500">Pix · Cartão · Boleto — ativação imediata</p>
      <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
        {[
          { icon: Shield, label: "Pagamento seguro via Mercado Pago" },
          { icon: Clock,  label: "Acesso por 6 meses completos" },
          { icon: Bell,   label: "Alertas de sorteio por e-mail" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center gap-2">
            <Icon size={15} className="text-amber-400" /> {label}
          </span>
        ))}
      </div>
    </section>
  )
}

const FEATURES = [
  "3 loterias: Mega-Sena, Quina e Lotofácil",
  "Gerador com lógica de colunas (score 0–100%)",
  "Desdobramento inteligente — todas as combinações",
  "Exportação de desdobramentos em PDF",
  "Análise pós-sorteio coluna a coluna",
  "Histórico completo de 6 meses",
  "Alertas de sorteio por e-mail",
  "Suporte via chat em horário comercial",
]

function PricingSection() {
  return (
    <section id="precos" className="mx-auto max-w-sm px-4 py-16">
      <h2 className="mb-8 text-center text-2xl font-bold text-white">Acesso completo por um preço único</h2>
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-slate-800 to-[#111827] p-6 shadow-2xl">
        <div className="absolute -right-8 top-5 rotate-[35deg] bg-amber-500 px-10 py-1 text-xs font-bold text-[#0A0E1A]">POPULAR</div>
        <div className="mb-1 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-amber-400">R$ 89,90</span>
        </div>
        <p className="mb-5 text-sm text-slate-400">pagamento único · acesso por 6 meses</p>
        <ul className="mb-6 space-y-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-200">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" /> {f}
            </li>
          ))}
        </ul>
        <Button size="lg" asChild className="w-full bg-amber-500 text-[#0A0E1A] font-bold hover:bg-amber-400">
          <Link href="/register">Quero acessar por R$ 89,90</Link>
        </Button>
        <p className="mt-3 text-center text-xs text-slate-500">Pix · Cartão · Boleto — ativação imediata</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
      <Logo size="sm" />
      <p className="mt-2">© {new Date().getFullYear()} LotoLogic. Todos os direitos reservados.</p>
      <p className="mt-1">Este produto não tem vínculo com a Caixa Econômica Federal.</p>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0E1A] text-slate-100">
      <Nav />
      <HeroSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
