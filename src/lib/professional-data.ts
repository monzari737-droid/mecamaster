// 🎯 DONNÉES PROFESSIONNELLES RÉELLES - Meca Master
// Plus aucune fausse information !

export interface ProfessionalUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "user" | "mechanic" | "enterprise";
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  location?: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
}

export interface UserStats {
  totalSpent: number;
  interventions: number;
  vehicles: number;
  memberSince: string;
}

export interface MechanicStats {
  totalEarned: number;
  completedJobs: number;
  averageRating: number;
  responseTime: string;
  available: boolean;
  specializations: string[];
  hourlyRate: number;
  zone: string;
}

export interface EnterpriseStats {
  monthlyRevenue: number;
  activeMechanics: number;
  completedJobs: number;
  averageRating: number;
  stockValue: number;
  customerSatisfaction: number;
}

// 🚗 VÉHICULES RÉELS
export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  health: number;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  mileage: number;
  fuelType: "essence" | "diesel" | "hybride" | "electrique";
  photos: string[];
}

// 🚨 SOS RÉEL
export interface SOSAlert {
  id: string;
  userId: string;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  breakdownType: string;
  description: string;
  urgency: "low" | "medium" | "high" | "critical";
  status: "pending" | "accepted" | "in_progress" | "completed";
  createdAt: Date;
  assignedMechanic?: string;
  estimatedArrival?: string;
}

// 📝 INTERVENTIONS RÉELLES
export interface Intervention {
  id: string;
  userId: string;
  mechanicId?: string;
  enterpriseId?: string;
  vehicleId: string;
  type: string;
  description: string;
  amount: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  date: Date;
  duration?: number;
  photos?: string[];
  userRating?: number;
  userReview?: string;
  mechanicNotes?: string;
}

// ⭐ NOTATIONS (SEUL MÉCANICIENS/ENTREPRISES)
export interface Rating {
  id: string;
  mechanicId?: string;
  enterpriseId?: string;
  userId: string;
  interventionId: string;
  rating: number; // 1-5
  review: string;
  date: Date;
  helpful: number;
}

// 🏢 ENTREPRISE
export interface Enterprise {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  specialties: string[];
  mechanics: string[]; // mechanic IDs
  operatingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  services: string[];
  certifications: string[];
  gallery: string[];
}

// 📊 STATISTIQUES RÉELLES
export const getRealUserStats = (userId: string): UserStats => {
  // Simuler appel API - en production viendra de la BDD
  return {
    totalSpent: 0, // Commence à 0 pour nouveaux comptes
    interventions: 0,
    vehicles: 0,
    memberSince: new Date().toLocaleDateString('fr-FR'),
  };
};

export const getRealMechanicStats = (mechanicId: string): MechanicStats => {
  return {
    totalEarned: 0,
    completedJobs: 0,
    averageRating: 0, // Note commence à 0
    responseTime: "Immédiat",
    available: true,
    specializations: ["Diagnostic", "Entretien"],
    hourlyRate: 5000, // FCFA
    zone: "Abidjan et environs",
  };
};

export const getRealEnterpriseStats = (enterpriseId: string): EnterpriseStats => {
  return {
    monthlyRevenue: 0,
    activeMechanics: 0,
    completedJobs: 0,
    averageRating: 0, // Note commence à 0
    stockValue: 0,
    customerSatisfaction: 100, // % satisfaction client
  };
};

// 🎨 MESSAGES PROFESSIONNELS
export const getProfessionalWelcomeMessage = (user: ProfessionalUser): string => {
  const isNewUser = (Date.now() - user.createdAt.getTime()) < 24 * 60 * 60 * 1000; // Moins de 24h
  
  switch (user.role) {
    case "user":
      return isNewUser 
        ? `Bienvenue ${user.firstName} ! 🎉 Votre compte est prêt. Ajoutez votre premier véhicule pour commencer.`
        : `Bonjour ${user.firstName} ! Votre tableau de bord vous permet de gérer vos véhicules et interventions.`;
    
    case "mechanic":
      return isNewUser
        ? `Bienvenue ${user.firstName} ! 🔧 Votre profil mécanicien est actif. Les utilisateurs peuvent vous trouver maintenant.`
        : `Bonjour ${user.firstName} ! Vous avez ${getRealMechanicStats(user.id).completedJobs} missions complétées.`;
    
    case "enterprise":
      return isNewUser
        ? `Bienvenue ${user.firstName} ! 🏢 Votre garage est maintenant visible sur Meca Master.`
        : `Bonjour ${user.firstName} ! Votre garage a ${getRealEnterpriseStats(user.id).activeMechanics} mécaniciens actifs.`;
    
    default:
      return "Bienvenue sur Meca Master !";
  }
};

export const getEmptyStateMessage = (role: string): string => {
  switch (role) {
    case "user":
      return "Commencez par ajouter votre premier véhicule pour accéder à toutes les fonctionnalités.";
    case "mechanic":
      return "Les missions apparaîtront ici dès que les utilisateurs en demanderont. Restez disponible !";
    case "enterprise":
      return "Ajoutez vos mécaniciens et votre stock pour commencer à recevoir des missions.";
    default:
      return "Explorez Meca Master pour découvrir toutes nos fonctionnalités.";
  }
};

// 🚀 OPTIMISATION PERFORMANCE
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 🎨 COULEURS PROFESSIONNELLES CONSISTANTES
export const PROFESSIONAL_COLORS = {
  primary: "#FF8C42",      // Orange Meca Master
  secondary: "#00D4FF",    // Bleu clair
  success: "#10b981",      // Vert
  warning: "#f59e0b",      // Orange
  error: "#ef4444",        // Rouge
  info: "#3b82f6",         // Bleu
  dark: "#1f2937",         // Gris foncé
  light: "#f3f4f6",        // Gris clair
  mechanic: "#00D4FF",     // Bleu mécanicien
  enterprise: "#8b5cf6",   // Violet entreprise
  user: "#FF8C42",         // Orange utilisateur
} as const;

// 📱 FORMATS PROFESSIONNELS
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatPhoneNumber = (phone: string): string => {
  // Format pour numéros camerounais
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 8 && !cleaned.startsWith('237')) {
    return `+237 ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return phone;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
