"use client"

import { motion } from "framer-motion";
import { 
  Users, 
  Link as LinkIcon, 
  Copy, 
  TrendingUp, 
  Gift, 
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  CheckCircle2
} from "lucide-react";

const ReferralRow = ({ name, date, commission, status }: any) => (
  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
    <div className="flex items-center gap-6">
       <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-black text-sm font-outfit">
          {name[0]}
       </div>
       <div>
          <div className="text-white font-black font-outfit uppercase tracking-tight">{name}</div>
          <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Inscrit le {date}</div>
       </div>
    </div>
    <div className="text-right">
       <div className="text-xl font-black font-outfit text-primary">+{commission} FCFA</div>
       <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${status === 'ACTIF' ? 'text-primary' : 'text-muted'}`}>
          {status}
       </div>
    </div>
  </div>
);

export default function Affiliation() {
  const referralLink = "https://victoria-bet.com/ref/jean82";

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Star className="w-4 h-4" />
              Programme Ambassadeur
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Mon <span className="premium-gradient-text italic">Affiliation</span>
           </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Referral Link & Stats */}
        <div className="lg:col-span-2 space-y-12">
           <div className="glass-card p-12 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                 <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter mb-8">Votre Lien de Parrainage</h2>
                 <p className="text-muted text-sm mb-10 leading-relaxed max-w-xl">Partagez ce lien unique avec vos amis et recevez 5% de commission sur chaque achat de ticket qu'ils effectuent, à vie.</p>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow p-5 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between group">
                       <span className="text-white font-bold text-sm truncate">{referralLink}</span>
                       <LinkIcon className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <button className="px-10 py-5 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-105 transition-all shrink-0">
                       <Copy className="w-5 h-5" /> Copier
                    </button>
                 </div>
              </div>
           </div>

           <div className="grid sm:grid-cols-3 gap-8">
              <div className="glass-card p-8 border-white/5">
                 <div className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-4">Filleuls Totaux</div>
                 <div className="text-4xl font-black text-white font-outfit tracking-tighter">12</div>
                 <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                    <TrendingUp className="w-4 h-4" /> +2 ce mois
                 </div>
              </div>
              <div className="glass-card p-8 border-white/5">
                 <div className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-4">Commission Totale</div>
                 <div className="text-4xl font-black text-white font-outfit tracking-tighter">8 450F</div>
                 <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                    <Zap className="w-4 h-4" /> Retirable
                 </div>
              </div>
              <div className="glass-card p-8 border-white/5">
                 <div className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-4">Taux Bonus</div>
                 <div className="text-4xl font-black text-white font-outfit tracking-tighter">5%</div>
                 <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                    <Gift className="w-4 h-4" /> Niveau Gold
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Filleuls Récents</h2>
              <div className="space-y-4">
                 <ReferralRow name="Koffi Armand" date="24 Avr 2026" commission="50" status="ACTIF" />
                 <ReferralRow name="Sonia Kouame" date="22 Avr 2026" commission="150" status="ACTIF" />
                 <ReferralRow name="Ibrahim Diallo" date="20 Avr 2026" commission="30" status="ACTIF" />
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Comment ça marche ?</h2>
           <div className="space-y-6">
              {[
                { title: "Partagez votre lien", desc: "Utilisez les réseaux sociaux ou envoyez-le directement à vos amis parieurs." },
                { title: "Ils s'inscrivent", desc: "Dès qu'ils créent un compte via votre lien, ils deviennent vos filleuls à vie." },
                { title: "Ils achètent un ticket", desc: "Sur chaque ticket acheté (100F, 300F ou 500F), vous touchez 10% de commission." },
                { title: "Retirez vos gains", desc: "Vos commissions s'ajoutent à votre solde et sont retirables par Mobile Money." }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg font-outfit shrink-0">
                      {i + 1}
                   </div>
                   <div>
                      <div className="text-white font-bold text-sm mb-2">{step.title}</div>
                      <p className="text-[11px] text-muted leading-relaxed font-medium">{step.desc.replace('10%', '5%')}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="glass-card p-10 bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center gap-3 mb-6">
                 <ShieldCheck className="w-6 h-6 text-emerald-400" />
                 <h3 className="text-sm font-black text-white uppercase tracking-widest font-outfit">Engagement VictorIA</h3>
              </div>
              <p className="text-[11px] text-muted leading-relaxed italic">"Notre programme d'affiliation est conçu pour récompenser la fidélité. Les commissions sont créditées instantanément dès la validation du paiement du filleul."</p>
           </div>
        </div>
      </div>
    </div>
  );
}
