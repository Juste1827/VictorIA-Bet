"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Wallet, 
  Trophy, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const StatCard = ({ title, value, subtext, icon: Icon, trend, color = "primary" }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-8 group hover:border-primary/30 transition-all duration-500"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-${color}/10 border border-${color}/20 text-${color} group-hover:scale-110 transition-transform duration-500`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${trend > 0 ? 'text-primary' : 'text-red-500'}`}>
          {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="text-muted text-[10px] font-black uppercase tracking-[0.3em] mb-2">{title}</div>
    <div className="text-4xl font-black text-white font-outfit tracking-tighter mb-2">{value}</div>
    <div className="text-muted/60 text-xs font-medium">{subtext}</div>
  </motion.div>
);

const QuickTicket = ({ name, odds, status, price }: any) => (
  <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
    <div className="flex items-center gap-6">
       <div className={`p-3 rounded-xl ${status === 'GAGNÉ' ? 'bg-primary/10 text-primary' : 'bg-white/10 text-white/40'}`}>
          <Trophy className="w-6 h-6" />
       </div>
       <div>
          <div className="text-white font-black font-outfit uppercase tracking-tight">{name}</div>
          <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Cote: <span className="text-white">{odds}</span> • {price} FCFA</div>
       </div>
    </div>
    <div className="text-right">
       <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${status === 'GAGNÉ' ? 'bg-primary text-black' : 'bg-white/5 text-muted'}`}>
          {status}
       </div>
       <div className="text-[9px] text-muted font-bold mt-2 uppercase tracking-widest">25 Avr 2026</div>
    </div>
  </div>
);

const ProfitChart = () => {
  const points = "0,80 50,60 100,75 150,40 200,55 250,20 300,35 350,10 400,25";
  return (
    <div className="glass-card p-10 h-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-lg font-black text-white font-outfit uppercase tracking-tight">Analyse de Performance</h3>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Évolution des gains (7 derniers jours)</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase">
          <TrendingUp className="w-3 h-3" /> +24%
        </div>
      </div>
      
      <div className="relative h-64 w-full group">
        {/* SVG Chart */}
        <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.5" />
          ))}

          {/* Area */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d={`M 0,100 L ${points} L 400,100 Z`}
            fill="url(#chartGradient)"
          />

          {/* Line */}
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="drop-shadow-[0_0_8px_rgba(82,255,0,0.5)]"
          />

          {/* Points */}
          {points.split(" ").map((p, i) => {
            const [x, y] = p.split(",");
            return (
              <motion.circle
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                cx={x} cy={y} r="3"
                fill="var(--primary)"
                className="cursor-pointer hover:r-5 transition-all"
              />
            );
          })}
        </svg>

        {/* X-Axis Labels */}
        <div className="flex justify-between mt-6 px-1">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
            <span key={day} className="text-[9px] text-muted font-black uppercase tracking-widest">{day}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [range, setRange] = useState("Derniers 30 jours");
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  return (
    <div className="space-y-12 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Sparkles className="w-4 h-4" />
              Intelligence Artificielle Active
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Ravi de vous revoir, <span className="premium-gradient-text italic">Jean</span>
           </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <button 
                onClick={() => setIsRangeOpen(!isRangeOpen)}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-3 min-w-[200px] justify-between"
              >
                 <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    {range}
                 </div>
                 <ChevronDown className={`w-4 h-4 transition-transform ${isRangeOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                 {isRangeOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-full bg-[#05070A] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl"
                    >
                       {["Derniers 7 jours", "Derniers 30 jours", "Cette année"].map((opt) => (
                          <button 
                            key={opt}
                            onClick={() => {
                               setRange(opt);
                               setIsRangeOpen(false);
                            }}
                            className="w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted hover:text-white hover:bg-white/5 transition-all"
                          >
                             {opt}
                          </button>
                       ))}
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           <Link href="/wallet" className="px-8 py-4 bg-primary rounded-2xl text-[10px] font-black uppercase tracking-widest text-black shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3">
              <Wallet className="w-4 h-4" />
              Recharger
           </Link>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Solde Actuel" 
          value="12 450 FCFA" 
          subtext="Disponible pour retrait" 
          icon={Wallet} 
          trend={+12}
        />
        <StatCard 
          title="Profit Total" 
          value="84 200 FCFA" 
          subtext="Net après mises" 
          icon={TrendingUp} 
          trend={+24}
        />
        <StatCard 
          title="Tickets Gagnés" 
          value="42" 
          subtext="Taux de réussite : 89%" 
          icon={Trophy} 
        />
        <StatCard 
          title="Commissions" 
          value="2 150 FCFA" 
          subtext="Revenus d'affiliation" 
          icon={Users} 
          trend={+5}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Left Column: Recent Tickets & Chart */}
         <div className="lg:col-span-2 space-y-12">
            <ProfitChart />
            
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Mes Derniers Pronostics</h2>
                  <Link href="/tickets" className="text-[10px] font-black text-primary uppercase tracking-widest hover:translate-x-2 transition-transform flex items-center gap-2">
                     Tout voir <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>
               
               <div className="space-y-4">
                  <QuickTicket name="Ticket Premium #827" odds="150.0" status="GAGNÉ" price="500" />
                  <QuickTicket name="Ticket Avancé #821" odds="24.50" status="GAGNÉ" price="300" />
                  <QuickTicket name="Ticket Standard #815" odds="4.20" status="EN COURS" price="100" />
               </div>
            </div>
         </div>

         {/* Right Column: AI Analysis & Actions */}
         <div className="space-y-8">
            <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Analyse VictorIA</h2>
            
            <div className="glass-card p-10 bg-primary/5 border-primary/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-125 transition-transform duration-700">
                  <Zap className="w-20 h-20 text-primary" />
               </div>
               <div className="relative z-10">
                  <div className="text-primary font-black uppercase tracking-widest text-[10px] mb-4">Opportunité Détectée</div>
                  <h3 className="text-xl font-black text-white mb-6 uppercase leading-tight font-outfit">Match à haute probabilité (92%) disponible</h3>
                  <p className="text-muted text-sm mb-8 leading-relaxed">Notre algorithme Claude 4.6 vient de valider une anomalie de cote sur le match Real Madrid vs Man City.</p>
                  <Link href="/tickets" className="inline-flex items-center gap-3 px-6 py-3 bg-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-black transition-all">
                     Acheter maintenant <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>

            <div className="glass-card p-10 border-white/5">
               <h3 className="text-lg font-black text-white mb-8 uppercase font-outfit">Affiliation</h3>
               <p className="text-muted text-xs mb-8 leading-relaxed">Gagnez 5% sur chaque ticket acheté par vos filleuls.</p>
               <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between mb-8">
                  <span className="text-[10px] text-muted font-bold truncate mr-4">victoria-bet.com/ref/jean82</span>
                  <button className="text-primary text-[10px] font-black uppercase tracking-widest shrink-0">Copier</button>
               </div>
               <Link href="/affiliation" className="text-muted/60 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Détails du programme</Link>
            </div>
         </div>
      </div>
    </div>
  );
}
