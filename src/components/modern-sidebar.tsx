"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Wrench,
  Store,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  MapPin,
  CreditCard,
  History,
  Award,
  TrendingUp
} from "lucide-react";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  color?: string;
}

interface ModernSidebarProps {
  role: "user" | "mechanic" | "enterprise";
  userName?: string;
  userAvatar?: string;
}

const menuItems: Record<string, SidebarItem[]> = {
  user: [
    { icon: Home, label: "Accueil", href: "/dashboard", color: "#FF8C42" },
    { icon: Zap, label: "SOS Urgence", href: "/sos", badge: 0, color: "#ef4444" },
    { icon: Wrench, label: "Mes Véhicules", href: "/vehicles", color: "#00D4FF" },
    { icon: MapPin, label: "Carte", href: "/map", color: "#10b981" },
    { icon: Store, label: "Marketplace", href: "/marketplace", color: "#f59e0b" },
    { icon: History, label: "Historique", href: "/history", color: "#8b5cf6" },
    { icon: MessageCircle, label: "Messages", href: "/messages", badge: 3, color: "#ec4899" },
    { icon: CreditCard, label: "Paiements", href: "/payments", color: "#06b6d4" },
    { icon: Bell, label: "Notifications", href: "/notifications", badge: 5, color: "#f97316" },
  ],
  mechanic: [
    { icon: Home, label: "Dashboard", href: "/mechanic-dashboard", color: "#FF8C42" },
    { icon: Wrench, label: "Missions", href: "/missions", badge: 2, color: "#00D4FF" },
    { icon: TrendingUp, label: "Gains", href: "/earnings", color: "#10b981" },
    { icon: Award, label: "Avis", href: "/reviews", color: "#f59e0b" },
    { icon: MapPin, label: "Zone", href: "/zone", color: "#8b5cf6" },
    { icon: MessageCircle, label: "Messages", href: "/messages", badge: 1, color: "#ec4899" },
    { icon: Bell, label: "Notifications", href: "/notifications", color: "#f97316" },
  ],
  enterprise: [
    { icon: Home, label: "Dashboard", href: "/enterprise-dashboard", color: "#FF8C42" },
    { icon: Store, label: "Stock", href: "/stock", color: "#00D4FF" },
    { icon: TrendingUp, label: "Ventes", href: "/sales", color: "#10b981" },
    { icon: Wrench, label: "Mécaniciens", href: "/mechanics", color: "#f59e0b" },
    { icon: CreditCard, label: "Finance", href: "/finance", color: "#8b5cf6" },
    { icon: MessageCircle, label: "Messages", href: "/messages", color: "#ec4899" },
    { icon: Bell, label: "Notifications", href: "/notifications", badge: 8, color: "#f97316" },
  ],
};

export function ModernSidebar({ role, userName = "Utilisateur", userAvatar }: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const items = menuItems[role] || menuItems.user;

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30"
      >
        {isMobileOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </motion.button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed left-0 top-0 h-screen sidebar-modern z-40 overflow-hidden
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0"
            >
              <span className="text-white font-bold text-xl">M</span>
            </motion.div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-xl font-bold text-white">Meca Master</h1>
                <p className="text-xs text-white/50 capitalize">{role}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {items.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className={`sidebar-item flex items-center gap-3 px-4 py-3 cursor-pointer
                      ${isActive ? "active" : "text-white/70 hover:text-white"}`}
                  >
                    <div 
                      className="relative"
                      style={{ color: isActive ? item.color : undefined }}
                    >
                      <Icon className="w-5 h-5 sidebar-icon" />
                      {item.badge > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-white/50">En ligne</p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <motion.div
              whileHover={{ x: 4 }}
              className="sidebar-item flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              {!isCollapsed && <span className="text-xs">Paramètres</span>}
            </motion.div>
            <motion.div
              whileHover={{ x: 4 }}
              className="sidebar-item flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="text-xs">Déconnexion</span>}
            </motion.div>
          </div>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center shadow-lg hidden lg:flex"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.div>
        </motion.button>
      </motion.aside>
    </>
  );
}

// Layout wrapper component
export function ModernLayout({
  children,
  role,
  userName,
  userAvatar,
}: {
  children: React.ReactNode;
  role: "user" | "mechanic" | "enterprise";
  userName?: string;
  userAvatar?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-modern">
      <ModernSidebar role={role} userName={userName} userAvatar={userAvatar} />
      <main className="lg:ml-[280px] min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
