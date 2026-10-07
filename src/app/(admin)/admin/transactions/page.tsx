"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Receipt,
  PieChart as PieChartIcon,
  Plus,
  X,
  BarChart2
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, Legend } from 'recharts';

// --- Types & Données Mockées ---
type TransactionStatus = 'COMPLÉTÉ' | 'EN ATTENTE' | 'REJETÉ';
type TransactionType = 'DÉPÔT' | 'ACHAT STANDARD' | 'ACHAT ÉLITE' | 'RETRAIT';

interface Transaction {
  id: string;
  user: string;
  type: TransactionType;
  amount: number;
  method: string;
  phone: string;
  date: string;
  status: TransactionStatus;
}

const initialTransactions: Transaction[] = [
  { id: "TX-9285", user: "Marc Dubois", type: "ACHAT ÉLITE", amount: 150, method: "SOLDE", phone: "-", date: "Aujourd'hui • 10:15", status: "COMPLÉTÉ" },
  { id: "TX-9284", user: "Jean Parieur", type: "RETRAIT", amount: 5000, method: "ORANGE", phone: "07 48 XX XX", date: "Aujourd'hui • 09:30", status: "EN ATTENTE" },
  { id: "TX-9283", user: "Sonia Kouame", type: "DÉPÔT", amount: 10000, method: "MTN", phone: "05 01 XX XX", date: "Hier • 18:45", status: "COMPLÉTÉ" },
  { id: "TX-9282", user: "Armand Koffi", type: "RETRAIT", amount: 2500, method: "WAVE", phone: "07 00 XX XX", date: "Hier • 14:20", status: "EN ATTENTE" },
  { id: "TX-9281", user: "Ibrahim Diallo", type: "DÉPÔT", amount: 1000, method: "ORANGE", phone: "07 55 XX XX", date: "Hier • 10:20", status: "COMPLÉTÉ" },
  { id: "TX-9280", user: "Ali Bamba", type: "ACHAT STANDARD", amount: 100, method: "SOLDE", phone: "-", date: "Hier • 08:15", status: "COMPLÉTÉ" },
];

