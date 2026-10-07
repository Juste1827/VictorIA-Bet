"use client"

import { useState, useEffect, useRef } from "react";
import { 
  Headset, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Hash,
  ShieldCheck,
  User,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function UserSupport() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialisation : Récupérer l'utilisateur et ses tickets
  useEffect(() => {
    const initSupport = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchTickets(user.id);
      }
    };
    initSupport();
  }, []);

  const fetchTickets = async (userId: string) => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!error) {
      setMyTickets(data);
      setLoading(false);
    }
  };

  // Charger les messages du ticket actif et s'abonner au temps réel
  useEffect(() => {
    if (activeTicket) {
      fetchMessages(activeTicket.id);

      const channel = supabase
        .channel(`messages:${activeTicket.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'support_messages',
          filter: `ticket_id=eq.${activeTicket.id}` 
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeTicket]);

  const fetchMessages = async (ticketId: string) => {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    
    if (!error) setMessages(data);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeTicket || !user) return;

    const messageObj = {
      ticket_id: activeTicket.id,
      sender_id: user.id,
      content: input,
      role: 'user'
    };

    const { error } = await supabase.from('support_messages').insert(messageObj);
    if (!error) {
      setInput("");
    }
  };

  const handleCreateTicket = async (e: any) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.target);
    const subject = formData.get('subject') as string;
    const tracking = `VIC-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject,
        tracking_number: tracking,
        status: 'En cours'
      })
      .select()
      .single();

    if (!error) {
      setMyTickets([data, ...myTickets]);
      setShowNewTicket(false);
      setActiveTicket(data);
      alert(`Ticket créé avec succès ! Numéro : ${tracking}`);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Headset className="w-4 h-4" />
              Centre d'Assistance
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Aide & <span className="text-primary italic">Support</span>
           </h1>
        </div>
        <button 
          onClick={() => setShowNewTicket(true)}
          className="px-8 py-4 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
        >
           <Plus className="w-5 h-5" />
           Ouvrir un nouveau ticket
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 h-[600px]">
         {/* My Tickets List */}
         <div className="lg:col-span-1 space-y-6 flex flex-col overflow-hidden">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
               <Clock className="w-4 h-4 text-muted" /> Mes Demandes
            </h2>
            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 pr-2">
               {myTickets.map((ticket) => (
                  <button 
                    key={ticket.id}
                    onClick={() => setActiveTicket(ticket)}
                    className={`w-full text-left glass-card p-6 border-white/5 transition-all relative overflow-hidden ${activeTicket?.id === ticket.id ? 'bg-primary/10 border-primary/30' : 'bg-white/[0.01] hover:bg-white/[0.03]'}`}
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className="text-[9px] font-black text-primary tracking-widest uppercase flex items-center gap-2">
                           <Hash className="w-3 h-3" /> {ticket.tracking_number}
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${ticket.status === 'Résolu' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                           {ticket.status}
                        </div>
                     </div>
                     <div className="text-white font-bold text-sm mb-2">{ticket.subject}</div>
                     <div className="text-[9px] text-muted font-bold uppercase tracking-widest">{new Date(ticket.created_at).toLocaleDateString()}</div>
                  </button>
               ))}
            </div>
         </div>

         {/* Chat Interface */}
         <div className="lg:col-span-2 glass-card border-white/5 bg-white/[0.01] flex flex-col overflow-hidden relative">
            {activeTicket ? (
               <>
                  <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                           <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="text-xs font-black text-white uppercase tracking-widest mb-0.5">{activeTicket.subject}</div>
                           <div className="text-[9px] text-primary font-black uppercase tracking-widest italic">{activeTicket.tracking_number}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Support en ligne</span>
                     </div>
                  </div>

                  <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/20">
                     {messages.map((m, i) => (
                        <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                           <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${m.role === 'admin' ? 'bg-primary border-primary/50 text-black shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-muted'}`}>
                              {m.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                           </div>
                           <div className="space-y-1.5 max-w-[80%]">
                              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'admin' ? 'bg-primary/5 text-white border border-primary/20 rounded-tl-none' : 'bg-white/5 border border-white/10 text-white/80 rounded-tr-none'}`}>
                                 {m.content}
                              </div>
                              <div className={`text-[8px] font-bold text-muted/30 uppercase tracking-widest ${m.role === 'admin' ? 'text-left' : 'text-right'}`}>
                                 {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                           </div>
                        </div>
                     ))}
                     <div ref={scrollRef} />
                  </div>

                  <div className="p-6 bg-white/[0.02] border-t border-white/5">
                     <div className="flex gap-4">
                        <input 
                          type="text" 
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Décrivez votre problème ou répondez au support..."
                          className="flex-grow bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-xs text-white outline-none focus:border-primary transition-all"
                        />
                        <button onClick={handleSend} className="p-4 bg-primary text-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
                           <Send className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               </>
            ) : (
               <div className="flex-grow flex flex-col items-center justify-center text-muted gap-4">
                  <Headset className="w-12 h-12 opacity-5" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 text-center">
                     Sélectionnez un ticket pour discuter avec l'équipe
                  </div>
               </div>
            )}

            {/* New Ticket Modal */}
            <AnimatePresence>
               {showNewTicket && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md p-10 flex items-center justify-center"
                  >
                     <div className="w-full max-w-md space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="text-center space-y-4">
                           <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center text-primary mx-auto">
                              <Plus className="w-8 h-8" />
                           </div>
                           <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tight">Ouvrir un ticket</h3>
                           <p className="text-xs text-muted">Expliquez-nous votre problème en quelques mots.</p>
                        </div>

                        <form onSubmit={handleCreateTicket} className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Sujet du problème</label>
                              <input required name="subject" type="text" placeholder="Ex: Erreur de dépôt Orange Money" className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 outline-none focus:border-primary transition-all text-white font-bold" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Description détaillée</label>
                              <textarea required rows={4} placeholder="Dites-nous en plus..." className="w-full bg-white/5 border border-white/10 rounded-xl p-6 outline-none focus:border-primary transition-all text-white font-bold resize-none" />
                           </div>
                           <div className="flex gap-4 pt-4">
                              <button type="button" onClick={() => setShowNewTicket(false)} className="flex-grow py-5 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Annuler</button>
                              <button type="submit" className="flex-grow py-5 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all">Envoyer la plainte</button>
                           </div>
                        </form>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
