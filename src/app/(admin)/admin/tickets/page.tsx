"use client"

import { useState, useEffect } from "react";
import { 
  Zap, 
  Pause, 
  Play, 
  Activity, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Database,
  Cpu,
  Trophy,
  Star,
  Clock,
  BellRing
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface AILog {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'scan' | 'flash';
}

interface GeneratedCoupon {
  id: string;
  type: 'Standard' | 'Élite';
  price: number;
  odds: string;
  probability: number;
  sport: string;
  status: 'published' | 'pending';
  publishType: 'scheduled' | 'flash';
  startTime: string;
  endTime: string;
  matches: { teams: string; odds: string; report: string }[];
}

export default function AdminPronosticsIA() {
  const [isPaused, setIsPaused] = useState(false);
  const [nextScan, setNextScan] = useState("17:00");
  const [logs, setLogs] = useState<AILog[]>([
    { id: '1', time: '10:00:05', message: 'Publication planifiée de 10h00 terminée.', type: 'success' },
    { id: '2', time: '10:45:12', message: 'Moteur en veille. Prochain scan prévu à 17h00.', type: 'info' },
    { id: '3', time: '11:12:20', message: 'DÉTECTION OPPORTUNITÉ FLASH : Basket NBA (Cote 8.42)...', type: 'flash' },
  ]);
  
  const [activeCoupon, setActiveCoupon] = useState<GeneratedCoupon | null>({
    id: 'VIC-985',
    type: 'Élite',
    price: 150,
    odds: '8.42',
    probability: 84,
    sport: 'Multi-Sports',
    status: 'published',
    publishType: 'flash',
    startTime: '12:30',
    endTime: '23:00',
    matches: [
      { teams: 'Lakers vs Warriors', odds: '1.85', report: '88% de probabilité de victoire à domicile. Historique favorable.' },
      { teams: 'Real Madrid vs Alaves', odds: '1.42', report: 'Validation Claude : Momentum très élevé.' },
      { teams: 'Djokovic vs Alcaraz', odds: '2.10', report: 'Analyse momentum : Avantage Alcaraz.' }
    ]
  });

  // Simulation de logs temps réel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      const isFlash = Math.random() > 0.9;
      const messages = isFlash 
        ? ['ALERTE FLASH : Opportunité haute valeur détectée !', 'Envoi de notifications Push & Email...']
        : [
            'Analyse des flux de données mondiaux...',
            'Surveillance des marchés Football...',
            'Calcul des indices de confiance...',
            'Vérification des blessures en temps réel...'
          ];
      
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const newLog: AILog = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        message: randomMsg,
        type: isFlash ? 'flash' : (Math.random() > 0.8 ? 'success' : 'scan')
      };
      setLogs(prev => [newLog, ...prev.slice(0, 14)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="space-y-12 pb-20">
      {/* Header avec Contrôles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Cpu className="w-4 h-4" />
              Intelligence Artificielle VictorIA
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Pilote <span className="text-orange-500 italic">Autonome</span>
           </h1>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden lg:flex flex-col items-end">
              <span className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Prochain Scan Planifié</span>
              <span className="text-xl font-black text-white font-outfit">{nextScan}</span>
           </div>
           <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-4 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${isPaused ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-red-500 text-white shadow-red-500/20'} shadow-xl hover:scale-105 active:scale-95`}
          >
            {isPaused ? <><Play className="w-5 h-5 fill-current" /> Reprendre l'IA</> : <><Pause className="w-5 h-5 fill-current" /> Mettre en Pause</>}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Colonne de Monitoring (Logs) */}
        <div className="lg:col-span-1 space-y-8">
           <div className="glass-card p-8 border-white/5 h-[550px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-sm font-black text-white uppercase tracking-widest font-outfit flex items-center gap-3">
                    <Activity className={`w-4 h-4 ${!isPaused ? 'text-orange-500 animate-pulse' : 'text-muted'}`} />
                    Terminal d'Activité
                 </h2>
                 {!isPaused && <div className="text-[9px] text-orange-500 font-black animate-pulse">LIVE</div>}
              </div>
              
              <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                 <AnimatePresence initial={false}>
                    {logs.map((log) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl space-y-1 border ${log.type === 'flash' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-white/[0.02] border-white/5'}`}
                      >
                         <div className="flex justify-between items-center">
                            <span className="text-[9px] text-muted font-bold font-mono">{log.time}</span>
                            {log.type === 'flash' && <BellRing className="w-3 h-3 text-orange-500 animate-bounce" />}
                            {log.type === 'success' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                            {log.type === 'scan' && <Search className="w-3 h-3 text-orange-500" />}
                         </div>
                         <p className={`text-[11px] leading-relaxed ${log.type === 'flash' ? 'text-orange-400 font-black' : log.type === 'success' ? 'text-green-400 font-bold' : 'text-muted'}`}>
                            {log.message}
                         </p>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>

           <div className="glass-card p-8 border-orange-500/10 bg-orange-500/5">
              <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Clock className="w-4 h-4" /> Planning de Routine
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Matin</span>
                    <span className="text-white font-black font-outfit">10H00</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Soir</span>
                    <span className="text-white font-black font-outfit">17H00</span>
                 </div>
                 <div className="h-px bg-orange-500/10 my-2" />
                 <div className="text-[9px] text-muted font-medium italic">
                    Note : En cas d'opportunité flash, le système publie immédiatement et prévient par email/push.
                 </div>
              </div>
           </div>
        </div>

        {/* Colonne d'Analyse (Dernier Coupon) */}
        <div className="lg:col-span-2 space-y-10">
           {activeCoupon ? (
             <div className="glass-card p-10 border-orange-500/20 relative overflow-hidden">
                {activeCoupon.publishType === 'flash' && (
                   <div className="absolute top-6 right-6 px-4 py-2 bg-orange-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-xl shadow-orange-500/40 z-20 flex items-center gap-2">
                      <Zap className="w-3 h-3 fill-current" /> Publication Flash
                   </div>
                )}
                
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-white/5 mb-10 relative z-10">
                   <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl ${activeCoupon.type === 'Élite' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white'} flex items-center justify-center`}>
                         {activeCoupon.type === 'Élite' ? <Trophy className="w-8 h-8" /> : <Star className="w-8 h-8" />}
                      </div>
                      <div>
                         <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tight">Dernier Coupon : {activeCoupon.id}</h2>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Type: {activeCoupon.type}</span>
                            <span className="text-[10px] text-muted font-bold">•</span>
                            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Sport: {activeCoupon.sport}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-8">
                      <div className="text-center">
                         <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Cote Totale</div>
                         <div className="text-3xl font-black text-white font-outfit tracking-tighter">{activeCoupon.odds}</div>
                      </div>
                      <div className="text-center">
                         <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Validité</div>
                         <div className="text-xs font-black text-green-500 uppercase font-outfit">{activeCoupon.startTime} — {activeCoupon.endTime}</div>
                      </div>
                   </div>
                </div>

                <div className="space-y-6 relative z-10">
                   {activeCoupon.matches.map((m, i) => (
                     <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <div className="text-lg font-black text-white font-outfit uppercase tracking-tight">{m.teams}</div>
                           <div className="px-3 py-1 bg-white/5 rounded-lg text-xs font-black text-white">Cote: {m.odds}</div>
                        </div>
                        <p className="text-muted text-[11px] leading-relaxed italic">
                           <span className="text-orange-500 font-black not-italic mr-2">ANALYSE IA :</span>
                           {m.report}
                        </p>
                     </div>
                   ))}
                </div>

                <div className="mt-12 flex items-center justify-between p-6 bg-green-500/10 border border-green-500/20 rounded-2xl relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center">
                         <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                         <div className="text-[10px] text-green-500 font-black uppercase tracking-widest">Status Diffusion</div>
                         <div className="text-sm font-bold text-white uppercase tracking-tight">EN LIGNE ({activeCoupon.price}F) • NOTIFICATIONS ENVOYÉES</div>
                      </div>
                   </div>
                   <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
                      Retirer
                   </button>
                </div>
             </div>
           ) : (
             <div className="glass-card p-20 flex flex-col items-center justify-center text-center">
                <Database className="w-16 h-16 text-muted/20 mb-8" />
                <h3 className="text-xl font-black text-muted font-outfit uppercase">Recherche en cours...</h3>
             </div>
           )}

           {/* Historique Rapide */}
           <div className="space-y-6">
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest font-outfit flex items-center gap-3">
                 <History className="w-4 h-4 text-orange-500" />
                 Dernières Performances
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {[
                   { id: '#981', odds: '4.20', status: 'Gagné' },
                   { id: '#980', odds: '9.15', status: 'Gagné' },
                   { id: '#979', odds: '3.80', status: 'Perdu' }
                 ].map((h, i) => (
                   <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                      <span className="text-[10px] font-black text-white">{h.id}</span>
                      <span className="text-[10px] font-black text-orange-500">Cote {h.odds}</span>
                      <div className={`w-2 h-2 rounded-full ${h.status === 'Gagné' ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500'} shadow-lg`} />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
