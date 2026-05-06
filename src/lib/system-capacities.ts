// 📊 CAPACITÉS SYSTÈME - Meca Master
// Limites, performances et scalabilité

import { useState, useEffect } from "react";

export interface SystemCapacity {
  // Utilisateurs
  maxConcurrentUsers: number;
  maxDailyRegistrations: number;
  maxRequestsPerUserPerDay: number;
  
  // Session
  maxSessionDuration: number; // en jours
  maxDevicesPerUser: number;
  
  // Base de données
  maxDatabaseConnections: number;
  maxStoragePerUser: number; // en MB
  
  // API
  maxRequestsPerSecond: number;
  maxFileSizeUpload: number; // en MB
  
  // Géolocalisation
  maxTrackedLocations: number;
  locationUpdateInterval: number; // en secondes
  
  // Notifications
  maxNotificationsPerUserPerDay: number;
  maxPushNotificationsPerMinute: number;
}

export interface CurrentUsage {
  activeUsers: number;
  todayRegistrations: number;
  requestsToday: number;
  storageUsed: number;
  databaseConnections: number;
  trackedLocations: number;
  notificationsSent: number;
}

export interface PerformanceMetrics {
  averageResponseTime: number; // en ms
  uptime: number; // en %
  errorRate: number; // en %
  cpuUsage: number; // en %
  memoryUsage: number; // en %
  diskUsage: number; // en %
}

// 🚀 CAPACITÉS ACTUELLES (Phase 1 - Vercel + Neon)
export const SYSTEM_CAPACITIES: SystemCapacity = {
  // Utilisateurs
  maxConcurrentUsers: 1000, // 1000 utilisateurs simultanés
  maxDailyRegistrations: 500, // 500 nouvelles inscriptions/jour
  maxRequestsPerUserPerDay: 1000, // 1000 requêtes/utilisateur/jour
  
  // Session
  maxSessionDuration: 30, // 30 jours
  maxDevicesPerUser: 5, // 5 appareils maximum par utilisateur
  
  // Base de données (Neon PostgreSQL)
  maxDatabaseConnections: 100, // 100 connexions simultanées
  maxStoragePerUser: 50, // 50 MB par utilisateur
  
  // API (Vercel Functions)
  maxRequestsPerSecond: 100, // 100 requêtes/seconde
  maxFileSizeUpload: 10, // 10 MB max par fichier
  
  // Géolocalisation
  maxTrackedLocations: 500, // 500 positions suivies simultanément
  locationUpdateInterval: 30, // Mise à jour toutes les 30 secondes
  
  // Notifications
  maxNotificationsPerUserPerDay: 50, // 50 notifications/utilisateur/jour
  maxPushNotificationsPerMinute: 100, // 100 push/minute
};

// 📈 UTILISATION ACTUELLE (simulation)
export const getCurrentUsage = (): CurrentUsage => {
  return {
    activeUsers: 0, // Commence à 0
    todayRegistrations: 0,
    requestsToday: 0,
    storageUsed: 0,
    databaseConnections: 1, // Connection admin
    trackedLocations: 0,
    notificationsSent: 0
  };
};

// 🎯 MÉTRIQUES DE PERFORMANCE
export const getPerformanceMetrics = (): PerformanceMetrics => {
  return {
    averageResponseTime: 250, // 250ms
    uptime: 99.9, // 99.9%
    errorRate: 0.1, // 0.1%
    cpuUsage: 15, // 15%
    memoryUsage: 25, // 25%
    diskUsage: 10 // 10%
  };
};

// 📊 CALCUL CAPACITÉ RESTANTE
export const getRemainingCapacity = (currentUsage: CurrentUsage) => {
  const capacities = SYSTEM_CAPACITIES;
  
  return {
    remainingUsers: capacities.maxConcurrentUsers - currentUsage.activeUsers,
    remainingRegistrations: capacities.maxDailyRegistrations - currentUsage.todayRegistrations,
    remainingRequests: capacities.maxRequestsPerUserPerDay - (currentUsage.requestsToday / Math.max(currentUsage.activeUsers, 1)),
    remainingStorage: capacities.maxStoragePerUser - currentUsage.storageUsed,
    remainingConnections: capacities.maxDatabaseConnections - currentUsage.databaseConnections,
    remainingLocations: capacities.maxTrackedLocations - currentUsage.trackedLocations,
    remainingNotifications: capacities.maxNotificationsPerUserPerDay - (currentUsage.notificationsSent / Math.max(currentUsage.activeUsers, 1))
  };
};

// 🚨 ALERTES CAPACITÉ
export const checkCapacityAlerts = (currentUsage: CurrentUsage) => {
  const remaining = getRemainingCapacity(currentUsage);
  const alerts: string[] = [];
  
  if (remaining.remainingUsers < 100) {
    alerts.push("⚠️ Capacité utilisateurs bientôt atteinte");
  }
  
  if (remaining.remainingRegistrations < 50) {
    alerts.push("⚠️ Limite d'inscriptions journalière approche");
  }
  
  if (remaining.remainingStorage < 10) {
    alerts.push("⚠️ Espace de stockage presque plein");
  }
  
  if (remaining.remainingConnections < 10) {
    alerts.push("⚠️ Connexions base de données critiques");
  }
  
  return alerts;
};

