"use client"

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  Target, 
  History,
  Trash2,
  Terminal,
  Cpu,
  BarChart3,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "@/lib/supabase";

const Message = ({ role, content, status, created_at }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-6 mb-8 ${role === 'user' ? 'flex-row-reverse' : ''}`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 shadow-2xl ${
      role === 'user' 
        ? 'bg-white border-white/20 text-black shadow-white/5' 
        : 'bg-gradient-to-br from-orange-500 to-orange-800 border-orange-400/30 text-white shadow-orange-500/20'
    }`}>
      {role === 'user' ? <User className="w-6 h-6" /> : (
        <div className="relative">
           <Bot className="w-6 h-6" />
           <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#0A0C10] animate-pulse" />
        </div>
      )}
    </div>
    
    <div className={`max-w-[80%] space-y-3 ${role === 'user' ? 'text-right' : ''}`}>
       <div className="flex items-center gap-3 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">
             {role === 'user' ? 'Vous' : 'VictorIA — Agent E'}
          </span>
          <span className="text-[8px] text-muted/40 font-bold uppercase tracking-widest">
             {created_at ? new Date(created_at).toLocaleTimeString() : ''}
          </span>
          {status === 'analyzing' && (
             <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 text-[8px] font-black uppercase">
                <Loader2 className="w-2 h-2 animate-spin" /> Analyse en cours
             </div>
          )}
       </div>
       <div className={`p-6 rounded-3xl text-sm leading-relaxed font-medium ${
         role === 'user' 
           ? 'bg-white/5 border border-white/10 text-white rounded-tr-none' 
           : 'bg-orange-500/5 border border-orange-500/10 text-white/90 rounded-tl-none'
       }`}>
          {content}
       </div>
    </div>
  </motion.div>
);

export default function AdminChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch initial history
  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('admin_chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (data) setMessages(data);
      setLoading(false);
    };

    fetchHistory();

    // 2. Realtime Subscription
    const channel = supabase
      .channel('admin_chat')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'admin_chat_messages' 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      role: 'user',
      content: input,
      created_at: new Date().toISOString()
    };

    // Optimistic update
    setInput("");

    // 3. Save to Supabase
    const { error } = await supabase
      .from('admin_chat_messages')
      .insert([userMessage]);

    if (error) {
      console.error("Error saving message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-5xl mx-auto">
      {/* Header Chat */}
      <div className="flex items-center justify-between mb-10 shrink-0">
         <div>
            <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
               <Cpu className="w-4 h-4" />
               Système de Commande IA
            </div>
            <div className="flex items-center gap-4">
               <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter">Assistant <span className="text-orange-500 italic">Agent E</span></h1>
               <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isConnected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'} transition-all duration-500`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{isConnected ? 'En ligne' : 'Déconnecté'}</span>
               </div>
            </div>
         </div>
         <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted hover:text-red-500 transition-all">
            <Trash2 className="w-5 h-5" />
         </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto pr-6 space-y-4 custom-scrollbar">
         {messages.length === 0 && !loading && (
            <Message 
               role="assistant" 
               content="Bonjour Admin. Je suis l'Agent E, votre assistant VictorIA. Je suis prêt à exécuter vos commandes (génération de coupons, analyses de matchs, rapports). Que souhaitez-vous faire ?" 
            />
         )}
         {messages.map((m, i) => <Message key={i} {...m} />)}
         <div ref={chatEndRef} />
      </div>

      {/* Quick Commands */}
      <div className="py-6 flex gap-3 overflow-x-auto no-scrollbar shrink-0">
         {[
           { icon: Zap, label: "Génère une côte de 2", cmd: "Génère un coupon de côte 2 pour ce soir" },
           { icon: Target, label: "Analyse match spécifique", cmd: "Analyse le match du PSG ce soir" },
           { icon: BarChart3, label: "Rapport de performance", cmd: "Donne-moi le taux de réussite de la semaine" },
           { icon: Terminal, label: "Statut des Agents", cmd: "Quel est l'état des agents de scraping ?" }
         ].map((btn, i) => (
           <button 
             key={i} 
             onClick={() => setInput(btn.cmd)}
             className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:border-orange-500/40 hover:bg-orange-500/5 transition-all flex items-center gap-3 whitespace-nowrap"
           >
              <btn.icon className="w-4 h-4 text-orange-500" />
              {btn.label}
           </button>
         ))}
      </div>

      {/* Input Area */}
      <div className="pt-4 shrink-0">
         <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-800 rounded-[2rem] blur opacity-10 group-focus-within:opacity-30 transition-opacity" />
            <div className="relative flex items-center gap-4 bg-[#0A0C10] border border-white/10 rounded-[2rem] p-3 pl-8">
               <Sparkles className="w-5 h-5 text-orange-500" />
               <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Commandez VictorIA (ex: Génère un coupon côte 5...)"
                 className="bg-transparent border-none outline-none text-sm text-white placeholder:text-muted/40 w-full font-medium"
               />
               <button 
                 onClick={handleSend}
                 className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white hover:scale-110 transition-all shadow-lg shadow-orange-500/20"
               >
                  <Send className="w-5 h-5" />
               </button>
            </div>
         </div>
         <p className="text-center text-[9px] text-muted font-bold uppercase tracking-widest mt-4">
            VictorIA peut faire des erreurs. Vérifiez toujours les analyses avant publication.
         </p>
      </div>
    </div>
  );
}
