"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, User, Lock, Loader2, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const { signUp } = useAuth()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    
    const { error } = await signUp(email, password, username)
    
    setLoading(false)
    if (error) {
      setErrorMsg(error.message)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-[#050810] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted hover:text-white transition-colors z-50">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Accueil</span>
      </Link>

      <div className="w-full max-w-md glass-card p-8 md:p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <Image src="/images/logo.png" fill alt="VictorIA Logo" className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Rejoindre l'Élite</h1>
          <p className="text-muted text-sm">Créez votre accès VictorIA BET</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Nom d'utilisateur</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/30" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Victor01"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Adresse Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/30" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/30" />
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full glass-button py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 text-sm uppercase tracking-widest shadow-xl shadow-primary/10"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer mon compte"}
          </button>

          <div className="flex items-center gap-2 justify-center text-[10px] text-muted/60 uppercase tracking-wider pt-2">
            <ShieldCheck className="w-3 h-3 text-accent" />
            <span>Serveurs sécurisés SSL 256-bit</span>
          </div>

          <div className="text-center text-sm text-muted pt-4 border-t border-white/5 mt-6">
            Déjà membre ?{" "}
            <Link href="/login" className="text-primary font-bold hover:text-white transition-colors">Se connecter</Link>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-[10px] text-muted/40 max-w-xs leading-relaxed uppercase tracking-widest">
        VictorIA BET © 2026 — Précision Mathématique & IA
      </p>
    </div>
  )
}