// 📈 PROJECTIONS CROISSANCE
export const getGrowthProjections = (currentUsage: CurrentUsage, months: number = 6) => {
  const monthlyGrowthRate = 0.15; // 15% de croissance par mois
  
  return {
    projectedUsers: Math.round(currentUsage.activeUsers * Math.pow(1 + monthlyGrowthRate, months)),
    projectedRegistrations: Math.round(currentUsage.todayRegistrations * Math.pow(1 + monthlyGrowthRate, months)),
    projectedStorage: Math.round(currentUsage.storageUsed * Math.pow(1 + monthlyGrowthRate, months)),
    projectedRequests: Math.round(currentUsage.requestsToday * Math.pow(1 + monthlyGrowthRate, months))
  };
};

// 🎯 RECOMMANDATIONS SCALABILITÉ
export const getScalingRecommendations = (currentUsage: CurrentUsage) => {
  const recommendations: string[] = [];
  const usagePercentage = (currentUsage.activeUsers / SYSTEM_CAPACITIES.maxConcurrentUsers) * 100;
  
  if (usagePercentage > 80) {
    recommendations.push("🚀 UPGRADE NÉCESSAIRE : Passer à Vercel Pro");
    recommendations.push("🗄️ Ajouter des connexions base de données");
    recommendations.push("📦 Implémenter un CDN pour les images");
  } else if (usagePercentage > 60) {
    recommendations.push("⚡ OPTIMISATION : Cache Redis recommandé");
    recommendations.push("📊 Monitoring avancé des performances");
  } else if (usagePercentage > 40) {
    recommendations.push("🔧 PRÉPARATION : Planifier upgrade infrastructure");
  } else {
    recommendations.push("✅ CAPACITÉ OK : Système stable et performant");
  }
  
  return recommendations;
};

// 💰 COÛTS MENSUELS ESTIMÉS (Phase 1)
export const getMonthlyCosts = () => {
  return {
    vercel: {
      plan: "Pro",
      cost: 20, // $20/month
      bandwidth: "100GB",
      functions: "100k invocations"
    },
    neon: {
      plan: "Scale",
      cost: 29, // $29/month  
      storage: "3GB",
      compute: "1 CPU"
    },
    pushNotifications: {
      provider: "Firebase",
      cost: 0, // Gratuit jusqu'à 10k notifications
      limit: "10k notifications/mois"
    },
    total: 49, // $49 total
    currency: "USD"
  };
};

// 📊 RAPPORT COMPLET SYSTÈME
export const generateSystemReport = () => {
  const currentUsage = getCurrentUsage();
  const performance = getPerformanceMetrics();
  const remaining = getRemainingCapacity(currentUsage);
  const alerts = checkCapacityAlerts(currentUsage);
  const recommendations = getScalingRecommendations(currentUsage);
  const costs = getMonthlyCosts();
  
  return {
    timestamp: new Date(),
    capacities: SYSTEM_CAPACITIES,
    usage: currentUsage,
    performance,
    remaining,
    alerts,
    recommendations,
    costs,
    status: alerts.length === 0 ? "healthy" : "warning"
  };
};

// 🎯 Hook React pour monitoring système
export const useSystemMonitoring = () => {
  const [systemReport, setSystemReport] = useState(generateSystemReport());
  const [isLoading, setIsLoading] = useState(false);

  // Rafraîchir le rapport toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemReport(generateSystemReport());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshReport = async () => {
    setIsLoading(true);
    // Simuler appel API pour stats réelles
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSystemReport(generateSystemReport());
    setIsLoading(false);
  };

  return {
    systemReport,
    isLoading,
    refreshReport,
    isHealthy: systemReport.status === "healthy",
    capacityUsage: {
      users: (systemReport.usage.activeUsers / systemReport.capacities.maxConcurrentUsers) * 100,
      storage: (systemReport.usage.storageUsed / systemReport.capacities.maxStoragePerUser) * 100,
      connections: (systemReport.usage.databaseConnections / systemReport.capacities.maxDatabaseConnections) * 100
    }
  };
};

// 🚀 SCÉNARIOS DE CHARGE
export const getLoadScenarios = () => {
  return {
    light: {
      users: 50,
      requestsPerSecond: 10,
      description: "Lancement initial - Test beta"
    },
    moderate: {
      users: 200,
      requestsPerSecond: 25,
      description: "Premiers mois - Croissance modérée"
    },
    heavy: {
      users: 500,
      requestsPerSecond: 50,
      description: "Maturité - Forte demande"
    },
    peak: {
      users: 1000,
      requestsPerSecond: 100,
      description: "Pic - Limite actuelle du système"
    }
  };
};

// 📈 MÉTRIQUES UTILISATEUR
export const getUserMetrics = (userId: string) => {
  // Simuler récupération métriques utilisateur
  return {
    requestsToday: Math.floor(Math.random() * 50),
    storageUsed: Math.floor(Math.random() * 10), // MB
    lastLogin: new Date(),
    sessionDuration: Math.floor(Math.random() * 120), // minutes
    devicesUsed: Math.floor(Math.random() * 3) + 1,
    notificationsReceived: Math.floor(Math.random() * 20)
  };
};

export default {
  SYSTEM_CAPACITIES,
  getCurrentUsage,
  getPerformanceMetrics,
  getRemainingCapacity,
  checkCapacityAlerts,
  getGrowthProjections,
  getScalingRecommendations,
  getMonthlyCosts,
  generateSystemReport,
  getLoadScenarios,
  getUserMetrics
};
