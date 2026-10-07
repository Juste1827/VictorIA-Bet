"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Plus, 
  History, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Smartphone,
  AlertTriangle
} from "lucide-react";

const TransactionItem = ({ type, amount, date, status, method }: any) => (
  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group">
    <div className="flex items-center gap-6">
       <div className={`p-3 rounded-xl ${type === 'DÉPÔT' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'}`}>
          {type === 'DÉPÔT' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
       </div>
       <div>
          <div className="text-white font-black font-outfit uppercase tracking-tight">{type} {method}</div>
          <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">{date}</div>
       </div>
    </div>
    <div className="text-right">
       <div className={`text-xl font-black font-outfit ${type === 'DÉPÔT' ? 'text-emerald-400' : 'text-white'}`}>
          {type === 'DÉPÔT' ? '+' : '-'}{amount} FCFA
       </div>
       <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${status === 'COMPLÉTÉ' ? 'text-primary' : 'text-orange-400'}`}>
          {status}
       </div>
    </div>
  </div>
);

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("RECHARGER");
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <ShieldCheck className="w-4 h-4" />
              Transactions sécurisées
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Mon <span className="premium-gradient-text italic">Portefeuille</span>
           </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Balance Card */}
        <div className="lg:col-span-1 space-y-8">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="glass-card p-10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-primary/30 relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Wallet className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10">
                 <div className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6">Solde Disponible</div>
                 <div className="text-6xl font-black text-white font-outfit tracking-tighter mb-8">12 450 <span className="text-2xl text-muted">FCFA</span></div>
                 
                 <div className="flex gap-4">
                    <button onClick={() => setActiveTab("RECHARGER")} className="flex-grow py-4 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl">Recharger</button>
                    <button onClick={() => setActiveTab("RETIRER")} className="flex-grow py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Retirer</button>
                 </div>
              </div>
           </motion.div>

           <div className="glass-card p-8 border-white/5 space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-outfit">Infos Paiement</h3>
              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest">Orange Money • 07 48 XX XX</div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest">MTN Money • 05 01 XX XX</div>
                 </div>
              </div>
              <button className="text-[9px] text-primary font-black uppercase tracking-widest flex items-center gap-2">
                 Modifier les modes de paiement <ChevronRight className="w-3 h-3" />
              </button>
           </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-2 space-y-12">
           <div className="glass-card p-10 min-h-[400px]">
              <div className="flex gap-10 border-b border-white/5 mb-10">
                 {["RECHARGER", "RETIRER"].map(tab => (
                   <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab)}
                     className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-muted'}`}
                   >
                      {tab}
                      {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />}
                   </button>
                 ))}
              </div>

              {activeTab === "RECHARGER" ? (
                <div className="space-y-10">
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[500, 1000, 2500, 5000].map(amt => (
                        <button 
                          key={amt} 
                          onClick={() => setAmount(amt.toString())}
                          className={`p-6 rounded-2xl transition-all text-center border ${amount === amt.toString() ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white hover:border-primary/50'}`}
                        >
                           <div className={`text-xl font-black font-outfit ${amount === amt.toString() ? 'text-black' : 'text-white'}`}>{amt}</div>
                           <div className={`text-[9px] font-bold uppercase mt-1 ${amount === amt.toString() ? 'text-black/60' : 'text-muted'}`}>FCFA</div>
                        </button>
                      ))}
                   </div>
                   
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2">Montant Personnalisé</label>
                      <div className="relative">
                         <input 
                           type="number" 
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                           placeholder="Entrez le montant..." 
                           className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 outline-none focus:border-primary transition-all text-white font-black" 
                         />
                         <span className="absolute right-8 top-1/2 -translate-y-1/2 text-muted font-bold">FCFA</span>
                      </div>
                   </div>

                   <button className="w-full py-6 rounded-2xl bg-primary text-black text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                      Confirmer la recharge <Plus className="w-5 h-5" />
                   </button>
                </div>
              ) : (
                <div className="space-y-10">
                   <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4">
                      <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                      <div>
                         <div className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Règle de retrait</div>
                         <p className="text-[11px] text-red-500/60 leading-relaxed font-medium">Le retrait minimum est de 500 FCFA. Les fonds sont envoyés sur le numéro Mobile Money enregistré.</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2">Montant à retirer</label>
                      <div className="relative">
                         <input 
                           type="number" 
                           value={withdrawAmount}
                           onChange={(e) => setWithdrawAmount(e.target.value)}
                           placeholder="Ex: 5000" 
                           className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 outline-none focus:border-primary transition-all text-white font-black" 
                         />
                         <span className="absolute right-8 top-1/2 -translate-y-1/2 text-muted font-bold">FCFA</span>
                      </div>
                   </div>

                   <button className="w-full py-6 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-4">
                      Demander le retrait <ArrowDownCircle className="w-5 h-5" />
                   </button>
                </div>
              )}
           </div>

           {/* Transaction History */}
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Historique Financier</h2>
                 <History className="w-5 h-5 text-muted" />
              </div>
              <div className="space-y-4">
                 <TransactionItem type="DÉPÔT" method="Orange Money" amount="5 000" date="25 Avr 2026 • 14:30" status="COMPLÉTÉ" />
                 <TransactionItem type="RETRAIT" method="MTN Money" amount="2 500" date="22 Avr 2026 • 10:15" status="COMPLÉTÉ" />
                 <TransactionItem type="DÉPÔT" method="Wave" amount="1 000" date="20 Avr 2026 • 19:45" status="COMPLÉTÉ" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
