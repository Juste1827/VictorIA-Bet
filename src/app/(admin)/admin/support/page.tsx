"use client"

import { useState, useEffect, useRef } from "react";
import { 
  Headset, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical,
  Send,
  User,
  ShieldCheck,
  Hash,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

// --- COMPOSANTS INTERNES ---

const TicketBadge = ({ status }: { status: string }) => {
  const styles: any = {
    "Ouvert": "bg-red-500/10 text-red-500 border-red-500/20",
    "En cours": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Résolu": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "En attente": "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${styles[status] || 'bg-white/5 text-muted'}`}>
      {status}
    </span>
  );
};

export default function AdminSupport() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [adminUser, setAdminUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialisation : Récupérer l'admin et tous les tickets
  useEffect(() => {
    const initAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAdminUser(user);
      fetchTickets();
    };
    initAdmin();

    // S'abonner aux nouveaux tickets en temps réel
    const ticketChannel = supabase
      .channel('public:support_tickets')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_tickets' }, (payload) => {
        setTickets(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ticketChannel);
    };
  }, []);

  const fetchTickets = async () => {
    let query = supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    
    if (search) {
      query = query.or(`tracking_number.ilike.%${search}%,subject.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (!error) setTickets(data);
  };

  // Re-fetch quand la recherche change
  useEffect(() => {
    const timer = setTimeout(fetchTickets, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Charger les messages du ticket sélectionné et s'abonner au temps réel
  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);

      const msgChannel = supabase
        .channel(`admin_messages:${selectedTicket.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'support_messages',
          filter: `ticket_id=eq.${selectedTicket.id}` 
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(msgChannel);
      };
    }
  }, [selectedTicket]);

  const fetchMessages = async (ticketId: string) => {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    
    if (!error) setMessages(data);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedTicket || !adminUser) return;

    const { error } = await supabase.from('support_messages').insert({
      ticket_id: selectedTicket.id,
      sender_id: adminUser.id,
      content: input,
      role: 'admin'
    });

    if (!error) {
      setInput("");
      // Mettre à jour le statut du ticket si nécessaire
      if (selectedTicket.status === 'Ouvert') {
        await supabase
          .from('support_tickets')
          .update({ status: 'En cours' })
          .eq('id', selectedTicket.id);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-10 h-[calc(100vh-160px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 shrink-0">
        <div>
           <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Headset className="w-4 h-4" />
              Support & Assistance
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Console <span className="text-orange-500 italic">Service Client</span>
           </h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/10">
           <div className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Support Actif
           </div>
        </div>
      </div>

      <div className="flex-grow flex gap-8 overflow-hidden">
        {/* Ticket List */}
        <div className="w-1/3 flex flex-col gap-6 overflow-hidden">
           <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
              <Search className="w-5 h-5 text-muted" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Numéro de suivi, sujet..." 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-muted/40" 
              />
           </div>

           <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {tickets.map((ticket) => (
                 <button 
                   key={ticket.id}
                   onClick={() => setSelectedTicket(ticket)}
                   className={`w-full text-left glass-card p-6 border-white/5 transition-all group relative overflow-hidden ${selectedTicket?.id === ticket.id ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/[0.01] hover:bg-white/[0.03]'}`}
                 >
                    {selectedTicket?.id === ticket.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />}
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-2 text-[9px] font-black text-orange-500 tracking-widest uppercase">
                          <Hash className="w-3 h-3" /> {ticket.tracking_number}
                       </div>
                       <TicketBadge status={ticket.status} />
                    </div>
                    <div className="text-white font-bold text-sm mb-2 group-hover:text-orange-500 transition-colors">{ticket.subject}</div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                       <div className="flex items-center gap-2 text-[10px] text-muted font-bold">
                          <User className="w-3 h-3" /> Parieur #{ticket.user_id.slice(-4)}
                       </div>
                       <div className="text-[9px] text-muted/40 font-bold uppercase">{new Date(ticket.created_at).toLocaleDateString()}</div>
                    </div>
                 </button>
              ))}
           </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-grow flex flex-col glass-card border-white/5 bg-[#0A0C10] overflow-hidden">
           {selectedTicket ? (
              <>
                 <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xl font-outfit uppercase">
                           P
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-black text-white font-outfit uppercase tracking-tight">Parieur #{selectedTicket.user_id.slice(-4)}</h3>
                              <TicketBadge status={selectedTicket.status} />
                           </div>
                           <div className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-2">
                              <span className="text-orange-500 italic">{selectedTicket.tracking_number}</span>
                              <span>•</span>
                              <span>{selectedTicket.subject}</span>
                           </div>
                        </div>
                     </div>
                    <div className="flex items-center gap-4">
                       <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-white transition-all">
                          <CheckCircle2 className="w-5 h-5" />
                       </button>
                       <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-white transition-all">
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                 </div>

                 <div className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar bg-black/20">
                    <div className="flex flex-col items-center mb-10">
                       <div className="px-4 py-2 bg-white/5 rounded-full text-[9px] text-muted font-black uppercase tracking-[0.2em] mb-4">Début de la discussion - {selectedTicket.date}</div>
                       <div className="w-px h-10 bg-gradient-to-b from-white/5 to-transparent" />
                    </div>

                    {messages.map((m, i) => (
                       <div key={i} className={`flex gap-6 ${m.role === 'admin' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${m.role === 'admin' ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/10 text-muted'}`}>
                             {m.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                          </div>
                          <div className="space-y-2 max-w-[70%]">
                             <div className={`p-6 rounded-[2rem] text-sm leading-relaxed ${m.role === 'admin' ? 'bg-orange-500/10 text-white border border-orange-500/20 rounded-tr-none' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'}`}>
                                {m.content}
                             </div>
                             <div className={`text-[9px] font-bold text-muted/40 uppercase tracking-widest ${m.role === 'admin' ? 'text-right' : 'text-left'}`}>
                                {m.time}
                             </div>
                          </div>
                       </div>
                    ))}
                    <div ref={scrollRef} />
                 </div>

                 <div className="p-8 bg-white/[0.02] border-t border-white/5">
                    <div className="flex gap-6">
                       <div className="flex-grow relative">
                          <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Écrivez votre réponse à l'utilisateur..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white outline-none focus:border-orange-500 transition-all placeholder:text-muted/20"
                          />
                       </div>
                       <button onClick={handleSendMessage} className="px-8 bg-orange-500 text-white rounded-2xl hover:scale-105 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3">
                          <span className="text-xs font-black uppercase tracking-widest">Répondre</span>
                          <Send className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </>
           ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-muted gap-6">
                 <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5">
                    <Headset className="w-16 h-16 opacity-10" />
                 </div>
                 <div className="text-center">
                    <h3 className="text-xl font-black text-white/40 font-outfit uppercase tracking-tighter mb-2">Aucun ticket sélectionné</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Choisissez une discussion dans la liste de gauche pour commencer</p>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
