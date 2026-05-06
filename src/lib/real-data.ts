// Données RÉELLES pour Meca Master
// Remplace les fausses informations par des données dynamiques

export interface RealUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "mechanic" | "enterprise";
  createdAt: Date;
  lastLogin: Date;
  // Stats RÉELLES (initialisées à 0)
  totalSpent: number;
  interventions: number;
  savings: number;
  rating: number;
  // Véhicules RÉELS
  vehicles: RealVehicle[];
}

export interface RealVehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  health: number;
  createdAt: Date;
  lastMaintenance?: Date;
}

export interface RealIntervention {
  id: string;
  userId: string;
  mechanicId: string;
  type: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  date: Date;
  description: string;
}

// Fonctions pour données RÉELLES
export const createNewUser = (userData: Partial<RealUserData>): RealUserData => {
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    role: userData.role || "user",
    createdAt: new Date(),
    lastLogin: new Date(),
    // Stats RÉELLES - commencent à 0
    totalSpent: 0,
    interventions: 0,
    savings: 0,
    rating: 0,
    vehicles: [],
  };
};

export const addVehicle = (userId: string, vehicleData: Omit<RealVehicle, 'id' | 'userId' | 'createdAt'>): RealVehicle => {
  return {
    id: `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    ...vehicleData,
    createdAt: new Date(),
  };
};

export const addIntervention = (interventionData: Omit<RealIntervention, 'id' | 'date'>): RealIntervention => {
  return {
    id: `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date(),
    ...interventionData,
  };
};

// Calculs RÉELS des stats
export const calculateUserStats = (user: RealUserData, interventions: RealIntervention[]) => {
  const completedInterventions = interventions.filter(i => i.status === "completed" && i.userId === user.id);
  
  const totalSpent = completedInterventions.reduce((sum, i) => sum + i.amount, 0);
  const savings = totalSpent * 0.1; // 10% d'économies estimées
  const rating = completedInterventions.length > 0 
    ? completedInterventions.reduce((sum, i) => sum + (i.rating || 0), 0) / completedInterventions.length 
    : 0;

  return {
    totalSpent,
    interventions: completedInterventions.length,
    savings,
    rating: parseFloat(rating.toFixed(1)),
  };
};

// Messages RÉELS et professionnels
export const getWelcomeMessage = (user: RealUserData) => {
  const daysSinceCreation = Math.floor((new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceCreation === 0) {
    return `Bienvenue ${user.firstName} ! 🎉 Votre compte vient d'être créé. Ajoutez votre premier véhicule pour commencer.`;
  } else if (user.interventions === 0) {
    return `Bonjour ${user.firstName} ! Vous êtes avec nous depuis ${daysSinceCreation} jour(s). Prêt à prendre soin de votre véhicule ?`;
  } else {
    return `Bonjour ${user.firstName} ! Vous avez effectué ${user.interventions} intervention(s) avec nous. Merci pour votre confiance !`;
  }
};

export const getEmptyStateMessage = (user: RealUserData) => {
  switch (user.role) {
    case "user":
      return "Vous n'avez pas encore de véhicule. Ajoutez votre premier véhicule pour accéder à toutes les fonctionnalités.";
    case "mechanic":
      return "Aucune mission disponible pour le moment. Vos disponibilités sont visibles par les utilisateurs.";
    case "enterprise":
      return "Votre garage est prêt. Ajoutez vos mécaniciens et votre stock pour commencer à recevoir des missions.";
    default:
      return "Commencez à utiliser Meca Master pour découvrir toutes nos fonctionnalités.";
  }
};
