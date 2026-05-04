/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                         🧠 MECA MASTER - CERVEAU CENTRAL                       ║
 * ║                      Fichier de connexion et logique globale                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Ce fichier est le CŒUR de l'application. Il connecte:
 * - La base de données (Supabase)
 * - L'authentification
 * - Les rôles (User, Mechanic, Enterprise)
 * - Les API externes (Maps, AI, Notifications)
 * - Les utilitaires globaux
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: CONFIGURATION GLOBALE
// ═══════════════════════════════════════════════════════════════════════════════

export const APP_CONFIG = {
  name: "Meca Master",
  version: "1.0.0",
  description: "Votre mécanicien en un clic",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Couleurs par rôle
  colors: {
    global: { primary: "#FF8C42", secondary: "#FFFFFF" },
    user: { primary: "#2ECC71", secondary: "#FFFFFF" },      // Vert
    mechanic: { primary: "#3498DB", secondary: "#FFFFFF" }, // Bleu
    enterprise: { primary: "#E67E22", secondary: "#FFFFFF" }, // Orange
  },
  
  // Limites et seuils
  limits: {
    sosSearchRadius: [5, 10, 20, 50], // km
    mechanicDebtThreshold: -25000,    // FCFA
    mechanicBlockThreshold: -50000,   // FCFA
    commissionRate: 0.10,              // 10%
  },
  
  // Prix abonnements
  subscriptions: {
    mechanic: {
      visibility: { price: 500, name: "Visibilité Basique" },
      premium: { price: 1000, name: "Visibilité Premium" },
    },
    enterprise: {
      visibility: { price: 500, name: "Visibilité Basique" },
      premium: { price: 1000, name: "Visibilité Premium" },
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: TYPES ET INTERFACES CENTRAUX
// ═══════════════════════════════════════════════════════════════════════════════

export type UserRole = "user" | "mechanic" | "enterprise" | "admin";

export type MissionStatus = 
  | "pending"      // En attente d'acceptation
  | "accepted"     // Acceptée par mécanicien
  | "en_route"     // Mécanicien en déplacement
  | "arrived"      // Mécanicien sur place
  | "in_progress"  // Intervention en cours
  | "completed"    // Terminée
  | "cancelled";   // Annulée

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: FONCTIONS CERVEAU - CONNEXION ENTRE MODULES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Détermine le rôle actif et retourne la configuration associée
 * C'est la fonction CENTRALE de routing
 */
export function getRoleConfig(role: UserRole) {
  const configs = {
    user: {
      dashboard: "/dashboard",
      color: APP_CONFIG.colors.user.primary,
      navItems: [
        { href: "/dashboard", label: "Accueil", icon: "Home" },
        { href: "/mechanics", label: "Mécaniciens", icon: "Users" },
        { href: "/sos", label: "SOS", icon: "AlertCircle", isSOS: true },
        { href: "/marketplace", label: "Marché", icon: "ShoppingBag" },
        { href: "/profile", label: "Profil", icon: "UserCircle" },
      ],
      features: ["sos", "mechanic_search", "marketplace", "vehicle_tracking"],
    },
    mechanic: {
      dashboard: "/mechanic-dashboard",
      color: APP_CONFIG.colors.mechanic.primary,
      navItems: [
        { href: "/mechanic-dashboard", label: "Dashboard", icon: "Home" },
        { href: "/missions", label: "Missions", icon: "AlertCircle" },
        { href: "/enterprises", label: "Entreprises", icon: "Building" },
        { href: "/profile", label: "Profil", icon: "UserCircle" },
      ],
      features: ["accept_sos", "manage_earnings", "enterprise_affiliation"],
    },
    enterprise: {
      dashboard: "/enterprise-dashboard",
      color: APP_CONFIG.colors.enterprise.primary,
      navItems: [
        { href: "/enterprise-dashboard", label: "Dashboard", icon: "Home" },
        { href: "/mechanics", label: "Mécaniciens", icon: "Users" },
        { href: "/stock", label: "Stock", icon: "Package" },
        { href: "/sales", label: "Ventes", icon: "ShoppingCart" },
        { href: "/profile", label: "Profil", icon: "UserCircle" },
      ],
      features: ["manage_mechanics", "manage_stock", "manage_orders", "analytics"],
    },
    admin: {
      dashboard: "/admin",
      color: "#9B59B6",
      navItems: [],
      features: ["all"],
    },
  };
  
  return configs[role];
}

/**
 * Fonction CENTRALE: Détermine où rediriger l'utilisateur
 * Selon son rôle et son état de validation
 */
export function getRedirectPath(options: {
  role: UserRole;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  hasActiveSubscription?: boolean;
  debtAmount?: number;
}): string {
  const { 
    role, 
    isAuthenticated, 
    isEmailVerified, 
    isProfileComplete,
    debtAmount = 0 
  } = options;
  
  // Non connecté → Login
  if (!isAuthenticated) return "/auth/login";
  
  // Email non vérifié → Vérification
  if (!isEmailVerified) return "/auth/verify-email";
  
  // Profil incomplet → Complétion profil
  if (!isProfileComplete) return "/auth/complete-profile";
  
  // Dette critique → Page de paiement
  if (debtAmount < APP_CONFIG.limits.mechanicBlockThreshold) {
    return "/payment/required";
  }
  
  // Dette alerte → Avertissement
  if (debtAmount < APP_CONFIG.limits.mechanicDebtThreshold) {
    return "/payment/warning";
  }
  
  // Tout est OK → Dashboard selon le rôle
  return getRoleConfig(role).dashboard;
}

/**
 * Calcule le prix estimé d'une mission SOS
 * Basé sur distance, type de panne, et tarif horaire
 */
export function calculateMissionPrice(params: {
  distance: number;
  mechanicHourlyRate: number;
  breakdownType: string;
  estimatedDuration: number; // minutes
}): { total: number; breakdown: { travel: number; labor: number; commission: number } } {
  const { distance, mechanicHourlyRate, estimatedDuration } = params;
  
  // Prix déplacement: 500 FCFA/km
  const travelCost = distance * 500;
  
  // Prix main d'œuvre
  const hours = estimatedDuration / 60;
  const laborCost = hours * mechanicHourlyRate;
  
  // Sous-total
  const subtotal = travelCost + laborCost;
  
  // Commission Meca Master (10%)
  const commission = subtotal * APP_CONFIG.limits.commissionRate;
  
  // Total client
  const total = subtotal + commission;
  
  return {
    total: Math.round(total),
    breakdown: {
      travel: Math.round(travelCost),
      labor: Math.round(laborCost),
      commission: Math.round(commission),
    },
  };
}

/**
 * Algorithme de matching: Trouve le meilleur mécanicien
 * Basé sur: distance, disponibilité, spécialisation, note
 */
export function findBestMechanic(options: {
  mechanics: Array<{
    id: string;
    distance: number;
    isAvailable: boolean;
    rating: number;
    specializations: string[];
    currentDebt: number;
  }>;
  breakdownType: string;
  maxDistance: number;
}): string | null {
  const { mechanics, breakdownType, maxDistance } = options;
  
  // Filtrer les mécaniciens éligibles
  const eligible = mechanics.filter(m => 
    m.distance <= maxDistance &&
    m.isAvailable &&
    m.currentDebt > APP_CONFIG.limits.mechanicDebtThreshold
  );
  
  if (eligible.length === 0) return null;
  
  // Score chaque mécanicien
  const scored = eligible.map(m => {
    let score = 0;
    
    // Distance (plus près = meilleur)
    score += (1 - m.distance / maxDistance) * 40;
    
    // Note (0-5 étoiles)
    score += (m.rating / 5) * 30;
    
    // Spécialisation matching
    if (m.specializations.some(s => 
      breakdownType.toLowerCase().includes(s.toLowerCase())
    )) {
      score += 30;
    }
    
    return { id: m.id, score };
  });
  
  // Retourner le meilleur
  scored.sort((a, b) => b.score - a.score);
  return scored[0].id;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: UTILITAIRES INTELLIGENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Génère un message IA personnalisé selon le contexte
 */
export function generateAIContext(userRole: UserRole, context: string): string {
  const contexts: Record<UserRole, Record<string, string>> = {
    user: {
      sos: "Je suis un utilisateur en panne et j'ai besoin d'aide urgente.",
      mechanic_search: "Je cherche un mécanicien de confiance.",
      marketplace: "Je veux acheter des pièces pour ma voiture.",
      vehicle_health: "Je veux comprendre l'état de mon véhicule.",
    },
    mechanic: {
      mission: "Je suis mécanicien et je veux accepter une mission.",
      earnings: "Je veux comprendre mes revenus.",
      subscription: "Je veux améliorer ma visibilité.",
    },
    enterprise: {
      stock: "Je gère un stock de pièces.",
      mechanics: "Je veux recruter des mécaniciens.",
      orders: "J'ai des commandes à traiter.",
    },
    admin: {
      moderation: "Je modère la plateforme.",
      analytics: "Je regarde les statistiques globales.",
    },
  };
  
  return contexts[userRole]?.[context] || "";
}

/**
 * Vérifie si une action est autorisée pour un rôle
 */
export function isActionAuthorized(
  userRole: UserRole,
  action: string
): boolean {
  const permissions: Record<UserRole, string[]> = {
    user: ["create_sos", "view_mechanics", "buy_products", "rate_mission"],
    mechanic: ["accept_sos", "update_location", "view_earnings", "apply_enterprise"],
    enterprise: ["manage_stock", "manage_orders", "recruit_mechanics", "view_analytics"],
    admin: ["*"], // Tout
  };
  
  if (userRole === "admin") return true;
  return permissions[userRole]?.includes(action) || false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: EXPORT CENTRAL
// ═══════════════════════════════════════════════════════════════════════════════

// Réexporte tout depuis un point central
export * from "./utils";
export * from "./db/schema";
export * from "./supabase";

// Constantes globales
export const CONSTANTS = {
  APP_CONFIG,
  ROLES: ["user", "mechanic", "enterprise", "admin"] as const,
  MISSION_STATUSES: [
    "pending", "accepted", "en_route", "arrived", 
    "in_progress", "completed", "cancelled"
  ] as const,
  ORDER_STATUSES: [
    "pending", "confirmed", "preparing", 
    "shipped", "delivered", "cancelled"
  ] as const,
};

// Message de confirmation
console.log("🧠 Meca Master Brain loaded successfully!");
