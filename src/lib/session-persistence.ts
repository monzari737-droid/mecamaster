// 🔐 PERSISTANCE SESSION NAVIGATEUR - Meca Master
// Garde la connexion active même après fermeture du navigateur

import { useState, useEffect } from "react";

import { type ProfessionalUser } from "./professional-data";

export interface SessionData {
  user: ProfessionalUser;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  lastActivity: Date;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
    timezone: string;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    notifications: boolean;
    location: boolean;
    language: string;
  };
}

export interface DeviceSession {
  sessionId: string;
  deviceName: string;
  deviceType: "mobile" | "tablet" | "desktop";
  lastSeen: Date;
  isActive: boolean;
  location?: {
    city: string;
    country: string;
  };
}

class SessionPersistence {
  private readonly SESSION_KEY = "mecamaster_session";
  private readonly DEVICE_SESSIONS_KEY = "mecamaster_devices";
  private readonly PREFERENCES_KEY = "mecamaster_preferences";
  private readonly MAX_SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 jours
  private readonly INACTIVITY_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 jours d'inactivité

  // 💾 Sauvegarder la session
  saveSession(sessionData: Omit<SessionData, "expiresAt" | "lastActivity">): void {
    const session: SessionData = {
      ...sessionData,
      expiresAt: new Date(Date.now() + this.MAX_SESSION_DURATION),
      lastActivity: new Date(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    // Chiffrer les données sensibles (simulation)
    const encryptedSession = this.encryptSession(session);
    
    // Sauvegarder dans localStorage
    localStorage.setItem(this.SESSION_KEY, encryptedSession);
    
    // Sauvegarder dans sessionStorage (backup)
    sessionStorage.setItem(this.SESSION_KEY, encryptedSession);
    
    // Ajouter cette session à la liste des appareils
    this.addDeviceSession(session);
    
    console.log("✅ Session sauvegardée pour", session.user.email);
  }

  // 🔓 Charger la session
  loadSession(): SessionData | null {
    try {
      // Essayer localStorage d'abord
      let encryptedSession = localStorage.getItem(this.SESSION_KEY);
      
      // Si pas dans localStorage, essayer sessionStorage
      if (!encryptedSession) {
        encryptedSession = sessionStorage.getItem(this.SESSION_KEY);
      }
      
      if (!encryptedSession) {
        return null;
      }

      // Déchiffrer la session
      const session = this.decryptSession(encryptedSession);
      
      // Vérifier si la session est expirée
      if (this.isSessionExpired(session)) {
        this.clearSession();
        return null;
      }

      // Mettre à jour la dernière activité
      session.lastActivity = new Date();
      this.updateSession(session);
      
      console.log("✅ Session chargée pour", session.user.email);
      return session;
      
    } catch (error) {
      console.error("❌ Erreur chargement session:", error);
      this.clearSession();
      return null;
    }
  }

  // 🔄 Mettre à jour la session
  updateSession(partialData: Partial<SessionData>): void {
    const currentSession = this.loadSession();
    if (!currentSession) return;

    const updatedSession: SessionData = {
      ...currentSession,
      ...partialData,
      lastActivity: new Date()
    };

    const encryptedSession = this.encryptSession(updatedSession);
    localStorage.setItem(this.SESSION_KEY, encryptedSession);
    sessionStorage.setItem(this.SESSION_KEY, encryptedSession);
  }

  // 🗑️ Supprimer la session
  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    console.log("🗑️ Session supprimée");
  }

  // 🔍 Vérifier si une session existe
  hasActiveSession(): boolean {
    const session = this.loadSession();
    return session !== null;
  }

  // ⏰ Vérifier si la session est expirée
  private isSessionExpired(session: SessionData): boolean {
    const now = new Date();
    
    // Vérifier la date d'expiration
    if (now > session.expiresAt) {
      return true;
    }
    
    // Vérifier le timeout d'inactivité
    const inactivityTime = now.getTime() - session.lastActivity.getTime();
    if (inactivityTime > this.INACTIVITY_TIMEOUT) {
      return true;
    }
    
    return false;
  }

  // 🔐 Chiffrement simple (simulation - en production utiliser crypto-js ou similaire)
  private encryptSession(session: SessionData): string {
    // Pour l'instant, simple base64 - À améliorer avec vrai chiffrement
    return btoa(JSON.stringify(session));
  }

  // 🔐 Déchiffrement simple
  private decryptSession(encryptedSession: string): SessionData {
    // Pour l'instant, simple base64 - À améliorer avec vrai chiffrement
    return JSON.parse(atob(encryptedSession));
  }

  // 📱 Gestion des sessions multiples appareils
  private addDeviceSession(session: SessionData): void {
    const deviceSessions: DeviceSession[] = this.getDeviceSessions();
    
    const deviceId = this.generateDeviceId();
    const deviceName = this.getDeviceName();
    const deviceType = this.getDeviceType();
    
    const newDevice: DeviceSession = {
      sessionId: session.token,
      deviceName,
      deviceType,
      lastSeen: new Date(),
      isActive: true,
      location: {
        city: "Abidjan", // Sera déterminé par IP ou géolocalisation
        country: "Cameroun"
      }
    };

    // Vérifier si cet appareil existe déjà
    const existingIndex = deviceSessions.findIndex(d => d.deviceName === deviceName);
    
    if (existingIndex >= 0) {
      deviceSessions[existingIndex] = newDevice;
    } else {
      deviceSessions.push(newDevice);
    }

    // Limiter à 5 appareils maximum
    if (deviceSessions.length > 5) {
      deviceSessions.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
      deviceSessions.splice(5); // Garder les 5 plus récents
    }

    localStorage.setItem(this.DEVICE_SESSIONS_KEY, JSON.stringify(deviceSessions));
  }

  // 📱 Obtenir toutes les sessions appareils
  getDeviceSessions(): DeviceSession[] {
    try {
      const sessions = localStorage.getItem(this.DEVICE_SESSIONS_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch {
      return [];
    }
  }

  // 📱 Supprimer une session appareil spécifique
  removeDeviceSession(sessionId: string): void {
    const sessions = this.getDeviceSessions();
    const filtered = sessions.filter(s => s.sessionId !== sessionId);
    localStorage.setItem(this.DEVICE_SESSIONS_KEY, JSON.stringify(filtered));
  }

  // 🔧 Générer ID appareil unique
  private generateDeviceId(): string {
    const fingerprint = navigator.userAgent + navigator.platform + navigator.language;
    return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  // 📱 Obtenir nom de l'appareil
  private getDeviceName(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    if (/iPhone/.test(userAgent)) return "iPhone " + platform;
    if (/iPad/.test(userAgent)) return "iPad " + platform;
    if (/Android/.test(userAgent)) return "Android " + platform;
    if (/Windows/.test(userAgent)) return "Windows PC";
    if (/Mac/.test(userAgent)) return "Mac";
    if (/Linux/.test(userAgent)) return "Linux";
    
    return "Appareil inconnu";
  }

  // 📱 Obtenir type d'appareil
  private getDeviceType(): "mobile" | "tablet" | "desktop" {
    const userAgent = navigator.userAgent;
    
    if (/Mobile|Android|iPhone|iPad|iPod/.test(userAgent)) {
      return /iPad/.test(userAgent) ? "tablet" : "mobile";
    }
    
    return "desktop";
  }

  // 🔄 Rafraîchir la session (appelé régulièrement)
  refreshSession(): boolean {
    const session = this.loadSession();
    if (!session) return false;

    // Étendre la durée de vie de la session
    session.expiresAt = new Date(Date.now() + this.MAX_SESSION_DURATION);
    session.lastActivity = new Date();
    
    this.updateSession(session);
    return true;
  }

  // 📊 Statistiques de session
  getSessionStats(): {
    totalDevices: number;
    activeDevices: number;
    oldestSession: Date | null;
    sessionAge: number | null;
  } {
    const sessions = this.getDeviceSessions();
    const currentSession = this.loadSession();
    
    return {
      totalDevices: sessions.length,
      activeDevices: sessions.filter(s => s.isActive).length,
      oldestSession: sessions.length > 0 ? 
        new Date(Math.min(...sessions.map(s => s.lastSeen.getTime()))) : 
        null,
      sessionAge: currentSession ? 
        Date.now() - currentSession.lastActivity.getTime() : 
        null
    };
  }
}

// 🎯 Hook React pour la persistance de session
export const useSessionPersistence = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([]);

  // Charger la session au démarrage
  useEffect(() => {
    const loadInitialSession = () => {
      setIsLoading(true);
      const loadedSession = sessionPersistence.loadSession();
      setSession(loadedSession);
      setDeviceSessions(sessionPersistence.getDeviceSessions());
      setIsLoading(false);
    };

    loadInitialSession();

    // Rafraîchir la session toutes les 5 minutes
    const refreshInterval = setInterval(() => {
      sessionPersistence.refreshSession();
    }, 5 * 60 * 1000);

    // Écouter les changements d'onglet pour rafraîchir
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        sessionPersistence.refreshSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Sauvegarder la session
  const saveSession = (userData: Omit<SessionData, "expiresAt" | "lastActivity">) => {
    sessionPersistence.saveSession(userData);
    const updatedSession = sessionPersistence.loadSession();
    setSession(updatedSession);
    setDeviceSessions(sessionPersistence.getDeviceSessions());
  };

  // Mettre à jour la session
  const updateSession = (partialData: Partial<SessionData>) => {
    sessionPersistence.updateSession(partialData);
    const updatedSession = sessionPersistence.loadSession();
    setSession(updatedSession);
  };

  // Supprimer la session
  const clearSession = () => {
    sessionPersistence.clearSession();
    setSession(null);
    setDeviceSessions([]);
  };

  // Supprimer une session appareil
  const removeDeviceSession = (sessionId: string) => {
    sessionPersistence.removeDeviceSession(sessionId);
    setDeviceSessions(sessionPersistence.getDeviceSessions());
  };

  return {
    session,
    deviceSessions,
    isLoading,
    hasActiveSession: sessionPersistence.hasActiveSession(),
    saveSession,
    updateSession,
    clearSession,
    removeDeviceSession,
    sessionStats: sessionPersistence.getSessionStats()
  };
};

// 🌐 Service singleton
export const sessionPersistence = new SessionPersistence();
