"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  ShieldAlert, 
  Trophy,
  Zap,
  Clock,
  ChevronRight,
  Plus,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- Types ---
type MetricType = 'revenue' | 'users' | 'coupons' | 'withdrawals_pending' | 'withdrawals_approved';

interface LiveLog {
  id: string;
  time: string;
  action: string;
  user: string;
  type: 'purchase' | 'withdrawal' | 'alert' | 'signup';
}

// --- Données factices par métrique ---
const metricData = {
  revenue: {
    title: "Évolution du Flux Financier",
    subtitle: "Revenus vs Investissements (7 derniers jours)",
    label1: "Revenus (Ventes IA)",
    label2: "Investissements (Dépôts)",
    note: "Ce graphique illustre la corrélation entre les dépôts effectués par les membres et le chiffre d'affaires généré par l'achat des coupons IA.",
    dataKey1: "revenue",
    dataKey2: "investment",
    color1: "#f97316", // orange
    color2: "#3b82f6", // blue
    data: [
      { name: 'Lun', revenue: 4000, investment: 2400 },
      { name: 'Mar', revenue: 3000, investment: 1398 },
      { name: 'Mer', revenue: 2000, investment: 9800 },
      { name: 'Jeu', revenue: 2780, investment: 3908 },
      { name: 'Ven', revenue: 1890, investment: 4800 },
      { name: 'Sam', revenue: 2390, investment: 3800 },
      { name: 'Dim', revenue: 3490, investment: 4300 },
    ],
    logs: [
      { id: '1', time: 'À l\'instant', action: 'Achat Ticket Élite', user: 'Marc D.', type: 'purchase' as const },
      { id: '2', time: 'Il y a 5 min', action: 'Achat Ticket Standard', user: 'Ali B.', type: 'purchase' as const },
      { id: '3', time: 'Il y a 12 min', action: 'Dépôt FedaPay', user: 'Sophie L.', type: 'purchase' as const },
    ]
  },
  users: {
    title: "Croissance des Membres",
    subtitle: "Nouvelles inscriptions vs Connexions (7 derniers jours)",
    label1: "Inscriptions",
    label2: "Connexions actives",
    note: "L'évolution de la base utilisateur permet de mesurer l'impact de vos campagnes d'acquisition et le taux de rétention quotidien sur l'application.",
    dataKey1: "inscriptions",
    dataKey2: "connexions",
    color1: "#3b82f6", // blue
    color2: "#8b5cf6", // purple
    data: [
      { name: 'Lun', inscriptions: 120, connexions: 400 },
      { name: 'Mar', inscriptions: 150, connexions: 450 },
      { name: 'Mer', inscriptions: 90, connexions: 380 },
      { name: 'Jeu', inscriptions: 200, connexions: 600 },
      { name: 'Ven', inscriptions: 250, connexions: 700 },
      { name: 'Sam', inscriptions: 300, connexions: 900 },
      { name: 'Dim', inscriptions: 310, connexions: 950 },
    ],
    logs: [
      { id: '1', time: 'À l\'instant', action: 'Nouvelle inscription', user: 'Karim S.', type: 'signup' as const },
      { id: '2', time: 'Il y a 2 min', action: 'Nouvelle inscription', user: 'Marie T.', type: 'signup' as const },
      { id: '3', time: 'Il y a 10 min', action: 'Nouvelle inscription', user: 'Paul A.', type: 'signup' as const },
    ]
  },
  coupons: {
    title: "Ventes de Coupons IA",
    subtitle: "Standard vs Élite (7 derniers jours)",
    label1: "Coupons Standard (100F)",
    label2: "Coupons Élite (150F)",
    note: "Volume d'écoulement de vos deux produits phares. Cela aide à orienter les futures stratégies marketing vers le produit le plus performant.",
    dataKey1: "standard",
    dataKey2: "elite",
    color1: "#a855f7", // purple
    color2: "#f97316", // orange
    data: [
      { name: 'Lun', standard: 40, elite: 24 },
      { name: 'Mar', standard: 30, elite: 13 },
      { name: 'Mer', standard: 20, elite: 98 },
      { name: 'Jeu', standard: 27, elite: 39 },
      { name: 'Ven', standard: 18, elite: 48 },
      { name: 'Sam', standard: 23, elite: 38 },
      { name: 'Dim', standard: 34, elite: 43 },
    ],
    logs: [
      { id: '1', time: 'À l\'instant', action: 'Génération IA réussie', user: 'Système', type: 'alert' as const },
      { id: '2', time: 'Il y a 15 min', action: 'Coupon Élite Vendu', user: 'Marc D.', type: 'purchase' as const },
      { id: '3', time: 'Il y a 1h', action: 'Alerte IA Flash publiée', user: 'VictorIA', type: 'alert' as const },
    ]
  },
  withdrawals_pending: {
    title: "Demandes de Retrait",
    subtitle: "Volume en attente (7 derniers jours)",
    label1: "Demandes (Quantité)",
    label2: "Montant Total (FCFA)",
    note: "Vue d'ensemble sur le passif exigible (ce que vous devez payer aux utilisateurs). Un pic ici requiert une validation manuelle ou automatique rapide.",
    dataKey1: "demandes",
    dataKey2: "montant",
    color1: "#ef4444", // red
    color2: "#f97316", // orange
    data: [
      { name: 'Lun', demandes: 5, montant: 12000 },
      { name: 'Mar', demandes: 8, montant: 25000 },
      { name: 'Mer', demandes: 3, montant: 5000 },
      { name: 'Jeu', demandes: 12, montant: 45000 },
      { name: 'Ven', demandes: 15, montant: 60000 },
      { name: 'Sam', demandes: 2, montant: 8000 },
      { name: 'Dim', demandes: 0, montant: 0 },
    ],
    logs: [
      { id: '1', time: 'À l\'instant', action: 'Demande de retrait (5000F)', user: 'Sophie L.', type: 'withdrawal' as const },
      { id: '2', time: 'Il y a 2h', action: 'Demande de retrait (15000F)', user: 'Amine B.', type: 'withdrawal' as const },
      { id: '3', time: 'Il y a 4h', action: 'Demande de retrait (2000F)', user: 'Clara M.', type: 'withdrawal' as const },
    ]
  },
  withdrawals_approved: {
    title: "Retraits Approuvés",
    subtitle: "Volume traité avec succès (7 derniers jours)",
    label1: "Retraits validés (Quantité)",
    label2: "Montant Total (FCFA)",
    note: "Suivi des sorties de trésorerie traitées et envoyées aux affiliés. Permet d'analyser la fluidité financière et la satisfaction utilisateur.",
    dataKey1: "traites",
    dataKey2: "montant",
    color1: "#10b981", // emerald
    color2: "#3b82f6", // blue
    data: [
      { name: 'Lun', traites: 10, montant: 30000 },
      { name: 'Mar', traites: 15, montant: 45000 },
      { name: 'Mer', traites: 5, montant: 15000 },
      { name: 'Jeu', traites: 8, montant: 24000 },
      { name: 'Ven', traites: 20, montant: 60000 },
      { name: 'Sam', traites: 25, montant: 75000 },
      { name: 'Dim', traites: 12, montant: 36000 },
    ],
    logs: [
      { id: '1', time: 'À l\'instant', action: 'Retrait approuvé (10000F)', user: 'Admin', type: 'withdrawal' as const },
      { id: '2', time: 'Il y a 10 min', action: 'Retrait approuvé (5000F)', user: 'Admin', type: 'withdrawal' as const },
      { id: '3', time: 'Il y a 45 min', action: 'Retrait approuvé (25000F)', user: 'Admin', type: 'withdrawal' as const },
    ]
  }
};

