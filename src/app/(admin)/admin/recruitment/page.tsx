"use client"

import { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  Send, 
  User, 
  ShieldCheck,
  Zap,
  MessageSquare,
  Clock,
  CheckCircle2,
  X,
  ExternalLink,
  Hash,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function AdminRecruitment() {
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [adminUser, setAdminUser] = useState<any>(null);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalLink, setFinalLink] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAdminUser(user);
      fetchOffers();
    };
    init();
  }, []);

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from('recruitment_offers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setOffers(data);
  };

  useEffect(() => {
    if (selectedOffer) {
      fetchMessages(selectedOffer.id);

      const channel = supabase
        .channel(`admin_interview:${selectedOffer.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'recruitment_messages',
          filter: `offer_id=eq.${selectedOffer.id}` 
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedOffer]);

  const fetchMessages = async (offerId: string) => {
    const { data, error } = await supabase
      .from('recruitment_messages')
      .select('*')
      .eq('offer_id', offerId)
      .order('created_at', { ascending: true });
    
    if (!error) setMessages(data);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedOffer || !adminUser) return;

    const { error } = await supabase.from('recruitment_messages').insert({
      offer_id: selectedOffer.id,
      sender_id: adminUser.id,
      content: input
    });

    if (!error) setInput("");
  };

  const handleFinalize = async () => {
    if (!selectedOffer || !finalLink) return;

    const { error } = await supabase
      .from('recruitment_offers')
      .update({ 
        status: 'validated',
        final_link: finalLink
      })
      .eq('id', selectedOffer.id);
    
    if (!error) {
      alert("Recrutement finalisé avec succès !");
      setShowFinalizeModal(false);
      setOffers(offers.map(o => o.id === selectedOffer.id ? { ...o, status: 'validated' } : o));
      setSelectedOffer({ ...selectedOffer, status: 'validated' });
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredOffers = offers.filter(o => 
    o.role_offered.toLowerCase().includes(search.toLowerCase()) || 
    o.candidate_id.includes(search)
  );

  return (
    <div className="space-y-10 h-[calc(100vh-160px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 shrink-0">
        <div>
           <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Briefcase className="w-4 h-4" />
              Management VictorIA
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Console <span className="text-orange-500 italic">Recrutement</span>
           </h1>
        </div>
      </div>

      <div className="flex-grow flex gap-8 overflow-hidden">
        {/* Candidates List */}
        <div className="w-1/3 flex flex-col gap-6 overflow-hidden">
           <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
              <Search className="w-5 h-5 text-muted" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par rôle ou ID..." 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-muted/40" 
              />
           </div>

           <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {filteredOffers.map((offer) => (
                 <button 
                   key={offer.id}
                   onClick={() => setSelectedOffer(offer)}
                   className={`w-full text-left glass-card p-6 border-white/5 transition-all group relative overflow-hidden ${selectedOffer?.id === offer.id ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/[0.01] hover:bg-white/[0.03]'}`}
                 >
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-2 text-[9px] font-black text-orange-500 tracking-widest uppercase">
                          <Hash className="w-3 h-3" /> {offer.id.slice(0, 8)}
                       </div>
                       <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${offer.status === 'validated' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                          {offer.status}
                       </div>
                    </div>
                    <div className="text-white font-bold text-sm mb-2">{offer.role_offered}</div>
                    <div className="text-[9px] text-muted font-bold uppercase tracking-widest">Candidat: {offer.candidate_id.slice(-6)}</div>
                 </button>
              ))}
           </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-grow flex flex-col glass-card border-white/5 bg-[#0A0C10] overflow-hidden">
           {selectedOffer ? (
              <>
                 <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xl font-outfit uppercase">
                          C
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-white font-outfit uppercase tracking-tight mb-1">Candidat #{selectedOffer.candidate_id.slice(-4)}</h3>
                          <div className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-2">
                             <span className="text-orange-500 italic">{selectedOffer.role_offered}</span>
                             <span>•</span>
                             <span>Entretien en cours</span>
                          </div>
                       </div>
                    </div>
                    {selectedOffer.status === 'accepted' && (
                      <button 
                        onClick={() => setShowFinalizeModal(true)}
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2"
                      >
                         <CheckCircle2 className="w-4 h-4" /> Finaliser le recrutement
                      </button>
                    )}
                 </div>

                 <div className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar bg-black/20">
                    {messages.map((m, i) => (
                       <div key={i} className={`flex gap-6 ${m.sender_id === adminUser?.id ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${m.sender_id === adminUser?.id ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/10 text-muted'}`}>
                             {m.sender_id === adminUser?.id ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                          </div>
                          <div className="space-y-2 max-w-[70%]">
                             <div className={`p-6 rounded-[2rem] text-sm leading-relaxed ${m.sender_id === adminUser?.id ? 'bg-orange-500/10 text-white border border-orange-500/20 rounded-tr-none' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'}`}>
                                {m.content}
                             </div>
                             <div className={`text-[9px] font-bold text-muted/40 uppercase tracking-widest ${m.sender_id === adminUser?.id ? 'text-right' : 'text-left'}`}>
                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                          </div>
                       </div>
                    ))}
                    <div ref={scrollRef} />
                 </div>

                 <div className="p-8 bg-white/[0.02] border-t border-white/5">
                    <div className="flex gap-6">
                       <input 
                         type="text" 
                         value={input}
                         onChange={(e) => setInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                         placeholder="Échangez avec le candidat..."
                         className="flex-grow bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white outline-none focus:border-orange-500 transition-all"
                       />
                       <button onClick={handleSendMessage} className="p-5 bg-orange-500 text-white rounded-2xl hover:scale-105 transition-all">
                          <Send className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </>
           ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-muted gap-6">
                 <Briefcase className="w-16 h-16 opacity-5" />
                 <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Sélectionnez un candidat pour l'entretien</div>
              </div>
           )}
        </div>
      </div>

      {/* Finalize Modal */}
      <AnimatePresence>
        {showFinalizeModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md glass-card p-10 space-y-8 border-orange-500/30">
              <div className="text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tight">Recrutement Final</h3>
                <p className="text-xs text-muted mt-2">Envoyez le lien final avec les accès et permissions.</p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Lien de configuration finale</label>
                <input 
                  type="text" 
                  value={finalLink}
                  onChange={(e) => setFinalLink(e.target.value)}
                  placeholder="https://victoria-bet.com/setup/..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs text-white outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowFinalizeModal(false)} className="flex-grow py-5 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px]">Annuler</button>
                <button onClick={handleFinalize} className="flex-grow py-5 rounded-2xl bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-500/40">Valider & Envoyer</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
