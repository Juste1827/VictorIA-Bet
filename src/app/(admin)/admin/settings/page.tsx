"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Settings, 
  Users, 
  ShieldCheck, 
  Mail, 
  UserPlus, 
  Power, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Lock,
  Eye,
  CreditCard,
  Zap,
  MessageSquare,
  Activity,
  Target
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const PermissionToggle = ({ label, icon: Icon, enabled, onChange }: any) => (
  <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-orange-500/20 transition-all">
    <div className="flex items-center gap-4">
       <div className={`p-3 rounded-xl ${enabled ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-muted'}`}>
          <Icon className="w-5 h-5" />
       </div>
       <span className={`text-xs font-black uppercase tracking-widest ${enabled ? 'text-white' : 'text-muted'}`}>{label}</span>
    </div>
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${enabled ? 'bg-orange-500' : 'bg-white/10'}`}
    >
       <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const StaffCard = ({ id, name, email, role, status, lastLogin, permissions, onDelete }: any) => (
  <div className="glass-card p-8 border-white/5 relative group animate-in fade-in slide-in-from-bottom-4">
    {role !== 'SUPER_ADMIN' && (
       <div className="absolute top-6 right-6 flex gap-2">
          <button 
            onClick={() => alert(`Édition de ${name} bientôt disponible`)}
            className="p-2 text-muted hover:text-white transition-colors"
          >
             <Settings className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(id, name)}
            className="p-2 text-muted hover:text-red-500 transition-colors"
          >
             <Trash2 className="w-4 h-4" />
          </button>
       </div>
    )}
    
    <div className="flex items-center gap-4 mb-8">
       <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xl font-outfit uppercase">
          {name ? name[0] : '?'}
       </div>
       <div>
          <div className="text-white font-black font-outfit uppercase tracking-tight">{name}</div>
          <div className="flex items-center gap-2 text-[9px] text-orange-500 font-black uppercase tracking-widest">
             <ShieldCheck className="w-3 h-3" /> {role}
          </div>
       </div>
    </div>

    <div className="space-y-3 mb-8">
       <div className="flex items-center gap-3 text-[10px] text-muted font-medium">
          <Mail className="w-4 h-4" /> {email}
       </div>
       <div className="flex items-center gap-3 text-[10px] text-muted font-medium">
          <Clock className="w-4 h-4" /> Vu le {lastLogin || 'Jamais'}
       </div>
    </div>

    <div className="pt-6 border-t border-white/5 grid grid-cols-4 gap-2">
       {permissions && Object.entries(permissions).map(([key, val]: any) => (
         <div key={key} title={key} className={`w-full h-1 rounded-full ${val ? 'bg-orange-500' : 'bg-white/5'}`} />
       ))}
    </div>
    <div className="mt-2 text-[8px] text-muted font-black uppercase tracking-widest text-center">Profil de Permissions</div>
  </div>
);

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("staff");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStaffPerms, setNewStaffPerms] = useState({
    view_dashboard: true,
    manage_coupons: true,
    manage_users: false,
    manage_withdrawals: false,
    view_agent_logs: true,
    use_admin_chat: false
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setStaffList(data);
    setLoading(false);
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (confirm(`Voulez-vous vraiment retirer ${name} de l'équipe VictorIA ? Cette action est irréversible.`)) {
      const { error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', id);

      if (!error) {
        setStaffList(prev => prev.filter(m => m.id !== id));
      } else {
        alert("Erreur lors de la suppression : " + error.message);
      }
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Settings className="w-4 h-4" />
              Configuration du Système
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Console <span className="text-orange-500 italic">de Sécurité</span>
           </h1>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/10">
           <button onClick={() => setActiveTab("profile")} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}>Mon Profil</button>
           <button onClick={() => setActiveTab("staff")} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-orange-500 text-white' : 'text-muted hover:text-white'}`}>Gestion Staff</button>
        </div>
      </div>

      {activeTab === "staff" ? (
        <div className="grid lg:grid-cols-3 gap-12">
           {/* Invitation Form */}
           {/* Recruitment Portal */}
           <div className="lg:col-span-1 space-y-8">
              <div className="glass-card p-10 border-orange-500/20 bg-orange-500/5 h-full flex flex-col justify-between">
                 <div>
                    <div className="flex items-center gap-4 mb-10">
                       <Target className="w-6 h-6 text-orange-500" />
                       <h2 className="text-xl font-black text-white font-outfit uppercase tracking-tight">Chasse de Tête</h2>
                    </div>
                    
                    <p className="text-xs text-muted leading-relaxed mb-10 font-medium">
                       Votre équipe d'élite commence ici. Parcourez les membres de la communauté VictorIA, analysez leurs performances et choisissez un <span className="text-white font-black italic">impétrant</span> pour rejoindre votre staff.
                    </p>

                    <div className="space-y-6">
                       <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                             <Users className="w-5 h-5" />
                          </div>
                          <div className="text-[10px] font-black text-white uppercase tracking-widest">1,248 Candidats potentiels</div>
                       </div>
                    </div>
                 </div>

                 <Link href="/admin/users" className="block w-full py-6 rounded-2xl bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-500/20 hover:scale-105 transition-all mt-12 text-center">
                    Parcourir les membres
                 </Link>
              </div>
           </div>

           {/* Staff List & Recruitment Pipeline */}
           <div className="lg:col-span-2 space-y-12">
              <div className="space-y-8">
                 <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Équipe Active</h2>
                 <div className="grid md:grid-cols-2 gap-8">
                    {loading ? (
                       <div className="col-span-2 h-40 flex items-center justify-center text-muted font-black uppercase tracking-widest text-[10px]">
                          Chargement de l'équipe...
                       </div>
                    ) : (
                       staffList.map((member) => (
                          <StaffCard 
                             key={member.id}
                             id={member.id}
                             name={member.full_name}
                             email={member.email}
                             role={member.role}
                             lastLogin={member.last_login}
                             permissions={member.permissions}
                             onDelete={handleDeleteMember}
                          />
                       ))
                    )}
                 </div>
              </div>

              {/* NEW: Recruitment Pipeline Section */}
              <div className="space-y-8 pt-12 border-t border-white/5">
                 <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">Recrutements en cours</h2>
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-orange-500/20">3 Candidats</span>
                 </div>
                 
                 <div className="grid gap-4">
                    {[
                      { name: "Jean Parieur", status: "EN ENTRETIEN", date: "Il y a 2h", avatar: "J" },
                      { name: "Sonia Kouame", status: "ACCEPTÉ", date: "Hier, 14:05", avatar: "S" },
                      { name: "Ibrahim Diallo", status: "INVITÉ", date: "Il y a 15 min", avatar: "I" },
                    ].map((recruit, i) => (
                       <div key={i} className="glass-card p-6 border-white/5 bg-white/[0.01] flex items-center justify-between group hover:border-orange-500/30 transition-all">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black font-outfit text-lg">
                                {recruit.avatar}
                             </div>
                             <div>
                                <div className="text-white font-bold text-sm mb-1">{recruit.name}</div>
                                <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Approché le {recruit.date}</div>
                             </div>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                                recruit.status === 'EN ENTRETIEN' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                recruit.status === 'ACCEPTÉ' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-muted'
                             }`}>
                                {recruit.status}
                             </div>
                             <button 
                                onClick={() => alert(`Ouverture du chat d'entretien avec ${recruit.name}`)}
                                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-orange-500 hover:border-orange-500 transition-all"
                             >
                                {recruit.status === 'EN ENTRETIEN' ? 'Continuer Chat' : 'Ouvrir Entretien'}
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              
              <div className="glass-card p-10 border-white/5 bg-white/[0.01]">
                 <div className="flex items-center gap-4 mb-8">
                    <ShieldCheck className="w-6 h-6 text-muted" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest font-outfit">Audit des Actions Récentes</h3>
                 </div>
                 <div className="space-y-6">
                    {[
                      { staff: "Admin", action: "A validé un retrait de 5 000 F", time: "14 min" },
                      { staff: "Koffi", action: "A modifié le coupon Premium #827", time: "1h 20" },
                      { staff: "Admin", action: "A invité Koffi Analyste", time: "Hier" },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] font-medium border-b border-white/5 pb-4">
                         <div className="flex gap-4">
                            <span className="text-orange-500 font-black uppercase">{log.staff}</span>
                            <span className="text-muted">{log.action}</span>
                         </div>
                         <span className="text-muted/40 font-bold">{log.time}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="max-w-2xl glass-card p-12 border-white/5 mx-auto">
           <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter mb-12 text-center">Paramètres de Profil</h2>
           <div className="space-y-8">
              <div className="flex justify-center mb-12">
                 <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-orange-500/10 border-2 border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-4xl font-outfit">A</div>
                    <div className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl text-black shadow-xl cursor-pointer hover:bg-orange-500 hover:text-white transition-all">
                       <Plus className="w-4 h-4" />
                    </div>
                 </div>
              </div>
              <div className="grid gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Email de Connexion</label>
                    <input type="text" readOnly value="contact@victoriabet.com" className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 outline-none text-muted font-bold cursor-not-allowed" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Nouveau Mot de Passe</label>
                    <input type="password" placeholder="••••••••" className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 outline-none focus:border-orange-500 transition-all text-white font-bold" />
                 </div>
              </div>
              <button className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-orange-500 hover:text-white transition-all shadow-xl mt-8">Sauvegarder les modifications</button>
           </div>
        </div>
      )}
    </div>
  );
}

const Plus = ({ className }: any) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);