// Données pour les modales analytiques
const kpiModalData = {
  depots: {
    title: "Analyse des Dépôts",
    subtitle: "Comparatif FedaPay vs Mobile Money (7 jours)",
    total: "242k F",
    color1: "#10b981", // emerald
    color2: "#3b82f6", // blue
    key1: "FedaPay",
    key2: "MobileMoney",
    data: [
      { name: 'Lun', FedaPay: 4000, MobileMoney: 2400 },
      { name: 'Mar', FedaPay: 3000, MobileMoney: 1398 },
      { name: 'Mer', FedaPay: 2000, MobileMoney: 9800 },
      { name: 'Jeu', FedaPay: 2780, MobileMoney: 3908 },
      { name: 'Ven', FedaPay: 1890, MobileMoney: 4800 },
      { name: 'Sam', FedaPay: 2390, MobileMoney: 3800 },
      { name: 'Dim', FedaPay: 3490, MobileMoney: 4300 },
    ]
  },
  retraits: {
    title: "Analyse des Retraits",
    subtitle: "Volume des Demandes vs Retraits Approuvés (7 jours)",
    total: "115k F",
    color1: "#ef4444", // red
    color2: "#f97316", // orange
    key1: "Demandes",
    key2: "Approuves",
    data: [
      { name: 'Lun', Demandes: 4000, Approuves: 2400 },
      { name: 'Mar', Demandes: 3000, Approuves: 1398 },
      { name: 'Mer', Demandes: 2000, Approuves: 2000 },
      { name: 'Jeu', Demandes: 2780, Approuves: 2780 },
      { name: 'Ven', Demandes: 1890, Approuves: 1800 },
      { name: 'Sam', Demandes: 2390, Approuves: 2300 },
      { name: 'Dim', Demandes: 3490, Approuves: 3490 },
    ]
  },
  ventes: {
    title: "Ventes de Tickets",
    subtitle: "Coupons Standard (100F) vs Élite (150F) (7 jours)",
    total: "8.4k",
    color1: "#a855f7", // purple
    color2: "#f97316", // orange
    key1: "Standard",
    key2: "Elite",
    data: [
      { name: 'Lun', Standard: 400, Elite: 240 },
      { name: 'Mar', Standard: 300, Elite: 130 },
      { name: 'Mer', Standard: 200, Elite: 980 },
      { name: 'Jeu', Standard: 270, Elite: 390 },
      { name: 'Ven', Standard: 180, Elite: 480 },
      { name: 'Sam', Standard: 230, Elite: 380 },
      { name: 'Dim', Standard: 340, Elite: 430 },
    ]
  },
  revenus: {
    title: "Analyse des Revenus Bruts",
    subtitle: "Croissance des Ventes (7 derniers jours)",
    total: "0 F", // Dynamic
    color1: "#10b981", 
    color2: "#059669", 
    key1: "Ventes Jour",
    key2: "Moyenne Hebdo",
    data: [
      { name: 'Lun', 'Ventes Jour': 4000, 'Moyenne Hebdo': 3500 },
      { name: 'Mar', 'Ventes Jour': 3000, 'Moyenne Hebdo': 3500 },
      { name: 'Mer', 'Ventes Jour': 5000, 'Moyenne Hebdo': 3500 },
      { name: 'Jeu', 'Ventes Jour': 2000, 'Moyenne Hebdo': 3500 },
      { name: 'Ven', 'Ventes Jour': 4500, 'Moyenne Hebdo': 3500 },
      { name: 'Sam', 'Ventes Jour': 6000, 'Moyenne Hebdo': 3500 },
      { name: 'Dim', 'Ventes Jour': 7000, 'Moyenne Hebdo': 3500 },
    ]
  },
  retraits_payes: {
    title: "Analyse des Retraits Payés",
    subtitle: "Impact financier des retraits utilisateurs",
    total: "0 F", // Dynamic
    color1: "#f97316", 
    color2: "#ea580c", 
    key1: "Retraits Effectués",
    key2: "Plafond Journalier",
    data: [
      { name: 'Lun', 'Retraits Effectués': 1200, 'Plafond Journalier': 5000 },
      { name: 'Mar', 'Retraits Effectués': 800, 'Plafond Journalier': 5000 },
      { name: 'Mer', 'Retraits Effectués': 1500, 'Plafond Journalier': 5000 },
      { name: 'Jeu', 'Retraits Effectués': 2000, 'Plafond Journalier': 5000 },
      { name: 'Ven', 'Retraits Effectués': 1000, 'Plafond Journalier': 5000 },
      { name: 'Sam', 'Retraits Effectués': 3500, 'Plafond Journalier': 5000 },
      { name: 'Dim', 'Retraits Effectués': 4000, 'Plafond Journalier': 5000 },
    ]
  },
  charges: {
    title: "Analyse des Charges Manuelles",
    subtitle: "Dépenses d'exploitation (7 jours)",
    total: "0 F", // Dynamic
    color1: "#ef4444", 
    color2: "#dc2626", 
    key1: "Charges",
    key2: "Budget Moyen",
    data: [
      { name: 'Lun', 'Charges': 5000, 'Budget Moyen': 6000 },
      { name: 'Mar', 'Charges': 0, 'Budget Moyen': 6000 },
      { name: 'Mer', 'Charges': 15000, 'Budget Moyen': 6000 },
      { name: 'Jeu', 'Charges': 0, 'Budget Moyen': 6000 },
      { name: 'Ven', 'Charges': 0, 'Budget Moyen': 6000 },
      { name: 'Sam', 'Charges': 12500, 'Budget Moyen': 6000 },
      { name: 'Dim', 'Charges': 0, 'Budget Moyen': 6000 },
    ]
  },
  benefice: {
    title: "Évolution du Bénéfice Net",
    subtitle: "Rentabilité globale (7 jours)",
    total: "0 F", // Dynamic
    color1: "#10b981", 
    color2: "#3b82f6", 
    key1: "Bénéfice Cumulé",
    key2: "Objectif",
    data: [
      { name: 'Lun', 'Bénéfice Cumulé': -2000, 'Objectif': 5000 },
      { name: 'Mar', 'Bénéfice Cumulé': 200, 'Objectif': 5000 },
      { name: 'Mer', 'Bénéfice Cumulé': -11300, 'Objectif': 5000 },
      { name: 'Jeu', 'Bénéfice Cumulé': -11300, 'Objectif': 5000 },
      { name: 'Ven', 'Bénéfice Cumulé': -7800, 'Objectif': 5000 },
      { name: 'Sam', 'Bénéfice Cumulé': -17800, 'Objectif': 5000 },
      { name: 'Dim', 'Bénéfice Cumulé': -14800, 'Objectif': 5000 },
    ]
  }
};

