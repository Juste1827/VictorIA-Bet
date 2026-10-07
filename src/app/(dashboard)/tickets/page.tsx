"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Search, 
  ExternalLink, 
  Eye, 
  BadgeCheck, 
  ChevronRight,
  TrendingUp,
  History,
  Zap,
  Star,
  ArrowRight,
  Clock,
  AlertTriangle,
  Cpu
} from "lucide-react";

// --- Types ---
interface Ticket {
  id: string;
  name: string;
  date: string;
  odds: string;
  price: string;
  status: 'GAGNÉ' | 'EN COURS' | 'PERDU';
  type: 'Standard' | 'Élite';
  isFlash?: boolean;
  startTime: string;
  endTime: string;
}

const TicketRow = ({ id, name, date, odds, price, status, type, isFlash, startTime, endTime }: Ticket) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Simulation de validité basée sur l'heure (ici on considère que c'est valide si status est EN COURS)
  const isValid = status === 'EN COURS';

  return (
    <div className="glass-card overflow-hidden group transition-all duration-500 border-white/5 hover:border-primary/20">
      <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className={`p-4 rounded-2xl ${status === 'GAGNÉ' ? 'bg-primary/10 text-primary' : status === 'EN COURS' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h3 className="text-xl font-black text-white font-outfit uppercase tracking-tight">{name}</h3>
               {isFlash && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest animate-pulse">
                    <Zap className="w-2 h-2 fill-current" /> Flash
                  </span>
               )}
            </div>
            <div className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-3">
               <span>{date}</span>
               <span className="h-1 w-1 rounded-full bg-white/20" />
               <span className={type === 'Élite' ? 'text-primary' : 'text-white/60'}>{type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
           <div className="text-center">
              <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Cote IA</div>
              <div className="text-2xl font-black text-white font-outfit tracking-tighter">{odds}</div>
           </div>
           <div className="text-center hidden sm:block">
              <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Validité</div>
              <div className="text-[10px] font-bold text-white uppercase tracking-tight">{startTime} — {endTime}</div>
           </div>
           <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                status === 'GAGNÉ' ? 'bg-primary text-black' : 
                status === 'EN COURS' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
              }`}>
                 {status === 'GAGNÉ' && <BadgeCheck className="w-4 h-4" />}
                 {status}
              </div>
           </div>
           <button 
             onClick={() => setShowDetails(!showDetails)}
             className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:text-black transition-all"
           >
              {showDetails ? <ChevronRight className="w-5 h-5 rotate-90" /> : <Eye className="w-5 h-5" />}
           </button>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-black/40"
          >
            <div className="p-10">
               <div className="grid lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <h4 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">Détails des Matchs</h4>
                     {[
                       { match: "Lakers vs Warriors (NBA)", bet: "Victoire Lakers", proba: "88%", time: "12:30" },
                       { match: "Real Madrid vs Alaves", bet: "Victoire Real Madrid", proba: "92%", time: "21:00" }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div>
                             <div className="text-white font-bold text-sm mb-1">{item.match}</div>
                             <div className="text-[10px] text-primary font-black uppercase tracking-widest">{item.bet}</div>
                          </div>
                          <div className="text-right">
                             <div className="text-xl font-black text-white font-outfit">{item.proba}</div>
                             <div className="text-[9px] text-muted font-bold">Début: {item.time}</div>
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="space-y-6">
                     <h4 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">Expertise IA</h4>
                     <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-3 mb-4">
                           <Cpu className="w-5 h-5 text-primary" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-white">Analyse VictorIA 4.6</span>
                        </div>
                        <p className="text-[11px] text-muted leading-relaxed italic mb-6">"Note de l'IA : Ce coupon a été généré en mode flash suite à un pic de momentum sur le marché du basket NBA. Probabilité de gain estimée à 84%."</p>
                        <div className="grid grid-cols-2 gap-4">
                           <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all text-[9px] font-black uppercase tracking-widest">
                              <ExternalLink className="w-4 h-4 text-primary" /> 1XBET
                           </button>
                           <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all text-[9px] font-black uppercase tracking-widest">
                              <TrendingUp className="w-4 h-4 text-primary" /> Analyse
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShopCouponCard = ({ name, odds, price, type, color, icon: Icon, isFlash, startTime, endTime }: any) => {
  // Un coupon est considéré valide pour l'exemple
  const isValid = true;

  return (
    <div className="glass-card p-8 border-white/5 bg-white/[0.01] hover:border-primary/30 transition-all group relative overflow-hidden">
       {isFlash && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg z-20 flex items-center gap-2 animate-bounce">
             <Zap className="w-2 h-2 fill-current" /> Opportunité Flash
          </div>
       )}
       
       <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest z-20 flex items-center gap-2 ${isValid ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {isValid ? 'Valide' : 'Expiré'}
       </div>

       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
       
       <div className="mt-8 flex justify-between items-start mb-6">
          <div className={`p-4 rounded-xl ${color} text-black shadow-lg shadow-black/20`}>
             <Icon className="w-6 h-6" />
          </div>
          <div className="text-right">
             <div className="text-[8px] text-muted font-black uppercase tracking-widest mb-1">Fin de validité</div>
             <div className="text-xs font-black text-white font-outfit">{endTime}</div>
          </div>
       </div>
       
       <h3 className="text-xl font-black text-white font-outfit uppercase tracking-tight mb-1">{name}</h3>
       <div className="flex items-center gap-2 text-[10px] text-primary font-black uppercase tracking-widest mb-6">
          <Clock className="w-3 h-3 text-primary" /> {startTime} — {endTime}
       </div>
       
       <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
             <div className="text-[9px] text-muted font-bold uppercase tracking-widest mb-1">Cotes</div>
             <div className="text-xl font-black text-white font-outfit">{odds}</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-right">
             <div className="text-[9px] text-muted font-bold uppercase tracking-widest mb-1">Prix</div>
             <div className="text-xl font-black text-primary font-outfit">{price}F</div>
          </div>
       </div>

       <button className="w-full py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
          Débloquer maintenant <ArrowRight className="w-4 h-4" />
       </button>
    </div>
  );
};

export default function Tickets() {
  const [filter, setFilter] = useState("Tous");
  const categories = ["Tous", "En Cours", "Gagnés", "Perdus"];

  const allTickets: Ticket[] = [
    { id: "985", name: "Basket Flash Élite", date: "26 Avr 2026", odds: "8.42", price: "150", status: "EN COURS", type: "Élite", isFlash: true, startTime: "12:30", endTime: "23:00" },
    { id: "981", name: "Safe Night Routine", date: "26 Avr 2026", odds: "4.20", price: "100", status: "GAGNÉ", type: "Standard", startTime: "10:00", endTime: "21:00" },
    { id: "980", name: "Élite Foot Routine", date: "25 Avr 2026", odds: "9.15", price: "150", status: "GAGNÉ", type: "Élite", startTime: "17:00", endTime: "00:00" },
    { id: "979", name: "Combiné Standard", date: "25 Avr 2026", odds: "3.80", price: "100", status: "PERDU", type: "Standard", startTime: "10:00", endTime: "20:00" },
  ];

  const filteredTickets = allTickets.filter(t => {
    if (filter === "Tous") return true;
    if (filter === "En Cours") return t.status === "EN COURS";
    if (filter === "Gagnés") return t.status === "GAGNÉ";
    if (filter === "Perdus") return t.status === "PERDU";
    return true;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* BOUTIQUE */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                 <Zap className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Boutique <span className="text-primary">VictorIA</span></h2>
                 <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">Nouveaux coupons : 10h00 • 17h00 • Alertes Flash</p>
              </div>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
           <ShopCouponCard name="Routine Matin" odds="3 - 5" price="100" type="Standard" color="bg-white" icon={Star} startTime="10:00" endTime="21:00" />
           <ShopCouponCard name="NBA Flash Élite" odds="6 - 10" price="150" type="Élite" color="bg-primary" icon={Trophy} isFlash={true} startTime="12:30" endTime="23:00" />
        </div>
      </section>

      <div className="h-px bg-white/5 w-full my-12" />

      {/* HISTORIQUE */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <History className="w-4 h-4" />
              Suivi de mes paris
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Mes <span className="premium-gradient-text italic">Investissements</span>
           </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/10">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setFilter(cat)}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-black' : 'text-muted hover:text-white'}`}
             >
                {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
           {filteredTickets.map((ticket) => (
              <motion.div 
                key={ticket.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                 <TicketRow {...ticket} />
              </motion.div>
           ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
