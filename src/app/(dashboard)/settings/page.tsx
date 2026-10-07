"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Smartphone, 
  CreditCard,
  ChevronRight,
  Camera,
  Mail,
  Key
} from "lucide-react";

const SettingsSection = ({ title, icon: Icon, children }: any) => (
  <div className="glass-card p-10 border-white/5">
    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
      <div className="p-3 rounded-xl bg-primary/10 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-black text-white font-outfit uppercase tracking-tighter">{title}</h2>
    </div>
    <div className="space-y-8">
      {children}
    </div>
  </div>
);

const SettingsField = ({ label, value, type = "text", placeholder }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
       <input 
         type={type} 
         defaultValue={value} 
         placeholder={placeholder}
         className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 outline-none focus:border-primary transition-all text-white font-bold text-sm" 
       />
    </div>
  </div>
);

export default function Settings() {
  const [notifs, setNotifs] = useState({
    tips: true,
    results: true,
    offers: false
  });

  const handlePhotoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Photo "${file.name}" sélectionnée ! Simulation du téléchargement en cours...`);
      }
    };
    input.click();
  };

  const handleDeleteAccount = () => {
    if (confirm("ATTENTION : Cette action est irréversible. Toutes vos données, gains et coupons seront définitivement supprimés. Voulez-vous continuer ?")) {
       alert("Votre demande de suppression a été prise en compte. Déconnexion...");
       window.location.href = "/";
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Shield className="w-4 h-4" />
              Sécurité et Compte
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              Mes <span className="premium-gradient-text italic">Paramètres</span>
           </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left: Profile Photo & Quick Actions */}
        <div className="lg:col-span-1 space-y-8">
           <div className="glass-card p-10 flex flex-col items-center text-center">
              <div onClick={handlePhotoClick} className="relative mb-8 group cursor-pointer">
                 <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-black font-black text-4xl font-outfit shadow-2xl shadow-primary/20">
                    J
                 </div>
                 <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                 </div>
              </div>
              <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tight mb-2">Jean Parieur</h3>
              <p className="text-muted font-black uppercase tracking-widest text-[10px] mb-8">Utilisateur Actif</p>
              
              <div className="w-full space-y-3">
                 <button onClick={handlePhotoClick} className="w-full py-4 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-primary transition-all">Changer Photo</button>
                 <button onClick={handleDeleteAccount} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all">Supprimer Compte</button>
              </div>
           </div>
        </div>

        {/* Right: Detailed Settings */}
        <div className="lg:col-span-2 space-y-12">
           <SettingsSection title="Informations Personnelles" icon={User}>
              <div className="grid md:grid-cols-2 gap-8">
                 <SettingsField label="Nom Complet" value="Jean Parieur" />
                 <SettingsField label="Adresse Email" value="jean.p@gmail.com" type="email" />
                 <SettingsField label="Numéro Mobile Money" value="+225 07 48 XX XX" />
                 <SettingsField label="Pays" value="Côte d'Ivoire" />
              </div>
              <button className="px-10 py-4 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">Enregistrer les modifications</button>
           </SettingsSection>

           <SettingsSection title="Sécurité" icon={Lock}>
              <div className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <SettingsField label="Ancien Mot de Passe" type="password" placeholder="••••••••" />
                    <SettingsField label="Nouveau Mot de Passe" type="password" placeholder="••••••••" />
                 </div>
                 <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-4">
                       <Smartphone className="w-6 h-6 text-primary" />
                       <div>
                          <div className="text-white font-bold text-sm">Double Authentification (2FA)</div>
                          <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Désactivé</div>
                       </div>
                    </div>
                    <button className="text-primary text-[10px] font-black uppercase tracking-widest">Activer</button>
                 </div>
              </div>
           </SettingsSection>

           <SettingsSection title="Notifications" icon={Bell}>
              <div className="space-y-8">
                 {[
                   { id: 'tips', title: "Nouveau Pronostic", desc: "Recevoir une alerte quand une IA valide un ticket." },
                   { id: 'results', title: "Résultats de Gains", desc: "Notification quand un de vos coupons est gagnant." },
                   { id: 'offers', title: "Offres & Bonus", desc: "Alertes sur les promotions et affiliation." }
                 ].map((item) => (
                   <div key={item.id} className="flex items-center justify-between py-2 group">
                      <div>
                         <div className="text-white font-bold text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</div>
                         <div className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed max-w-md">{item.desc}</div>
                      </div>
                      <button 
                        onClick={() => setNotifs({...notifs, [item.id]: !notifs[item.id as keyof typeof notifs]})}
                        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${notifs[item.id as keyof typeof notifs] ? 'bg-primary/20' : 'bg-white/5 border border-white/10'}`}
                      >
                         <motion.div 
                           animate={{ x: notifs[item.id as keyof typeof notifs] ? 32 : 4 }}
                           initial={false}
                           className={`absolute top-1 w-5 h-5 rounded-full transition-colors ${notifs[item.id as keyof typeof notifs] ? 'bg-primary shadow-lg shadow-primary/50' : 'bg-muted/40'}`} 
                         />
                      </button>
                   </div>
                 ))}
              </div>
           </SettingsSection>
        </div>
      </div>
    </div>
  );
}
