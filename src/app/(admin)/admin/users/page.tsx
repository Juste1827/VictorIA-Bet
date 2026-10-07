"use client"

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Smartphone, 
  Calendar,
  ChevronRight,
  Target,
  Gift,
  X,
  Zap,
  Briefcase,
  BarChart2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const UserRow = ({ user, onRecruit }: any) => (
  <tr className="hover:bg-white/[0.01] transition-colors border-b border-white/5 group">
    <td className="p-8">
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-lg font-outfit uppercase">
             {user.username[0]}
          </div>
          <div>
             <div className="text-white font-bold text-sm">{user.username}</div>
             <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Membre depuis {user.joins}</div>
          </div>
       </div>
    </td>
    <td className="p-8">
       <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
             <Mail className="w-3 h-3 text-muted" /> {user.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
             <Smartphone className="w-3 h-3 text-muted" /> {user.phone}
          </div>
       </div>
    </td>
    <td className="p-8">
       <div className="flex items-center gap-6">
          <div className="text-center">
             <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Achats</div>
             <div className="text-sm font-black text-white">{user.purchases}</div>
          </div>
          <div className="text-center">
             <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Filleuls</div>
             <div className="text-sm font-black text-orange-500">{user.referrals}</div>
          </div>
       </div>
    </td>
    <td className="p-8 text-right">
       <div className="flex items-center justify-end gap-2">
          <button 
            title="Recruter ce membre"
            onClick={() => onRecruit(user)}
            className="p-3 rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all group"
          >
             <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button className="p-3 text-muted hover:text-white transition-colors">
             <MoreVertical className="w-5 h-5" />
          </button>
       </div>
    </td>
  </tr>
);

// Données pour les modales analytiques
const kpiModalData = {
  utilisateurs: {
    title: "Croissance des Utilisateurs",
    subtitle: "Évolution des inscriptions (7 derniers jours)",
    total: "1,248",
    color1: "#10b981", 
    color2: "#059669", 
    key1: "Nouveaux Inscrits",
    key2: "Objectif",
    data: [
      { name: 'Lun', 'Nouveaux Inscrits': 45, 'Objectif': 50 },
      { name: 'Mar', 'Nouveaux Inscrits': 52, 'Objectif': 50 },
      { name: 'Mer', 'Nouveaux Inscrits': 38, 'Objectif': 50 },
      { name: 'Jeu', 'Nouveaux Inscrits': 65, 'Objectif': 50 },
      { name: 'Ven', 'Nouveaux Inscrits': 48, 'Objectif': 50 },
      { name: 'Sam', 'Nouveaux Inscrits': 85, 'Objectif': 50 },
      { name: 'Dim', 'Nouveaux Inscrits': 112, 'Objectif': 50 },
    ]
  },
  parrainages: {
    title: "Parrainages Actifs",
    subtitle: "Volume de parrainage vs conversion",
    total: "482",
    color1: "#f97316", 
    color2: "#ea580c", 
    key1: "Liens Partagés",
    key2: "Conversions Réussies",
    data: [
      { name: 'Lun', 'Liens Partagés': 120, 'Conversions Réussies': 45 },
      { name: 'Mar', 'Liens Partagés': 150, 'Conversions Réussies': 60 },
      { name: 'Mer', 'Liens Partagés': 90, 'Conversions Réussies': 30 },
      { name: 'Jeu', 'Liens Partagés': 200, 'Conversions Réussies': 85 },
      { name: 'Ven', 'Liens Partagés': 180, 'Conversions Réussies': 70 },
      { name: 'Sam', 'Liens Partagés': 300, 'Conversions Réussies': 120 },
      { name: 'Dim', 'Liens Partagés': 250, 'Conversions Réussies': 90 },
    ]
  },
  retention: {
    title: "Taux de Rétention",
    subtitle: "Activité des utilisateurs (Dernières Semaines)",
    total: "82%",
    color1: "#3b82f6", 
    color2: "#1d4ed8", 
    key1: "Utilisateurs Actifs (%)",
    key2: "Moyenne Secteur (%)",
    data: [
      { name: 'S1', 'Utilisateurs Actifs (%)': 78, 'Moyenne Secteur (%)': 65 },
      { name: 'S2', 'Utilisateurs Actifs (%)': 80, 'Moyenne Secteur (%)': 65 },
      { name: 'S3', 'Utilisateurs Actifs (%)': 85, 'Moyenne Secteur (%)': 65 },
      { name: 'S4', 'Utilisateurs Actifs (%)': 82, 'Moyenne Secteur (%)': 65 },
    ]
  }
};

export default function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const [adminId, setAdminId] = useState<string | null>(null);
  
  // Nouveaux états
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKpi, setSelectedKpi] = useState<null | 'utilisateurs' | 'parrainages' | 'retention'>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setAdminId(data.user.id);
    });
  }, []);

  const handleRecruitClick = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const submitOffer = async (e: any) => {
    e.preventDefault();
    if (!selectedUser || !adminId) return;

    const { error } = await supabase.from('recruitment_offers').insert({
      candidate_id: selectedUser.id || 'f642674e-5883-49d7-84d2-f6742674e588', // Placeholder si pas d'ID réel pour la démo
      admin_id: adminId,
      role_offered: role,
      status: 'pending'
    });

    if (!error) {
      alert(`Offre de recrutement envoyée à ${selectedUser.username} !`);
      setIsModalOpen(false);
      setRole("");
    } else {
      console.error(error);
      alert("Erreur lors de l'envoi de l'offre.");
    }
  };

  const handleExport = () => {
    alert("Génération du fichier CSV en cours. Le téléchargement démarrera automatiquement...");
  };

  const mockUsers = [
    { id: '1', username: "Jean Parieur", email: "jean@example.com", phone: "07 48 12 34", joins: "Janvier 2024", purchases: 12, referrals: 4 },
    { id: '2', username: "Sonia Kouame", email: "sonia@example.com", phone: "05 01 23 45", joins: "Mars 2024", purchases: 24, referrals: 12 },
    { id: '3', username: "Armand Koffi", email: "armand@example.com", phone: "07 00 34 56", joins: "Avril 2024", purchases: 3, referrals: 0 },
    { id: '4', username: "Ibrahim Diallo", email: "ib@example.com", phone: "07 55 45 67", joins: "Février 2024", purchases: 42, referrals: 18 },
  ];

  const filteredUsers = mockUsers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-12 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Target className="w-4 h-4" />
              Gestion de la Communauté
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Membres <span className="text-orange-500 italic">VictorIA</span>
           </h1>
        </div>
        <button 
           onClick={handleExport}
           className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3 shadow-xl"
        >
           <UserPlus className="w-5 h-5" />
           Exporter la liste
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <button 
           onClick={() => setSelectedKpi('utilisateurs')}
           className="glass-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors text-left group flex flex-col justify-between"
         >
            <div className="w-full flex justify-between items-start mb-4">
               <div className="text-[10px] font-black text-muted uppercase tracking-widest">Total Utilisateurs</div>
               <BarChart2 className="w-5 h-5 text-white/20 group-hover:text-emerald-500/50 transition-colors" />
            </div>
            <div className="text-4xl font-black text-white font-outfit tracking-tighter">1,248</div>
            <div className="text-xs text-emerald-500 font-bold mt-2">+12% ce mois</div>
         </button>
         
         <button 
           onClick={() => setSelectedKpi('parrainages')}
           className="glass-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors text-left group flex flex-col justify-between"
         >
            <div className="w-full flex justify-between items-start mb-4">
               <div className="text-[10px] font-black text-muted uppercase tracking-widest">Parrainages Actifs</div>
               <BarChart2 className="w-5 h-5 text-white/20 group-hover:text-orange-500/50 transition-colors" />
            </div>
            <div className="text-4xl font-black text-white font-outfit tracking-tighter">482</div>
            <div className="text-xs text-orange-500 font-bold mt-2">38.6% de pénétration</div>
         </button>
         
         <button 
           onClick={() => setSelectedKpi('retention')}
           className="glass-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors text-left group flex flex-col justify-between"
         >
            <div className="w-full flex justify-between items-start mb-4">
               <div className="text-[10px] font-black text-muted uppercase tracking-widest">Taux de Rétention</div>
               <BarChart2 className="w-5 h-5 text-white/20 group-hover:text-blue-500/50 transition-colors" />
            </div>
            <div className="text-4xl font-black text-white font-outfit tracking-tighter">82%</div>
            <div className="text-xs text-blue-500 font-bold mt-2">Objectif atteint</div>
         </button>
      </div>

      <div className="glass-card overflow-hidden border-white/5">
         <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between gap-8">
            <div className="flex items-center gap-4 bg-black/40 border border-white/10 px-6 py-3 rounded-2xl flex-grow max-w-md">
               <Search className="w-5 h-5 text-muted" />
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, email, téléphone..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-muted/40" 
               />
            </div>
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-muted hover:text-white transition-all">
               <Filter className="w-5 h-5" />
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead className="bg-white/[0.02] border-b border-white/5">
                  <tr>
                     <th className="p-8 text-[10px] font-black text-muted uppercase tracking-widest">Utilisateur</th>
                     <th className="p-8 text-[10px] font-black text-muted uppercase tracking-widest">Contact</th>
                     <th className="p-8 text-[10px] font-black text-muted uppercase tracking-widest">Activité</th>
                     <th className="p-8 text-[10px] font-black text-muted uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filteredUsers.map((user) => (
                       <motion.tr 
                         key={user.id} 
                         layout
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="hover:bg-white/[0.01] transition-colors border-b border-white/5 group"
                       >
                          <td className="p-8">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-lg font-outfit uppercase">
                                   {user.username[0]}
                                </div>
                                <div>
                                   <div className="text-white font-bold text-sm">{user.username}</div>
                                   <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Membre depuis {user.joins}</div>
                                </div>
                             </div>
                          </td>
                          <td className="p-8">
                             <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
                                   <Mail className="w-3 h-3 text-muted" /> {user.email}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
                                   <Smartphone className="w-3 h-3 text-muted" /> {user.phone}
                                </div>
                             </div>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-6">
                                <div className="text-center">
                                   <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Achats</div>
                                   <div className="text-sm font-black text-white">{user.purchases}</div>
                                </div>
                                <div className="text-center">
                                   <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Filleuls</div>
                                   <div className="text-sm font-black text-orange-500">{user.referrals}</div>
                                </div>
                             </div>
                          </td>
                          <td className="p-8 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button 
                                  title="Recruter ce membre"
                                  onClick={() => handleRecruitClick(user)}
                                  className="p-3 rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all group tooltip-trigger"
                                >
                                   <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                                <button className="p-3 text-muted hover:text-white transition-colors">
                                   <MoreVertical className="w-5 h-5" />
                                </button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredUsers.length === 0 && (
                     <tr>
                       <td colSpan={4} className="p-12 text-center text-muted font-bold text-sm">
                         Aucun membre trouvé pour "{searchQuery}".
                       </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Recruitment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg glass-card border-orange-500/30 bg-[#0A0C10] relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 blur-[100px]" />
              
              <div className="p-10 relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-muted hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <h2 className="text-3xl font-black text-white font-outfit uppercase tracking-tight mb-2">Offre de Recrutement</h2>
                <p className="text-muted text-xs mb-10 leading-relaxed">
                  Vous proposez à <span className="text-orange-500 font-bold">{selectedUser?.username}</span> de rejoindre l'équipe VictorIA. Définissez le rôle qu'il occupera.
                </p>

                <form onSubmit={submitOffer} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Zap className="w-3 h-3 text-orange-500" /> Rôle proposé
                    </label>
                    <input 
                      required
                      type="text" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ex: Expert Analyste, Modérateur Staff..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white outline-none focus:border-orange-500 transition-all font-bold placeholder:text-muted/20"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-grow py-5 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="flex-grow py-5 rounded-2xl bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-500/40 hover:scale-105 transition-all"
                    >
                      Envoyer l'offre
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Analytical Modal */}
      <AnimatePresence>
        {selectedKpi && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
                          <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Total Actuel</div>
                          <div className={`text-4xl font-black font-outfit ${
                             selectedKpi === 'utilisateurs' ? 'text-emerald-500' :
                             selectedKpi === 'parrainages' ? 'text-orange-500' : 'text-blue-500'
                          }`}>
                             {kpiModalData[selectedKpi].total}
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