const AdminStatCard = ({ id, title, value, subtext, icon: Icon, color = "orange", trend = "up", isActive, onClick }: any) => (
  <motion.button 
    onClick={() => onClick(id)}
    whileHover={{ y: -5 }}
    className={`w-full text-left glass-card p-6 relative overflow-hidden group transition-all duration-300 ${isActive ? `border-${color}-500 shadow-lg shadow-${color}-500/20 ring-1 ring-${color}-500/50` : 'border-white/5 opacity-70 hover:opacity-100'}`}
  >
    <div className={`absolute -top-10 -right-10 p-6 transition-opacity ${isActive ? 'opacity-[0.1]' : 'opacity-[0.03] group-hover:opacity-[0.08]'}`}>
      <Icon className={`w-32 h-32 ${isActive ? `text-${color}-500` : ''}`} />
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
         <div className={`p-3 rounded-xl border ${isActive ? `bg-${color}-500 text-white border-${color}-400` : `bg-${color}-500/10 border-${color}-500/20 text-${color}-500`}`}>
           <Icon className="w-5 h-5" />
         </div>
         {trend && (
            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
               {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
               12%
            </div>
         )}
      </div>
      <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isActive ? `text-${color}-400` : 'text-muted'}`}>{title}</div>
      <div className="text-3xl font-black text-white font-outfit tracking-tighter mb-1">{value}</div>
      <div className="text-muted/60 text-[10px] font-medium">{subtext}</div>
    </div>
  </motion.button>
);

export default function AdminConsole() {
  const [activeMetric, setActiveMetric] = useState<MetricType>('revenue');
  const [logs, setLogs] = useState<LiveLog[]>(metricData[activeMetric].logs);

  // Mettre à jour les logs simulés quand l'onglet change
  useEffect(() => {
    setLogs(metricData[activeMetric].logs);
  }, [activeMetric]);

  // Simulation d'arrivée de nouveaux logs
  useEffect(() => {
    const interval = setInterval(() => {
      const currentData = metricData[activeMetric];
      const randomAction = currentData.logs[Math.floor(Math.random() * currentData.logs.length)];
      
      const newLog: LiveLog = {
        id: Date.now().toString(),
        time: 'À l\'instant',
        action: randomAction.action,
        user: randomAction.user,
        type: randomAction.type
      };

      setLogs(prev => {
        const updatedPrev = prev.map(log => ({ ...log, time: log.time === "À l'instant" ? "Il y a 1 min" : log.time }));
        return [newLog, ...updatedPrev.slice(0, 4)];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [activeMetric]);

  const currentChart = metricData[activeMetric];

  return (
    <div className="space-y-10 pb-20">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Activity className="w-4 h-4 animate-pulse" />
              Centre de Commandement
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Dashboard <span className="text-orange-500 italic">Analytique</span>
           </h1>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/admin/transactions" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
              Transactions
           </Link>
           <Link href="/admin/tickets" className="px-6 py-3 bg-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2">
              <Zap className="w-4 h-4" /> IA
           </Link>
        </div>
      </div>

      <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs flex items-center gap-3">
         <ShieldAlert className="w-4 h-4" />
         Base de données synchronisée (Supabase) : Les données affichées correspondent aux schémas actuels (users, coupons, withdrawals).
      </div>

      {/* KPI Grid (Interactive Tabs) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <AdminStatCard id="revenue" isActive={activeMetric === 'revenue'} onClick={setActiveMetric} title="Revenu Global" value="2.4M F" subtext="Revenus nets" icon={TrendingUp} color="orange" trend="up" />
        <AdminStatCard id="users" isActive={activeMetric === 'users'} onClick={setActiveMetric} title="Utilisateurs" value="1,248" subtext="Membres actifs" icon={Users} color="blue" trend="up" />
        <AdminStatCard id="coupons" isActive={activeMetric === 'coupons'} onClick={setActiveMetric} title="Coupons Émis" value="8,420" subtext="Tickets IA vendus" icon={Trophy} color="purple" trend="up" />
        <AdminStatCard id="withdrawals_pending" isActive={activeMetric === 'withdrawals_pending'} onClick={setActiveMetric} title="Retraits Attente" value="12" subtext="Action requise" icon={Clock} color="red" trend="down" />
        <AdminStatCard id="withdrawals_approved" isActive={activeMetric === 'withdrawals_approved'} onClick={setActiveMetric} title="Retraits Validés" value="485" subtext="Cette semaine" icon={CheckCircle2} color="emerald" trend="up" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Dynamic Chart */}
         <div className="lg:col-span-2 glass-card p-8 border-white/5 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h2 className="text-xl font-black text-white font-outfit uppercase tracking-tighter">{currentChart.title}</h2>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">{currentChart.subtitle}</p>
               </div>
               <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none">
                  <option>Cette semaine</option>
                  <option>Ce mois</option>
                  <option>Cette année</option>
               </select>
            </div>
            
            <div className="flex-grow w-full mb-6">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={currentChart.data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={currentChart.color1} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={currentChart.color1} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={currentChart.color2} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={currentChart.color2} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => value > 1000 ? `${value/1000}k` : value} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000000e0', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey={currentChart.dataKey1} stroke={currentChart.color1} strokeWidth={3} fillOpacity={1} fill="url(#color1)" />
                    <Area type="monotone" dataKey={currentChart.dataKey2} stroke={currentChart.color2} strokeWidth={3} fillOpacity={1} fill="url(#color2)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            
            {/* Custom Legend & Explanatory Note */}
            <div className="mt-auto border-t border-white/5 pt-6">
               <div className="flex flex-wrap items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentChart.color1 }} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white">{currentChart.label1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentChart.color2 }} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white">{currentChart.label2}</span>
                  </div>
               </div>
               <p className="text-[11px] text-muted leading-relaxed italic border-l-2 pl-4 border-white/10">
                  {currentChart.note}
               </p>
            </div>
         </div>

         {/* Dynamic Live Reports Feed */}
         <div className="glass-card p-8 border-white/5 h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h2 className="text-xl font-black text-white font-outfit uppercase tracking-tighter flex items-center gap-2">
                     <Activity className="w-5 h-5 text-orange-500 animate-pulse" />
                     Rapports en Direct
                  </h2>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Filtré sur : {currentChart.title}</p>
               </div>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4">
               <AnimatePresence mode="popLayout">
                  {logs.map((log) => (
                    <motion.div 
                      layout
                      key={log.id}
                      initial={{ opacity: 0, scale: 0.9, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-4"
                    >
                       <div className={`p-2 rounded-lg ${
                          log.type === 'purchase' ? 'bg-emerald-500/10 text-emerald-500' :
                          log.type === 'withdrawal' ? 'bg-red-500/10 text-red-500' :
                          log.type === 'signup' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-purple-500/10 text-purple-500'
                       }`}>
                          {log.type === 'purchase' && <CreditCard className="w-4 h-4" />}
                          {log.type === 'withdrawal' && <ArrowDownRight className="w-4 h-4" />}
                          {log.type === 'signup' && <Users className="w-4 h-4" />}
                          {log.type === 'alert' && <Zap className="w-4 h-4" />}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                             <div className="text-sm font-bold text-white">{log.action}</div>
                             <div className="text-[9px] text-muted font-bold">{log.time}</div>
                          </div>
                          <div className="text-[10px] text-muted uppercase tracking-widest font-black">
                             Par: <span className="text-white/80">{log.user}</span>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>
      </div>
    </div>
  );
}
