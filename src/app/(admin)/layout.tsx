"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ShieldAlert, 
  LayoutGrid, 
  FilePlus, 
  CreditCard, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Menu,
  Activity,
  MessageSquare,
  Headset,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const AdminSidebarItem = ({ href, icon: Icon, label, active, onClick }: any) => (
  <Link href={href} onClick={onClick}>
    <div className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${active ? 'bg-orange-500 text-white font-black' : 'text-muted/60 hover:text-white hover:bg-white/5'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:text-orange-500 transition-colors'}`} />
      <span className="text-sm font-outfit uppercase tracking-widest">{label}</span>
    </div>
  </Link>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/";
    }
  };

  // Mocking user permissions for demonstration (should come from Supabase Auth/DB)
  const userPermissions = {
    role: 'super_admin', // 'super_admin' or 'staff'
    view_dashboard: true,
    manage_coupons: true,
    manage_transactions: true,
    manage_users: true,
    view_logs: true,
    manage_staff: true
  };

  const adminNav = [
    { href: "/admin", icon: LayoutGrid, label: "Console", permission: "view_dashboard" },
    { href: "/admin/tickets", icon: FilePlus, label: "Pronostics IA", permission: "manage_coupons" },
    { href: "/admin/transactions", icon: CreditCard, label: "Finances", permission: "manage_transactions" },
    { href: "/admin/users", icon: Users, label: "Communauté", permission: "manage_users" },
    { href: "/admin/chat", icon: MessageSquare, label: "Assistant IA", permission: "use_admin_chat" },
    { href: "/admin/support", icon: Headset, label: "Service Client", permission: "manage_users" },
    { href: "/admin/recruitment", icon: Briefcase, label: "Recrutement", permission: "manage_staff" },
    { href: "/admin/logs", icon: Activity, label: "Logs IA", permission: "view_logs" },
    { href: "/admin/settings", icon: Settings, label: "Système", permission: "view_dashboard" }, // Settings visible to all, but content changes
  ];

  // Filtering navigation items based on permissions
  const filteredNav = adminNav.filter(item => {
    if (userPermissions.role === 'super_admin') return true;
    return (userPermissions as any)[item.permission];
  });

  return (
    <div className="flex min-h-screen bg-[#05070A] text-[#F8FAFC] font-inter overflow-hidden">
      {/* Sidebar Admin */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-80 bg-[#0A0C10] border-r border-orange-500/10 z-50 transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          {/* Logo Admin */}
          <Link href="/admin" className="flex items-center gap-4 mb-16">
            <div className="relative w-12 h-12">
               <Image src="/images/logo.png" fill alt="Logo" className="object-contain grayscale brightness-200" />
            </div>
            <div className="flex flex-col">
               <span className="text-xl font-black font-outfit tracking-tighter uppercase leading-none">VictorIA</span>
               <span className="text-[10px] text-orange-500 font-black uppercase tracking-[0.3em]">ADMIN PANEL</span>
            </div>
          </Link>

          {/* Navigation Admin */}
          <nav className="flex-grow space-y-2">
            {filteredNav.map((item) => (
              <AdminSidebarItem 
                key={item.href} 
                {...item} 
                active={pathname === item.href} 
                onClick={() => setIsSidebarOpen(false)}
              />
            ))}
          </nav>

          {/* Bottom Sidebar */}
          <div className="pt-8 border-t border-white/5">
             <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 mb-6 text-center">
                <Activity className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Status Serveur</div>
                <div className="text-sm font-bold text-white">OPÉRATIONNEL</div>
             </div>
             <button 
               onClick={handleSignOut}
               className="flex items-center gap-4 px-6 py-4 w-full text-muted/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
             >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-outfit uppercase tracking-widest text-red-500">Quitter l'Admin</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Top Header Admin */}
        <header className="h-24 border-b border-white/5 bg-[#0A0C10]/50 backdrop-blur-xl flex items-center justify-between px-8 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-muted">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-xl">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-black uppercase tracking-widest">Connecté en tant que Super Admin</span>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-4 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Live Analytics</span>
             </div>
             <button className="p-2 text-muted hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
             </button>
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black text-xl font-outfit">
                A
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-grow overflow-y-auto p-10 bg-[#05070A]">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
