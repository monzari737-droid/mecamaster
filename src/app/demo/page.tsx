"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Wrench, Building2, ArrowLeft, Sparkles, 
  MapPin, Store, AlertTriangle, MessageSquare, 
  Bell, UserCircle, LogOut, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// ═══════════════════════════════════════════════════════════════
// MODE DÉMO - Accès complet sans inscription
// ═══════════════════════════════════════════════════════════════

const demoUser = {
  name: "Utilisateur Démo",
  email: "demo@mecamaster.ci",
  role: "user",
  avatar: "UD"
};

const demoMechanic = {
  name: "Mécano Démo",
  email: "mechanic@mecamaster.ci", 
  role: "mechanic",
  avatar: "MD",
  specialty: "Mécanique générale",
  rating: 4.8
};

const demoEnterprise = {
  name: "Enterprise Démo",
  email: "enterprise@mecamaster.ci",
  role: "enterprise",
  avatar: "ED",
  company: "Auto Parts CI"
};

export default function DemoPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleExitDemo = () => {
    router.push("/");
  };

  // ═══════════════════════════════════════════════════════════════
  // WELCOME MODAL
  // ═══════════════════════════════════════════════════════════════
  if (showWelcome) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-md px-6"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Mode Démo Activé ✨
          </h2>
          <p className="text-white/70 mb-6">
            Explorez toutes les fonctionnalités sans créer de compte. 
            Choisissez un rôle pour commencer l&apos;expérience.
          </p>
          
          <div className="flex gap-2 justify-center">
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse delay-100" />
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse delay-200" />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ROLE SELECTOR
  // ═══════════════════════════════════════════════════════════════
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-orange/20 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="p-6 flex items-center justify-between">
            <button 
              onClick={handleExitDemo}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-sm font-medium">
                Mode Démo
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choisissez votre rôle
              </h1>
              <p className="text-xl text-white/60 max-w-xl">
                Testez l&apos;expérience en tant qu&apos;utilisateur, mécanicien ou entreprise
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
              {/* User Role */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleRoleSelect("user")}
                className="glass rounded-3xl p-8 cursor-pointer group border-2 border-transparent hover:border-brand-orange/50 transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">Utilisateur</h3>
                <p className="text-white/60 text-center mb-4">
                  Demandez de l&apos;aide, achetez des pièces, suivez vos véhicules
                </p>
                <ul className="space-y-2 text-sm text-white/50">
                  <li className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-orange" /> SOS Dépannage
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-orange" /> Marketplace
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-orange" /> Assistant IA
                  </li>
                </ul>
              </motion.div>

              {/* Mechanic Role */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleRoleSelect("mechanic")}
                className="glass rounded-3xl p-8 cursor-pointer group border-2 border-transparent hover:border-brand-orange/50 transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Wrench className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">Mécanicien</h3>
                <p className="text-white/60 text-center mb-4">
                  Recevez des missions, gérez votre planning, encaissez
                </p>
                <ul className="space-y-2 text-sm text-white/50">
                  <li className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-orange" /> Tableau de bord
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-orange" /> Gains en temps réel
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-orange" /> Navigation GPS
                  </li>
                </ul>
              </motion.div>

              {/* Enterprise Role */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleRoleSelect("enterprise")}
                className="glass rounded-3xl p-8 cursor-pointer group border-2 border-transparent hover:border-brand-orange/50 transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">Entreprise</h3>
                <p className="text-white/60 text-center mb-4">
                  Vendez des pièces, gérez votre stock, suivez vos ventes
                </p>
                <ul className="space-y-2 text-sm text-white/50">
                  <li className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-orange" /> Gestion stock
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-orange" /> Commandes
                  </li>
                  <li className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-orange" /> Analytics
                  </li>
                </ul>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-white/40 text-center"
            >
              💡 Cliquez sur un rôle pour explorer l&apos;interface correspondante
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DEMO DASHBOARDS
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-black">
      {/* Demo Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand-orange text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Mode Démo - {selectedRole === "user" ? "Utilisateur" : selectedRole === "mechanic" ? "Mécanicien" : "Entreprise"}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedRole(null)}
            className="text-sm hover:underline"
          >
            Changer de rôle
          </button>
          <button 
            onClick={handleExitDemo}
            className="text-sm hover:underline flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            Quitter
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="pt-14">
        {selectedRole === "user" && <UserDemoDashboard />}
        {selectedRole === "mechanic" && <MechanicDemoDashboard />}
        {selectedRole === "enterprise" && <EnterpriseDemoDashboard />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// USER DEMO DASHBOARD
// ═══════════════════════════════════════════════════════════════
function UserDemoDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const menuItems = [
    { id: "home", icon: MapPin, label: "Accueil", color: "from-blue-500 to-blue-600" },
    { id: "sos", icon: AlertTriangle, label: "SOS", color: "from-red-500 to-red-600" },
    { id: "marketplace", icon: Store, label: "Boutique", color: "from-green-500 to-green-600" },
    { id: "messages", icon: MessageSquare, label: "Messages", color: "from-purple-500 to-purple-600" },
    { id: "profile", icon: UserCircle, label: "Profil", color: "from-gray-500 to-gray-600" },
  ];

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-64 glass border-r border-white/10 p-4 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-8 p-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
            {demoUser.avatar}
          </div>
          <div>
            <p className="text-white font-medium">{demoUser.name}</p>
            <p className="text-white/50 text-sm">Utilisateur</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? "bg-white/10 text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "home" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Bienvenue, {demoUser.name} ! 👋</h2>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: AlertTriangle, label: "SOS Urgent", color: "bg-red-500", desc: "Panée ?" },
                { icon: MapPin, label: "Mécaniciens", color: "bg-blue-500", desc: "5 à 2km" },
                { icon: Store, label: "Pièces", color: "bg-green-500", desc: "-30%" },
                { icon: Wrench, label: "Mes véhicules", color: "bg-purple-500", desc: "2 enregistrés" },
              ].map((action, i) => (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass rounded-2xl p-4 cursor-pointer"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white font-medium">{action.label}</p>
                  <p className="text-white/50 text-sm">{action.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Demo Notice */}
            <div className="glass rounded-2xl p-6 border border-brand-orange/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-orange/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Mode Démo Actif</h3>
                  <p className="text-white/70 mb-4">
                    Vous explorez l&apos;interface utilisateur. En version complète, vous pourriez :
                  </p>
                  <ul className="space-y-2 text-white/60">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                      Appeler un mécanicien en temps réel avec géolocalisation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                      Acheter des pièces et suivre les livraisons
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                      Utiliser l&apos;assistant IA pour diagnostiquer votre véhicule
                    </li>
                  </ul>
                  <Button 
                    onClick={() => router.push("/auth/register")}
                    className="mt-6 bg-brand-orange hover:bg-orange-600"
                  >
                    Créer un vrai compte →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sos" && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">SOS Dépannage</h2>
            <p className="text-white/60 mb-8">
              En mode démo, cette fonction simule une demande d&apos;aide.
              En réalité, un mécanicien serait alerté immédiatement.
            </p>
            <div className="glass rounded-2xl p-6 mb-6">
              <p className="text-white/80 mb-4">Type de panne simulée :</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Pneu crevé", "Batterie morte", "Moteur", "Carburant", "Autre"].map((type) => (
                  <span key={type} className="px-4 py-2 rounded-full bg-white/10 text-white text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <Button className="bg-red-500 hover:bg-red-600 text-white h-14 px-8 text-lg">
              Simuler un appel SOS
            </Button>
          </div>
        )}

        {activeTab === "marketplace" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Marketplace de Pièces</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Filtre à huile", price: "15 000 FCFA", oldPrice: "22 000 FCFA", discount: "-32%" },
                { name: "Plaquettes de frein", price: "45 000 FCFA", oldPrice: "60 000 FCFA", discount: "-25%" },
                { name: "Batterie 12V", price: "85 000 FCFA", oldPrice: "120 000 FCFA", discount: "-29%" },
                { name: "Pneu Michelin", price: "95 000 FCFA", oldPrice: "130 000 FCFA", discount: "-27%" },
                { name: "Alternateur", price: "125 000 FCFA", oldPrice: "180 000 FCFA", discount: "-31%" },
                { name: "Démarreur", price: "110 000 FCFA", oldPrice: "155 000 FCFA", discount: "-29%" },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -5 }}
                  className="glass rounded-2xl p-4"
                >
                  <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mb-4 flex items-center justify-center">
                    <Store className="w-12 h-12 text-white/30" />
                  </div>
                  <h3 className="text-white font-medium mb-2">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">{item.price}</span>
                    <span className="text-white/40 line-through text-sm">{item.oldPrice}</span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                    {item.discount}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Messages</h2>
            <div className="glass rounded-2xl p-4">
              {[
                { name: "Mécano Ahmed", msg: "J'arrive dans 10 min !", time: "14:30", unread: true },
                { name: "Support MecaMaster", msg: "Votre commande a été expédiée", time: "12:15", unread: false },
                { name: "Auto Parts CI", msg: "Promotion sur les filtres ce week-end", time: "Hier", unread: false },
              ].map((chat, i) => (
                <div key={chat.name} className={`flex items-center gap-4 p-4 ${i !== 2 ? "border-b border-white/10" : ""}`}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center text-white font-bold">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">{chat.name}</p>
                      <span className="text-white/40 text-sm">{chat.time}</span>
                    </div>
                    <p className={`text-sm ${chat.unread ? "text-white" : "text-white/50"}`}>
                      {chat.msg}
                    </p>
                  </div>
                  {chat.unread && (
                    <span className="w-2 h-2 bg-brand-orange rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Mon Profil</h2>
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                  {demoUser.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{demoUser.name}</h3>
                  <p className="text-white/60">{demoUser.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                    Utilisateur
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-white/50 text-sm">Interventions</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-white">2</p>
                  <p className="text-white/50 text-sm">Véhicules</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-white/50 text-sm">Commandes</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => router.push("/auth/register")}
              className="w-full bg-brand-orange hover:bg-orange-600"
            >
              Créer un compte réel avec ces données
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MECHANIC DEMO DASHBOARD
// ═══════════════════════════════════════════════════════════════
function MechanicDemoDashboard() {
  const router = useRouter();
  const [earnings] = useState({
    today: 45000,
    week: 285000,
    month: 1250000,
    pending: 125000
  });

  const missions = [
    { id: 1, type: "SOS", client: "Marie K.", service: "Pneu crevé", amount: 15000, status: "pending", location: "2.5 km" },
    { id: 2, type: "RDV", client: "Jean B.", service: "Vidange", amount: 25000, status: "active", location: "5.1 km" },
    { id: 3, type: "SOS", client: "Alice M.", service: "Batterie", amount: 35000, status: "completed", location: "1.8 km" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
            {demoMechanic.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{demoMechanic.name}</h2>
            <p className="text-white/60">{demoMechanic.specialty} • ⭐ {demoMechanic.rating}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass rounded-xl px-4 py-2">
            <p className="text-white/60 text-sm">En ligne</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 font-medium">Disponible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Aujourd'hui", value: earnings.today, color: "from-green-500 to-green-600" },
          { label: "Cette semaine", value: earnings.week, color: "from-blue-500 to-blue-600" },
          { label: "Ce mois", value: earnings.month, color: "from-purple-500 to-purple-600" },
          { label: "En attente", value: earnings.pending, color: "from-yellow-500 to-yellow-600" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -3 }}
            className="glass rounded-2xl p-6"
          >
            <p className="text-white/60 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()} FCFA</p>
            <div className={`w-full h-1 mt-3 rounded-full bg-gradient-to-r ${stat.color}`} />
          </motion.div>
        ))}
      </div>

      {/* Missions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Missions */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Missions</h3>
          <div className="space-y-3">
            {missions.map((mission) => (
              <motion.div
                key={mission.id}
                whileHover={{ x: 5 }}
                className="p-4 bg-white/5 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    mission.type === "SOS" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {mission.type}
                  </span>
                  <span className="text-white/40 text-sm">{mission.location}</span>
                </div>
                <p className="text-white font-medium">{mission.service}</p>
                <p className="text-white/60 text-sm">{mission.client}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-brand-orange font-bold">{mission.amount.toLocaleString()} FCFA</span>
                  <span className={`text-sm ${
                    mission.status === "completed" ? "text-green-400" :
                    mission.status === "active" ? "text-blue-400" : "text-yellow-400"
                  }`}>
                    {mission.status === "completed" ? "✓ Terminé" :
                     mission.status === "active" ? "▶ En cours" : "⏳ En attente"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Zone de couverture</h3>
          <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-brand-orange rounded-full animate-ping" />
              <div className="absolute w-4 h-4 bg-brand-orange rounded-full" />
            </div>
            <div className="absolute top-4 left-4 w-3 h-3 bg-blue-500 rounded-full" />
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-green-500 rounded-full" />
            <div className="absolute top-1/2 right-4 w-3 h-3 bg-yellow-500 rounded-full" />
            <p className="text-white/30 text-sm mt-32">Carte interactive en vraie version</p>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-8 glass rounded-2xl p-6 border border-brand-orange/30">
        <div className="flex items-center gap-4">
          <Sparkles className="w-8 h-8 text-brand-orange" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Mode Démo Mécanicien</h3>
            <p className="text-white/60">
              En version réelle : missions en temps réel, navigation GPS, paiement instantané, chat avec clients.
            </p>
          </div>
          <Button 
            onClick={() => router.push("/auth/register")}
            className="bg-brand-orange hover:bg-orange-600"
          >
            Devenir mécanicien partenaire →
          </Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ENTERPRISE DEMO DASHBOARD
// ═══════════════════════════════════════════════════════════════
function EnterpriseDemoDashboard() {
  const router = useRouter();

  const stats = {
    revenue: 8500000,
    orders: 234,
    stock: 156,
    mechanics: 12
  };

  const products = [
    { name: "Filtre à huile", stock: 45, sold: 123, price: 15000 },
    { name: "Plaquettes frein", stock: 32, sold: 89, price: 45000 },
    { name: "Batterie 12V", stock: 18, sold: 45, price: 85000 },
    { name: "Pneu 205/55R16", stock: 24, sold: 67, price: 95000 },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {demoEnterprise.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{demoEnterprise.company}</h2>
            <p className="text-white/60">Partenaire Premium</p>
          </div>
        </div>
        <Button className="bg-brand-orange hover:bg-orange-600">
          + Ajouter un produit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Chiffre d'affaires", value: `${(stats.revenue / 1000000).toFixed(1)}M FCFA`, icon: "💰" },
          { label: "Commandes", value: stats.orders, icon: "📦" },
          { label: "Produits en stock", value: stats.stock, icon: "📋" },
          { label: "Mécaniciens affiliés", value: stats.mechanics, icon: "🔧" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -3 }}
            className="glass rounded-2xl p-6"
          >
            <p className="text-3xl mb-2">{stat.icon}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/60 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Products Table */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Gestion des stocks</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/60 font-medium">Produit</th>
                <th className="text-center py-3 px-4 text-white/60 font-medium">Stock</th>
                <th className="text-center py-3 px-4 text-white/60 font-medium">Vendus</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">Prix</th>
                <th className="text-right py-3 px-4 text-white/60 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name} className="border-b border-white/5">
                  <td className="py-4 px-4 text-white">{product.name}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      product.stock > 20 ? "bg-green-500/20 text-green-400" :
                      product.stock > 10 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {product.stock} unités
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-white/60">{product.sold}</td>
                  <td className="py-4 px-4 text-right text-brand-orange font-medium">
                    {product.price.toLocaleString()} FCFA
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      Modifier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-8 glass rounded-2xl p-6 border border-brand-orange/30">
        <div className="flex items-center gap-4">
          <Sparkles className="w-8 h-8 text-brand-orange" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Mode Démo Entreprise</h3>
            <p className="text-white/60">
              En version réelle : gestion complète des commandes, paiements automatiques, analytics avancés, API mécaniciens.
            </p>
          </div>
          <Button 
            onClick={() => router.push("/auth/register")}
            className="bg-brand-orange hover:bg-orange-600"
          >
            Devenir partenaire →
          </Button>
        </div>
      </div>
    </div>
  );
}
