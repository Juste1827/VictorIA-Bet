"use client"

import { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Send, 
  User, 
  ShieldCheck,
  Zap,
  Star,
  MessageSquare,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function UserRecruitment() {
  const [offers, setOffers] = useState<any[]>([]);
  const [activeOffer, setActiveOffer] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchOffers(user.id);
      }
    };
    init();
  }, []);

  const fetchOffers = async (userId: string) => {
    const { data, error } = await supabase
      .from('recruitment_offers')
      .select('*')
      .eq('candidate_id', userId)
      .order('created_at', { ascending: false });
    
    if (!error) {
      setOffers(data);
      setLoading(false);
      // Auto-select the first pending or accepted offer
      if (data.length > 0) setActiveOffer(data[0]);
    }
  };

  useEffect(() => {
    if (activeOffer && activeOffer.status === 'accepted') {
      fetchMessages(activeOffer.id);

      const channel = supabase
        .channel(`interview:${activeOffer.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'recruitment_messages',
          filter: `offer_id=eq.${activeOffer.id}` 
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeOffer]);

  const fetchMessages = async (offerId: string) => {
    const { data, error } = await supabase
      .from('recruitment_messages')
      .select('*')
      .eq('offer_id', offerId)
      .order('created_at', { ascending: true });
    
    if (!error) setMessages(data);
  };

  const handleUpdateStatus = async (offerId: string, status: string) => {
    const { error } = await supabase
      .from('recruitment_offers')
      .update({ status })
      .eq('id', offerId);
    
    if (!error) {
      setOffers(offers.map(o => o.id === offerId ? { ...o, status } : o));
      setActiveOffer({ ...activeOffer, status });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !activeOffer || !user) return;

    const { error } = await supabase.from('recruitment_messages').insert({
      offer_id: activeOffer.id,
      sender_id: user.id,
      content: input
    });

    if (!error) setInput("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-amber-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Star className="w-4 h-4 fill-amber-500" />
              Opportunités de Carrière
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Rejoindre <span className="text-amber-500 italic">l'Équipe</span>
           </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 h-[650px]">
        {/* Offers Sidebar */}
        <div className="lg:col-span-1 space-y-6 flex flex-col overflow-hidden">
           <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-muted" /> Mes Invitations
           </h2>
           <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {offers.length === 0 && !loading ? (
                <div className="glass-card p-8 text-center opacity-40">
                  <div className="text-[10px] font-black uppercase tracking-widest">Aucune offre pour le moment</div>
                </div>
              ) : (
                offers.map((offer) => (
                  <button 
                    key={offer.id}
                    onClick={() => setActiveOffer(offer)}
                    className={`w-full text-left glass-card p-6 border-white/5 transition-all relative overflow-hidden ${activeOffer?.id === offer.id ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/[0.01] hover:bg-white/[0.03]'}`}
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className="text-[9px] font-black text-amber-500 tracking-widest uppercase flex items-center gap-2">
                           <Zap className="w-3 h-3 fill-amber-500" /> Offre Spéciale
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${offer.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                           {offer.status === 'pending' ? 'En attente' : offer.status === 'accepted' ? 'Entretien' : 'Refusé'}
                        </div>
                     </div>
                     <div className="text-white font-bold text-sm mb-2">{offer.role_offered}</div>
                     <div className="text-[9px] text-muted font-bold uppercase tracking-widest">{new Date(offer.created_at).toLocaleDateString()}</div>
                  </button>
                ))
              )}
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 glass-card border-white/5 bg-white/[0.01] flex flex-col overflow-hidden relative">
          {activeOffer ? (
            activeOffer.status === 'pending' ? (
              <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-[3rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-8 animate-pulse">
                  <Star className="w-12 h-12 fill-amber-500" />
                </div>
                <h3 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter mb-4">Invitation Reçue !</h3>
                <p className="text-muted text-sm max-w-md mb-10 leading-relaxed">
                  L'administration de VictorIA BET vous propose de devenir <span className="text-amber-500 font-bold">{activeOffer.role_offered}</span>. 
                  Souhaitez-vous accepter un entretien pour discuter de vos futures responsabilités ?
                </p>
                <div className="flex gap-6 w-full max-w-sm">
                  <button 
                    onClick={() => handleUpdateStatus(activeOffer.id, 'rejected')}
                    className="flex-grow py-5 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                    Décliner
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(activeOffer.id, 'accepted')}
                    className="flex-grow py-5 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
                  >
                    Accepter l'entretien
                  </button>
                </div>
              </div>
            ) : activeOffer.status === 'accepted' ? (
              <>
                <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                         <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                         <div className="text-xs font-black text-white uppercase tracking-widest mb-0.5">Entretien : {activeOffer.role_offered}</div>
                         <div className="text-[9px] text-amber-500 font-black uppercase tracking-widest italic">Conversation Privée avec l'Admin</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Admin Connecté</span>
                   </div>
                </div>

                <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/20">
                   {messages.map((m, i) => (
                      <div key={i} className={`flex gap-4 ${m.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                         <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${m.sender_id !== user?.id ? 'bg-amber-500 border-amber-500/50 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/10 text-muted'}`}>
                            {m.sender_id !== user?.id ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                         </div>
                         <div className="space-y-1.5 max-w-[80%]">
                            <div className={`p-4 rounded-2xl text-xs leading-relaxed ${m.sender_id !== user?.id ? 'bg-amber-500/5 text-white border border-amber-500/20 rounded-tl-none' : 'bg-white/5 border border-white/10 text-white/80 rounded-tr-none'}`}>
                               {m.content}
                            </div>
                            <div className={`text-[8px] font-bold text-muted/30 uppercase tracking-widest ${m.sender_id === user?.id ? 'text-right' : 'text-left'}`}>
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Répondez à l'administration..."
                        className="flex-grow bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-xs text-white outline-none focus:border-amber-500 transition-all"
                      />
                      <button onClick={handleSendMessage} className="p-4 bg-amber-500 text-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/20">
                         <Send className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-muted gap-4 opacity-30">
                <XCircle className="w-12 h-12" />
                <div className="text-[10px] font-black uppercase tracking-widest">Cette offre a été déclinée</div>
              </div>
            )
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-muted gap-4">
               <Briefcase className="w-12 h-12 opacity-5" />
               <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 text-center">
                  Consultez vos invitations professionnelles à gauche
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