export default function AdminAccounting() {
  const [activeTab, setActiveTab] = useState<'registre' | 'benefice'>('registre');
  const [selectedKpi, setSelectedKpi] = useState<null | 'depots' | 'retraits' | 'ventes' | 'revenus' | 'retraits_payes' | 'charges' | 'benefice'>(null);
  
  // --- STATE: Registre ---
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filter, setFilter] = useState<TransactionStatus | 'TOUT'>('TOUT');
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (id: string, newStatus: TransactionStatus) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: newStatus } : tx));
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'TOUT' || tx.status === filter;
    const matchesSearch = tx.user.toLowerCase().includes(searchQuery.toLowerCase()) || tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // --- STATE: Bénéfice Réel ---
  const [expenses, setExpenses] = useState([
    { id: 1, title: "Abonnement Claude 3", amount: 15000, category: "IA" },
    { id: 2, title: "Serveur Supabase Pro", amount: 12500, category: "Infra" },
    { id: 3, title: "Frais FedaPay (Estimés)", amount: 5000, category: "Frais" },
  ]);
  const [newExpense, setNewExpense] = useState({ title: "", amount: "" });

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.title && newExpense.amount) {
      setExpenses([{ id: Date.now(), title: newExpense.title, amount: parseInt(newExpense.amount), category: "Autre" }, ...expenses]);
      setNewExpense({ title: "", amount: "" });
    }
  };

  // --- CALCULS (Bénéfice) ---
  const grossRevenue = transactions.filter(t => t.type.includes('ACHAT') && t.status === 'COMPLÉTÉ').reduce((acc, t) => acc + t.amount, 0) * 100;
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'RETRAIT' && t.status === 'COMPLÉTÉ').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = grossRevenue - totalExpenses - totalWithdrawals;

  const expensePieData = expenses.map(exp => ({ name: exp.title, value: exp.amount }));
  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ef4444'];

  return (
    <div className="space-y-12 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <CreditCard className="w-4 h-4" />
              Direction Financière
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Centre <span className="text-orange-500 italic">Comptable</span>
           </h1>
        </div>

        {/* Custom Tabs */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
           <button
             onClick={() => setActiveTab('registre')}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registre' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-muted hover:text-white'}`}
           >
             <CreditCard className="w-4 h-4" /> Registre des Flux
           </button>
           <button
             onClick={() => setActiveTab('benefice')}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'benefice' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-muted hover:text-white'}`}
           >
             <TrendingUp className="w-4 h-4" /> Bénéfice Réel
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'registre' ? (
          <motion.div
            key="registre"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
             {/* Stats Registre (Clickables) */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <button 
                  onClick={() => setSelectedKpi('depots')}
                  className="glass-card p-8 flex items-center justify-between gap-6 bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10 transition-colors text-left group"
                >
                   <div className="flex items-center gap-6">
                      <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                         <ArrowUpCircle className="w-6 h-6" />
                      </div>
                      <div>
                         <div className="text-2xl font-black text-white font-outfit">242k F</div>
                         <div className="text-[10px] text-muted font-black uppercase tracking-widest mt-1">Dépôts (7j)</div>
                      </div>
                   </div>
                   <BarChart2 className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
                </button>
                
                <button 
                  onClick={() => setSelectedKpi('retraits')}
                  className="glass-card p-8 flex items-center justify-between gap-6 bg-orange-500/5 border-orange-500/10 hover:bg-orange-500/10 transition-colors text-left group"
                >
                   <div className="flex items-center gap-6">
                      <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500">
                         <ArrowDownCircle className="w-6 h-6" />
                      </div>
                      <div>
                         <div className="text-2xl font-black text-white font-outfit">115k F</div>
                         <div className="text-[10px] text-muted font-black uppercase tracking-widest mt-1">Retraits (7j)</div>
                      </div>
                   </div>
                   <BarChart2 className="w-5 h-5 text-orange-500/50 group-hover:text-orange-500 transition-colors" />
                </button>
                
                <button 
                  onClick={() => setSelectedKpi('ventes')}
                  className="glass-card p-8 flex items-center justify-between gap-6 bg-purple-500/5 border-purple-500/10 hover:bg-purple-500/10 transition-colors text-left group"
                >
                   <div className="flex items-center gap-6">
                      <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-500">
                         <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                         <div className="text-2xl font-black text-white font-outfit">8.4k</div>
                         <div className="text-[10px] text-muted font-black uppercase tracking-widest mt-1">Ventes Tickets (7j)</div>
                      </div>
                   </div>
                   <BarChart2 className="w-5 h-5 text-purple-500/50 group-hover:text-purple-500 transition-colors" />
                </button>
             </div>

             {/* Table Registre */}
             <div className="glass-card overflow-hidden border-white/5">
                <div className="p-6 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4 bg-black/40 border border-white/10 px-6 py-3 rounded-2xl flex-grow max-w-md w-full">
                      <Search className="w-4 h-4 text-muted" />
                      <input 
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Chercher ID, Utilisateur..." 
                         className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-muted/40" 
                      />
                   </div>
                   <div className="flex items-center gap-2">
                      {(['TOUT', 'EN ATTENTE', 'COMPLÉTÉ'] as const).map(f => (
                         <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${filter === f ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-muted border-white/5 hover:border-white/10'}`}
                         >
                            {f}
                         </button>
                      ))}
                      <button className="px-4 py-2 ml-4 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2">
                         <Filter className="w-3 h-3" /> Export
                      </button>
                   </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead className="bg-white/[0.02] border-b border-white/5 text-muted uppercase">
                         <tr>
                            <th className="p-6 text-[9px] font-black tracking-widest">Opération</th>
                            <th className="p-6 text-[9px] font-black tracking-widest">Type</th>
                            <th className="p-6 text-[9px] font-black tracking-widest">Montant</th>
                            <th className="p-6 text-[9px] font-black tracking-widest">Moyen</th>
                            <th className="p-6 text-[9px] font-black tracking-widest">Statut</th>
                            <th className="p-6 text-[9px] font-black tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         <AnimatePresence>
                            {filteredTransactions.map((tx) => (
                               <motion.tr 
                                  layout
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  key={tx.id} 
                                  className="hover:bg-white/[0.01] transition-colors group"
                               >
                                  <td className="p-6">
                                     <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-black text-[10px] font-outfit">
                                           {tx.user[0]}
                                        </div>
                                        <div>
                                           <div className="text-white font-bold text-xs">{tx.user}</div>
                                           <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">{tx.id} • {tx.date}</div>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="p-6">
                                     <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                                        tx.type === 'DÉPÔT' ? 'bg-emerald-500/10 text-emerald-500' : 
                                        tx.type === 'RETRAIT' ? 'bg-orange-500/10 text-orange-500' :
                                        'bg-purple-500/10 text-purple-500'
                                     }`}>
                                        {tx.type === 'DÉPÔT' && <ArrowUpCircle className="w-3 h-3" />}
                                        {tx.type === 'RETRAIT' && <ArrowDownCircle className="w-3 h-3" />}
                                        {tx.type.includes('ACHAT') && <CreditCard className="w-3 h-3" />}
                                        {tx.type}
                                     </div>
                                  </td>
                                  <td className="p-6">
                                     <div className="text-sm font-black text-white font-outfit tracking-tighter">{tx.amount.toLocaleString()} F</div>
                                  </td>
                                  <td className="p-6">
                                     <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                          <Smartphone className="w-3 h-3 text-muted" />
                                          <span className="text-[9px] text-white font-bold uppercase tracking-widest">{tx.method}</span>
                                        </div>
                                        <div className="text-[9px] text-muted font-medium ml-5">{tx.phone}</div>
                                     </div>
                                  </td>
                                  <td className="p-6">
                                     <div className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest ${
                                        tx.status === 'EN ATTENTE' ? 'text-orange-500' : 
                                        tx.status === 'COMPLÉTÉ' ? 'text-emerald-500' : 'text-red-500'
                                     }`}>
                                        {tx.status === 'EN ATTENTE' && <Clock className="w-3 h-3" />}
                                        {tx.status === 'COMPLÉTÉ' && <CheckCircle2 className="w-3 h-3" />}
                                        {tx.status === 'REJETÉ' && <XCircle className="w-3 h-3" />}
                                        {tx.status}
                                     </div>
                                  </td>
                                  <td className="p-6 text-right">
                                     {tx.type === 'RETRAIT' && tx.status === 'EN ATTENTE' ? (
                                       <div className="flex items-center justify-end gap-2">
                                          <button 
                                            onClick={() => handleStatusChange(tx.id, 'COMPLÉTÉ')}
                                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all tooltip-trigger"
                                            title="Approuver le retrait"
                                          >
                                             <CheckCircle2 className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => handleStatusChange(tx.id, 'REJETÉ')}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all tooltip-trigger"
                                            title="Rejeter le retrait"
                                          >
                                             <XCircle className="w-4 h-4" />
                                          </button>
                                       </div>
                                     ) : (
                                       <button className="p-2 text-muted hover:text-white transition-colors">
                                          <ChevronRight className="w-4 h-4" />
                                       </button>
                                     )}
                                  </td>
                               </motion.tr>
                            ))}
                         </AnimatePresence>
                      </tbody>
                   </table>
                </div>
                {filteredTransactions.length === 0 && (
                  <div className="p-12 text-center text-muted font-bold text-sm">
                     Aucune transaction trouvée.
                  </div>
                )}
             </div>
          </motion.div>
        ) : (
          <motion.div
            key="benefice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
             {/* KPI Bénéfice */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <button 
                  onClick={() => setSelectedKpi('revenus')}
                  className="glass-card p-6 border-white/5 hover:bg-white/[0.02] transition-colors text-left group flex flex-col justify-between"
                >
                   <div className="w-full flex justify-between items-start mb-2">
                      <div className="text-[9px] text-muted font-black uppercase tracking-widest">Revenus Bruts (Ventes)</div>
                      <BarChart2 className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                   </div>
                   <div className="text-2xl font-black text-white font-outfit">{grossRevenue.toLocaleString()} F</div>
                </button>
                <button 
                  onClick={() => setSelectedKpi('retraits_payes')}
                  className="glass-card p-6 border-white/5 hover:bg-orange-500/5 transition-colors text-left group flex flex-col justify-between"
                >
                   <div className="w-full flex justify-between items-start mb-2">
                      <div className="text-[9px] text-muted font-black uppercase tracking-widest">Retraits Payés</div>
                      <BarChart2 className="w-4 h-4 text-orange-500/20 group-hover:text-orange-500/50 transition-colors" />
                   </div>
                   <div className="text-2xl font-black text-orange-500 font-outfit">- {totalWithdrawals.toLocaleString()} F</div>
                </button>
                <button 
                  onClick={() => setSelectedKpi('charges')}
                  className="glass-card p-6 border-white/5 hover:bg-red-500/5 transition-colors text-left group flex flex-col justify-between"
                >
                   <div className="w-full flex justify-between items-start mb-2">
                      <div className="text-[9px] text-muted font-black uppercase tracking-widest">Charges Tech. & Manuelles</div>
                      <BarChart2 className="w-4 h-4 text-red-500/20 group-hover:text-red-500/50 transition-colors" />
                   </div>
                   <div className="text-2xl font-black text-red-500 font-outfit">- {totalExpenses.toLocaleString()} F</div>
                </button>
                <button 
                  onClick={() => setSelectedKpi('benefice')}
                  className="glass-card p-6 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors relative overflow-hidden text-left group"
                >
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TrendingUp className="w-16 h-16 text-emerald-500" />
                   </div>
                   <div className="relative z-10 w-full flex justify-between items-start mb-2">
                      <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Bénéfice Net Estimé</div>
                      <BarChart2 className="w-4 h-4 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
                   </div>
                   <div className="relative z-10 text-3xl font-black text-emerald-500 font-outfit">{netProfit.toLocaleString()} F</div>
                </button>
             </div>

             <div className="grid lg:grid-cols-2 gap-8">
                {/* Formulaire Charges Manuelles */}
                <div className="glass-card p-8 border-white/5 h-full flex flex-col">
                   <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                      <Receipt className="w-5 h-5 text-orange-500" />
                      <h2 className="text-xl font-black text-white font-outfit uppercase tracking-tighter">Saisir une Charge</h2>
                   </div>
                   
                   <form onSubmit={addExpense} className="space-y-4 mb-8">
                      <div>
                         <label className="block text-[9px] font-black text-muted uppercase tracking-widest mb-2">Libellé de la facture</label>
                         <input 
                            type="text" 
                            required
                            value={newExpense.title}
                            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                            placeholder="Ex: Serveur AWS M1" 
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted/40 outline-none focus:border-orange-500/50 transition-colors" 
                         />
                      </div>
                      <div>
                         <label className="block text-[9px] font-black text-muted uppercase tracking-widest mb-2">Montant (FCFA)</label>
                         <input 
                            type="number" 
                            required
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            placeholder="0" 
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted/40 outline-none focus:border-orange-500/50 transition-colors" 
                         />
                      </div>
                      <button type="submit" className="w-full py-4 mt-2 bg-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
                         <Plus className="w-4 h-4" /> Ajouter aux charges
                      </button>
                   </form>

                   <div className="flex-grow">
                      <h3 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Charges Enregistrées</h3>
                      <div className="space-y-3 overflow-y-auto pr-2 max-h-[200px] custom-scrollbar">
                         {expenses.map((exp) => (
                           <div key={exp.id} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                              <div>
                                 <div className="text-sm font-bold text-white">{exp.title}</div>
                                 <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">{exp.category}</div>
                              </div>
                              <div className="text-sm font-black text-red-400 font-outfit">- {exp.amount.toLocaleString()} F</div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Graphique Répartition */}
                <div className="glass-card p-8 border-white/5 flex flex-col items-center justify-center min-h-[400px]">
                   <div className="w-full flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                      <PieChartIcon className="w-5 h-5 text-blue-500" />
                      <h2 className="text-xl font-black text-white font-outfit uppercase tracking-tighter">Répartition des Sorties</h2>
                   </div>
                   
                   <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                       <Pie
                         data={[
                            ...expensePieData, 
                            { name: 'Retraits Payés', value: totalWithdrawals }
                         ]}
                         cx="50%"
                         cy="50%"
                         innerRadius={80}
                         outerRadius={110}
                         paddingAngle={5}
                         dataKey="value"
                       >
                         {[...expensePieData, { name: 'Retraits Payés', value: totalWithdrawals }].map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <RechartsTooltip 
                         contentStyle={{ backgroundColor: '#000000e0', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
                         itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                         formatter={(value: number) => `${value.toLocaleString()} FCFA`}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                   
                   <div className="flex flex-wrap justify-center gap-4 mt-6">
                      {[...expensePieData, { name: 'Retraits Payés', value: totalWithdrawals }].map((entry, index) => (
                         <div key={entry.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{entry.name}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

     {/* Modal d'Analyse (Popup) */}
      <AnimatePresence>
        {selectedKpi && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setSelectedKpi(null)}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="relative z-10 w-full max-w-4xl glass-card border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                 style={{ maxHeight: '90vh' }}
              >
                 <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                    <div>
                       <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">{kpiModalData[selectedKpi].title}</h2>
                       <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">{kpiModalData[selectedKpi].subtitle}</p>
                    </div>
                    <button 
                       onClick={() => setSelectedKpi(null)}
                       className="p-2 rounded-lg bg-white/5 text-muted hover:text-white hover:bg-white/10 transition-colors"
                    >
                       <X className="w-5 h-5" />
                    </button>
                 </div>
                 
                 <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-8">
                    {/* Récapitulatif Total Modal */}
                    <div className="flex flex-wrap gap-4">
                       <div className="glass-card p-6 border-white/5 flex-grow min-w-[200px]">
                          <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Total Cumulé</div>
                          <div className={`text-4xl font-black font-outfit ${
                             ['depots', 'revenus', 'benefice'].includes(selectedKpi) ? 'text-emerald-500' :
                             ['retraits', 'retraits_payes'].includes(selectedKpi) ? 'text-orange-500' : 
                             selectedKpi === 'charges' ? 'text-red-500' : 'text-purple-500'
                          }`}>
                             {selectedKpi === 'revenus' ? `${grossRevenue.toLocaleString()} F` :
                              selectedKpi === 'retraits_payes' ? `- ${totalWithdrawals.toLocaleString()} F` :
                              selectedKpi === 'charges' ? `- ${totalExpenses.toLocaleString()} F` :
                              selectedKpi === 'benefice' ? `${netProfit.toLocaleString()} F` :
                              kpiModalData[selectedKpi].total}
                          </div>
                       </div>
                       <div className="glass-card p-6 border-white/5 flex-grow min-w-[200px] flex items-center gap-4">
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: kpiModalData[selectedKpi].color1 }} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted">{kpiModalData[selectedKpi].key1}</span>
                             </div>
                             <div className="text-xl font-bold text-white">65%</div>
                          </div>
                          <div className="h-8 w-px bg-white/10" />
                          <div className="flex-1 pl-4">
                             <div className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: kpiModalData[selectedKpi].color2 }} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted">{kpiModalData[selectedKpi].key2}</span>
                             </div>
                             <div className="text-xl font-bold text-white">35%</div>
                          </div>
                       </div>
                    </div>

                    {/* Graphique Modal */}
                    <div className="h-[350px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={kpiModalData[selectedKpi].data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="modalColor1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={kpiModalData[selectedKpi].color1} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={kpiModalData[selectedKpi].color1} stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="modalColor2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={kpiModalData[selectedKpi].color2} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={kpiModalData[selectedKpi].color2} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#000000e0', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
                              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey={kpiModalData[selectedKpi].key1} stroke={kpiModalData[selectedKpi].color1} strokeWidth={3} fillOpacity={1} fill="url(#modalColor1)" />
                            <Area type="monotone" dataKey={kpiModalData[selectedKpi].key2} stroke={kpiModalData[selectedKpi].color2} strokeWidth={3} fillOpacity={1} fill="url(#modalColor2)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
