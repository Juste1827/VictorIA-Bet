"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Sun,
  Moon,
  Headset,
  Star,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const SidebarItem = ({ href, icon: Icon, label, active, onClick }: any) => (
  <Link href={href} onClick={onClick}>
    <div className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${active ? 'bg-primary text-black font-black' : 'text-muted/60 hover:text-white hover:bg-white/5'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-black' : 'group-hover:text-primary transition-colors'}`} />
      <span className="text-sm font-outfit uppercase tracking-widest">{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />}
    </div>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
    { href: "/tickets", icon: Star, label: "Mes Pronos" },
    { href: "/wallet", icon: Wallet, label: "Portefeuille" },
    { href: "/dashboard/recruitment", icon: Briefcase, label: "Recrutement" },
    { href: "/affiliation", icon: Users, label: "Affiliation" },
    { href: "/dashboard/support", icon: Headset, label: "Support" },
    { href: "/settings", icon: Settings, label: "Paramètres" },
  ];

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020408] text-[#F8FAFC] font-inter overflow-hidden">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-80 bg-[#05070A] border-r border-white/5 z-50 transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 mb-16">
            <div className="relative w-12 h-12">
               <Image src="/images/logo.png" fill alt="Logo" className="object-contain mix-blend-screen brightness-125 contrast-[1.4]" />
            </div>
            <span className="text-xl font-black font-outfit tracking-tighter uppercase">VictorIA BET</span>
          </Link>

          {/* Navigation */}
          <nav className="flex-grow space-y-2">
            {navItems.map((item) => (
              <SidebarItem 
                key={item.href} 
                {...item} 
                active={pathname === item.href} 
                onClick={() => setIsSidebarOpen(false)}
              />
            ))}
          </nav>

          {/* Bottom Sidebar */}
          <div className="pt-8 border-t border-white/5 space-y-4">
             <button 
               onClick={handleSignOut}
               className="flex items-center gap-4 px-6 py-4 w-full text-muted/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all group"
             >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-outfit uppercase tracking-widest">Déconnexion</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-24 border-b border-white/5 bg-[#05070A]/50 backdrop-blur-xl flex items-center justify-between px-8 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-muted hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-96">
            <Search className="w-4 h-4 text-muted" />
            <input type="text" placeholder="Rechercher un ticket..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted/50" />
          </div>

          <div className="flex items-center gap-6">
             <button 
               onClick={() => document.documentElement.classList.toggle('light-mode')}
               className="p-2 text-muted hover:text-white transition-colors"
             >
                <Sun className="w-5 h-5 hidden [.light-mode_&]:block" />
                <Moon className="w-5 h-5 block [.light-mode_&]:hidden" />
             </button>
             
             <button className="relative p-2 text-muted hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50" />
             </button>
             
             <div className="h-10 w-[1px] bg-white/10" />
             
             <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                   <div className="text-sm font-black text-white font-outfit uppercase">Jean Parieur</div>
                   <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Utilisateur Actif</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-black font-black text-xl font-outfit shadow-lg shadow-primary/20">
                   J
                </div>
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-grow overflow-y-auto p-8 bg-[#020408] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
