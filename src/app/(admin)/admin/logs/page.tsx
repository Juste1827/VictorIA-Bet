"use client"

import { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Cpu, 
  Database, 
  Brain, 
  Ticket, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  Zap,
  BarChart3,
  Search,
  Filter,
  Terminal,
  Trash2,
  LogOut,
  MessageSquare,
  Send,
  Bot,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

// --- COMPOSANTS INTERNES ---

const AgentStatsCard = ({ agent, name, status, metrics, color, isActive, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`glass-card p-8 border-white/5 bg-white/[0.01] hover:border-white/20 transition-all group text-left w-full ${isActive ? 'ring-2 ring-orange-500/50 bg-orange-500/5 border-orange-500/20' : ''}`}
  >
    <div className="flex items-center justify-between mb-8">
       <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
             {agent === 'A' && <Database className="w-6 h-6" />}
             {agent === 'B' && <Cpu className="w-6 h-6" />}
             {agent === 'C' && <Brain className="w-6 h-6" />}
             {agent === 'D' && <Ticket className="w-6 h-6" />}
          </div>
          <div>
             <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Agent {agent}</div>
             <h3 className="text-xl font-black text-white font-outfit uppercase tracking-tight">{name}</h3>
          </div>
       </div>
       <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${isActive ? 'bg-orange-500/20 border-orange-500/40 text-orange-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-orange-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
          <span className="text-[9px] font-black uppercase tracking-widest">{isActive ? 'Sélectionné' : status}</span>
       </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-8">
       {metrics.map((m: any, i: number) => (
         <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5">
            <div className="text-[9px] text-muted font-bold uppercase tracking-widest mb-2">{m.label}</div>
            <div className="text-lg font-black text-white font-outfit">{m.value}</div>
         </div>
       ))}
    </div>

    <div className="pt-6 border-t border-white/5">
       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted">
          <span>Performance Globale</span>
          <span className="text-white">94%</span>
       </div>
       <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
          <div className={`h-full ${color.split(' ')[0]} w-[94%] transition-all duration-1000`} />
       </div>
    </div>
  </button>
);

const LogEntry = ({ agent, message, type, time }: any) => (
  <div className="flex items-center gap-6 p-4 hover:bg-white/[0.02] transition-colors border-b border-white/5 group animate-in fade-in slide-in-from-left-2 duration-300">
    <div className="w-20 text-[10px] text-muted font-black uppercase tracking-widest shrink-0">{time}</div>
    <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest shrink-0 ${
      agent === 'A' ? 'bg-blue-500/10 text-blue-500' :
      agent === 'B' ? 'bg-purple-500/10 text-purple-500' :
      agent === 'C' ? 'bg-pink-500/10 text-pink-500' : 'bg-orange-500/10 text-orange-500'
    }`}>Agent {agent}</div>
    <div className={`text-sm font-medium flex-grow ${type === 'error' ? 'text-red-400' : 'text-white/80'}`}>
       {message}
    </div>
    <div className="shrink-0">
       {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
       {type === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
       {type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
    </div>
  </div>
);

const AgentChat = ({ agent }: { agent: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('admin_chat_messages')
        .select('*')
        .eq('target_agent', agent)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
      setLoading(false);
    };

    fetchHistory();

    const channel = supabase
      .channel(`agent_chat_${agent}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'admin_chat_messages',
        filter: `target_agent=eq.${agent}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [agent]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = { role: 'user', content: input, target_agent: agent };
    setInput("");
    await supabase.from('admin_chat_messages').insert([msg]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="glass-card border-orange-500/30 bg-orange-500/5 flex flex-col h-[500px] overflow-hidden"
    >
      <div className="p-6 border-b border-orange-500/10 flex items-center justify-between bg-orange-500/5">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
               agent === 'A' ? 'bg-blue-500/20 text-blue-500' :
               agent === 'B' ? 'bg-purple-500/20 text-purple-500' :
               agent === 'C' ? 'bg-pink-500/20 text-pink-500' : 'bg-orange-500/20 text-orange-500'
            }`}>
               {agent === 'A' && <Database className="w-4 h-4" />}
               {agent === 'B' && <Cpu className="w-4 h-4" />}
               {agent === 'C' && <Brain className="w-4 h-4" />}
               {agent === 'D' && <Ticket className="w-4 h-4" />}
            </div>
            <div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest font-outfit">
                  Chat avec Agent {agent}
               </h3>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">En ligne</span>
               </div>
            </div>
         </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
         {messages.length === 0 && !loading && (
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-orange-500" />
               </div>
               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none text-xs text-white/80 leading-relaxed max-w-[80%]">
                  {agent === 'A' && "Bonjour Admin. Je suis prêt pour le scraping. Les flux sont stables."}
                  {agent === 'B' && "Prêt pour les calculs. En attente de vos paramètres de probabilités."}
                  {agent === 'C' && "News analysées. Souhaitez-vous un rapport psychologique sur un match ?"}
                  {agent === 'D' && "Coupon en attente. Régénérez ou publiez quand vous le souhaitez."}
               </div>
            </div>
         )}
         {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${m.role === 'user' ? 'bg-white text-black' : 'bg-white/5 border-white/10 text-orange-500'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
               </div>
               <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[80%] ${m.role === 'user' ? 'bg-white/10 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'}`}>
                  {m.content}
               </div>
            </div>
         ))}
         <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-orange-500/5 border-t border-orange-500/10">
         <div className="flex gap-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Donnez un ordre à l'Agent ${agent}...`}
              className="flex-grow bg-black/40 border border-white/10 rounded-xl px-6 py-3 text-xs text-white outline-none focus:border-orange-500 transition-all"
            />
            <button onClick={handleSend} className="p-3 bg-orange-500 text-white rounded-xl hover:scale-105 transition-all">
               <Send className="w-4 h-4" />
            </button>
         </div>
      </div>
    </motion.div>
  );
};

// --- PAGE PRINCIPALE ---

export default function AdminLogs() {
  const [activeTab, setActiveTab] = useState("all");

  const allLogs = [
    { time: "04:52:12", agent: "D", message: "Coupon 'Premium Big T1' généré avec une cote de 1.95", type: "success" },
    { time: "04:50:05", agent: "B", message: "Analyse Poisson terminée pour PSG vs Lyon : Victoire PSG (62%)", type: "success" },
    { time: "04:48:45", agent: "A", message: "Source 'Flashscore' indisponible. Basculement sur 'SofaScore'...", type: "warning" },
    { time: "04:45:20", agent: "C", message: "Alerte blessure détectée pour Kylian Mbappé. Recalcul des probabilités...", type: "warning" },
    { time: "04:42:12", agent: "D", message: "Coupon 'Free' publié sur le dashboard utilisateur", type: "success" },
    { time: "04:40:00", agent: "B", message: "Analyse Elo mise à jour pour 14 ligues majeures", type: "success" },
    { time: "04:35:10", agent: "A", message: "Récupération de 42 nouveaux matchs terminée", type: "success" },
    { time: "04:30:05", agent: "A", message: "Erreur de timeout sur le proxy #4. Rotation effectuée.", type: "error" },
    { time: "04:25:00", agent: "C", message: "Analyse des tweets 'Top Mercato' terminée", type: "success" },
  ];

  const filteredLogs = activeTab === "all" 
    ? allLogs 
    : allLogs.filter(log => log.agent === activeTab);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Activity className="w-4 h-4" />
              Monitoring en Temps Réel
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Logs & <span className="text-orange-500 italic">Performance IA</span>
           </h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/10">
           {["all", "A", "B", "C", "D"].map((t) => (
             <button 
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-orange-500 text-white' : 'text-muted hover:text-white'}`}
             >
                {t === 'all' ? 'Tous' : `Agent ${t}`}
             </button>
           ))}
        </div>
      </div>

      {/* Agents Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <AgentStatsCard 
            agent="A" name="Data Scraper" status="Active" color="bg-blue-500 text-white"
            metrics={[{label: "Matchs/Jour", value: "142"}, {label: "Succès", value: "99.2%"}]}
            isActive={activeTab === 'A'} onClick={() => setActiveTab('A')}
         />
         <AgentStatsCard 
            agent="B" name="Math Engine" status="Active" color="bg-purple-500 text-white"
            metrics={[{label: "MSE Accuracy", value: "0.042"}, {label: "Analyses", value: "1,204"}]}
            isActive={activeTab === 'B'} onClick={() => setActiveTab('B')}
         />
         <AgentStatsCard 
            agent="C" name="LLM Analyst" status="Active" color="bg-pink-500 text-white"
            metrics={[{label: "News Processed", value: "48"}, {label: "Sentiment", value: "92%"}]}
            isActive={activeTab === 'C'} onClick={() => setActiveTab('C')}
         />
         <AgentStatsCard 
            agent="D" name="Coupon Creator" status="Active" color="bg-orange-500 text-white"
            metrics={[{label: "Win Rate", value: "78.4%"}, {label: "Cote Avg", value: "2.40"}]}
            isActive={activeTab === 'D'} onClick={() => setActiveTab('D')}
         />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Detailed Logs Console */}
         <div className="lg:col-span-2 space-y-8">
            {/* Agent Chat Interface */}
            <AnimatePresence mode="wait">
               {activeTab !== 'all' && <AgentChat agent={activeTab} key={activeTab} />}
            </AnimatePresence>

            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">
                     Flux de Données {activeTab !== 'all' ? `(Agent ${activeTab})` : ''}
                  </h2>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-muted">
                        <Search className="w-3 h-3" /> Rechercher
                     </div>
                  </div>
               </div>
               <div className="glass-card border-white/5 bg-[#0A0C10] overflow-hidden">
                  <div className="max-h-[600px] overflow-y-auto custom-scrollbar min-h-[400px]">
                     {filteredLogs.length > 0 ? (
                       filteredLogs.map((log, i) => <LogEntry key={i} {...log} />)
                     ) : (
                       <div className="h-[400px] flex flex-col items-center justify-center text-muted gap-4">
                          <Zap className="w-8 h-8 opacity-20" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Aucun log pour cet agent</span>
                       </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar - Performance Stats */}
         <div className="space-y-8">
            <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
               <h3 className="text-xl font-black text-white font-outfit uppercase tracking-tighter mb-8 flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  Précision Hebdomadaire
               </h3>
               <div className="h-48 flex items-end gap-2 mb-6">
                  {[45, 65, 85, 70, 90, 85, 95].map((h, i) => (
                    <div key={i} className="flex-grow flex flex-col items-center gap-2 group">
                       <div className="text-[8px] font-black text-muted opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                       <div className="w-full bg-orange-500/20 rounded-t-lg group-hover:bg-orange-500/40 transition-colors" style={{ height: `${h}%` }} />
                       <div className="text-[8px] font-black text-muted uppercase tracking-widest mt-2">J-{7-i}</div>
                    </div>
                  ))}
               </div>
               <div className="pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-black text-muted uppercase tracking-widest">Tendance Globale</span>
                     <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">+12.4%</span>
                  </div>
               </div>
            </div>

            <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
               <h3 className="text-xl font-black text-white font-outfit uppercase tracking-tighter mb-8 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Santé Serveur
               </h3>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                        <span className="text-muted">Charge CPU</span>
                        <span className="text-white">24%</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-[24%] h-full bg-emerald-500" />
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                        <span className="text-muted">Mémoire RAM</span>
                        <span className="text-white">3.2 GB / 8 GB</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-[40%] h-full bg-blue-500" />
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                        <span className="text-muted">Uptime Système</span>
                        <span className="text-white">14j 02h 45m</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
