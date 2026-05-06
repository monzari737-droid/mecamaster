// 🚨 SYSTÈME DE NOTIFICATION SOS TEMPS RÉEL - Meca Master
// Pour que les mécaniciens reçoivent VRAIMENT les alertes SOS

import { type SOSAlert, type ProfessionalUser } from "./professional-data";

export interface SOSNotification {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  breakdownType: string;
  description: string;
  urgency: "low" | "medium" | "high" | "critical";
  vehicleInfo: {
    brand: string;
    model: string;
    year: number;
    plateNumber: string;
  };
  createdAt: Date;
  estimatedPrice?: number;
  distance?: number;
}

export interface MechanicNotificationResponse {
  mechanicId: string;
  sosId: string;
  response: "accepted" | "declined" | "busy";
  responseTime: number; // en secondes
  estimatedArrival?: number; // en minutes
}

// 🚨 ENVOI SOS à tous les mécaniciens disponibles
export const sendSOSToMechanics = async (
  sosData: Omit<SOSNotification, 'id' | 'createdAt'>
): Promise<{ success: boolean; notifiedMechanics: number }> => {
  try {
    // Simuler appel API backend
    const sosNotification: SOSNotification = {
      ...sosData,
      id: `sos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    // 1. Récupérer les mécaniciens disponibles dans la zone
    const availableMechanics = await getAvailableMechanicsInZone(
      sosData.location.coordinates,
      50 // rayon de 50km
    );

    // 2. Envoyer la notification à chaque mécanicien
    const notifications = availableMechanics.map(mechanic => 
      notifyMechanic(mechanic.id, sosNotification)
    );

    // 3. Attendre que toutes les notifications soient envoyées
    await Promise.all(notifications);

    console.log(`🚨 SOS envoyé à ${availableMechanics.length} mécaniciens`);
    
    return {
      success: true,
      notifiedMechanics: availableMechanics.length
    };

  } catch (error) {
    console.error("❌ Erreur envoi SOS:", error);
    return { success: false, notifiedMechanics: 0 };
  }
};

// 📱 NOTIFIER un mécanicien spécifique
export const notifyMechanic = async (
  mechanicId: string, 
  sosNotification: SOSNotification
): Promise<void> => {
  try {
    // Simuler notification push/websocket
    console.log(`📱 Notification envoyée au mécanicien ${mechanicId}:`, {
      client: sosNotification.userName,
      location: sosNotification.location.address,
      urgency: sosNotification.urgency,
      issue: sosNotification.breakdownType
    });

    // En production, utiliser:
    // - WebSocket pour temps réel
    // - Push notifications (Firebase)
    // - SMS pour urgences critiques
    // - Email

    // Simuler WebSocket event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sos-notification', {
        detail: {
          mechanicId,
          notification: sosNotification
        }
      }));
    }

  } catch (error) {
    console.error(`❌ Erreur notification mécanicien ${mechanicId}:`, error);
  }
};

// 🔍 Récupérer les mécaniciens disponibles dans une zone
export const getAvailableMechanicsInZone = async (
  center: { lat: number; lng: number },
  radiusKm: number
): Promise<ProfessionalUser[]> => {
  try {
    // Simuler appel API pour géolocalisation
    // En production: utiliser PostgreSQL avec PostGIS ou API géolocalisation

    const mockAvailableMechanics: ProfessionalUser[] = [
      {
        id: "mech_001",
        firstName: "Pierre",
        lastName: "Koffi",
        email: "pierre.koffi@mecamaster.com",
        phone: "+237 6900 000 001",
        role: "mechanic",
        createdAt: new Date(),
        lastLogin: new Date(),
        isVerified: true,
        location: {
          city: "Abidjan, Cocody",
          country: "Cameroun",
          coordinates: { lat: 5.3600, lng: -4.0083 }
        }
      },
      {
        id: "mech_002",
        firstName: "Marc",
        lastName: "Traoré",
        email: "marc.traore@mecamaster.com",
        phone: "+237 6900 000 002",
        role: "mechanic",
        createdAt: new Date(),
        lastLogin: new Date(),
        isVerified: true,
        location: {
          city: "Abidjan, Yopougon",
          country: "Cameroun",
          coordinates: { lat: 5.3510, lng: -4.0083 }
        }
      }
    ];

    // Filtrer par distance (simulation)
    return mockAvailableMechanics.filter(mechanic => {
      if (!mechanic.location?.coordinates) return false;
      
      const distance = calculateDistance(
        center,
        mechanic.location.coordinates
      );
      
      return distance <= radiusKm;
    });

  } catch (error) {
    console.error("❌ Erreur récupération mécaniciens:", error);
    return [];
  }
};

// 📏 Calculer la distance entre deux points (formule Haversine)
export const calculateDistance = (
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance en km
};

// ⏱️ Répondre à un SOS
export const respondToSOS = async (
  mechanicId: string,
  sosId: string,
  response: "accepted" | "declined" | "busy",
  estimatedArrival?: number
): Promise<{ success: boolean }> => {
  try {
    const responseData: MechanicNotificationResponse = {
      mechanicId,
      sosId,
      response,
      responseTime: Date.now(),
      estimatedArrival
    };

    // Simuler appel API backend
    console.log(`📝 Mécanicien ${mechanicId} a répondu au SOS ${sosId}: ${response}`);

    // Notifier l'utilisateur
    await notifyUserOfResponse(sosId, responseData);

    // Notifier les autres mécaniciens que le SOS est pris en charge
    if (response === "accepted") {
      await notifyOtherMechanics(mechanicId, sosId);
    }

    return { success: true };

  } catch (error) {
    console.error("❌ Erreur réponse SOS:", error);
    return { success: false };
  }
};

// 👤 Notifier l'utilisateur de la réponse
export const notifyUserOfResponse = async (
  sosId: string,
  response: MechanicNotificationResponse
): Promise<void> => {
  try {
    console.log(`👤 Utilisateur notifié de la réponse pour SOS ${sosId}:`, {
      mechanicId: response.mechanicId,
      response: response.response,
      estimatedArrival: response.estimatedArrival
    });

    // En production:
    // - Push notification à l'utilisateur
    // - Mise à jour en temps réel de l'interface
    // - SMS si réponse acceptée

  } catch (error) {
    console.error("❌ Erreur notification utilisateur:", error);
  }
};

// 🚫 Notifier les autres mécaniciens
export const notifyOtherMechanics = async (
  acceptedMechanicId: string,
  sosId: string
): Promise<void> => {
  try {
    console.log(`🚫 Autres mécaniciens notifiés: SOS ${sosId} pris en charge par ${acceptedMechanicId}`);

    // En production:
    // - WebSocket aux autres mécaniciens
    // - Retirer le SOS de leur liste
    // - Notification "Mission acceptée par un confrère"

  } catch (error) {
    console.error("❌ Erreur notification autres mécaniciens:", error);
  }
};

// 🎯 Hook React pour les mécaniciens - écouter les SOS
export const useSOSNotifications = (mechanicId: string) => {
  const [notifications, setNotifications] = useState<SOSNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Écouter les événements WebSocket/SSE
    const handleSOSNotification = (event: CustomEvent) => {
      const { mechanicId: targetMechanicId, notification } = event.detail;
      
      if (targetMechanicId === mechanicId) {
        setNotifications(prev => [notification, ...prev].slice(0, 10)); // Garder 10 max
        
        // Son de notification (si supporté)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🚨 SOS Meca Master', {
            body: `${notification.userName} a besoin d'aide à ${notification.location.address}`,
            icon: '/favicon.ico',
            tag: notification.id,
            requireInteraction: true
          });
        }
      }
    };

    // S'abonner aux événements
    window.addEventListener('sos-notification', handleSOSNotification as EventListener);

    // Demander la permission pour les notifications push
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('sos-notification', handleSOSNotification as EventListener);
    };
  }, [mechanicId]);

  const acceptSOS = async (sosId: string, estimatedArrival?: number) => {
    setIsLoading(true);
    try {
      const result = await respondToSOS(mechanicId, sosId, "accepted", estimatedArrival);
      if (result.success) {
        setNotifications(prev => prev.filter(n => n.id !== sosId));
      }
    } catch (error) {
      console.error("❌ Erreur acceptation SOS:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const declineSOS = async (sosId: string) => {
    setIsLoading(true);
    try {
      const result = await respondToSOS(mechanicId, sosId, "declined");
      if (result.success) {
        setNotifications(prev => prev.filter(n => n.id !== sosId));
      }
    } catch (error) {
      console.error("❌ Erreur refus SOS:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    notifications,
    isLoading,
    acceptSOS,
    declineSOS,
    clearNotifications: () => setNotifications([])
  };
};

// 📊 Statistiques des notifications
export const getSOSStatistics = async (mechanicId: string) => {
  try {
    // Simuler appel API
    return {
      totalReceived: 0,
      totalAccepted: 0,
      totalDeclined: 0,
      averageResponseTime: 0,
      successRate: 0,
      earningsFromSOS: 0
    };
  } catch (error) {
    console.error("❌ Erreur statistiques SOS:", error);
    return null;
  }
};
