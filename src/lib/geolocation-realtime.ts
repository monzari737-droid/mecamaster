// 🗺️ GÉOLOCALISATION TEMPS RÉEL - Meca Master
// Carte interactive avec tracking mécanicien/client

import { useState, useEffect } from "react";

import { type SOSAlert, type ProfessionalUser } from "./professional-data";

export interface LocationCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

export interface RealTimeLocation {
  userId: string;
  userName: string;
  role: "user" | "mechanic" | "enterprise";
  coordinates: LocationCoordinates;
  address: string;
  isMoving: boolean;
  speed?: number; // km/h
  heading?: number; // direction en degrés
  lastUpdate: Date;
}

export interface RouteInfo {
  distance: number; // en km
  duration: number; // en minutes
  steps: RouteStep[];
  trafficInfo?: {
    level: "low" | "medium" | "high";
    delay: number; // minutes supplémentaires
  };
}

export interface RouteStep {
  instruction: string;
  distance: number; // en mètres
  duration: number; // en secondes
  maneuver: {
    location: LocationCoordinates;
    bearing_before?: number;
    bearing_after?: number;
    type: string;
  };
}

export interface ArrivalTimeCalculation {
  estimatedArrival: Date;
  distance: number;
  baseDuration: number;
  trafficAdjustment: number;
  finalDuration: number;
  confidence: "high" | "medium" | "low";
}

// 🚗 VITESSES MOYENNES SELON LE TYPE DE VÉHICULE ET CONDITIONS
export const AVERAGE_SPEEDS = {
  // Véhicules mécaniciens (voiture/moto)
  mechanic_car: {
    city: 25, // km/h en ville
    highway: 80, // km/h sur autoroute
    suburban: 45, // km/h en banlieue
  },
  mechanic_moto: {
    city: 35, // km/h en ville (plus agile)
    highway: 90, // km/h sur autoroute
    suburban: 55, // km/h en banlieue
  },
  // Vitesse piéton (si le mécanicien doit marcher)
  walking: {
    normal: 4, // km/h marche normale
    fast: 6, // km/h marche rapide
    urgent: 8, // km/h course (urgence)
  }
};

// 🕐 CALCUL TEMPS D'ARRIVÉE PRÉCIS
export const calculateArrivalTime = (
  mechanicLocation: LocationCoordinates,
  clientLocation: LocationCoordinates,
  vehicleType: "car" | "moto" | "walking" = "car",
  urgencyLevel: "normal" | "urgent" | "critical" = "normal"
): ArrivalTimeCalculation => {
  // 1. Calculer la distance réelle
  const distance = calculateRealDistance(mechanicLocation, clientLocation);
  
  // 2. Déterminer le type de route (simulation basée sur la zone)
  const routeType = determineRouteType(mechanicLocation, clientLocation);
  
  // 3. Choisir la vitesse moyenne selon véhicule et urgence
  let speed = getAverageSpeed(vehicleType, routeType, urgencyLevel);
  
  // 4. Calculer le temps de base (en minutes)
  const baseDuration = (distance / speed) * 60;
  
  // 5. Ajuster selon le trafic (simulation)
  const trafficAdjustment = calculateTrafficDelay(routeType, distance);
  
  // 6. Temps final
  const finalDuration = baseDuration + trafficAdjustment;
  
  // 7. Estimation d'arrivée
  const estimatedArrival = new Date(Date.now() + (finalDuration * 60 * 1000));
  
  // 8. Niveau de confiance
  const confidence = calculateConfidence(distance, trafficAdjustment);
  
  return {
    estimatedArrival,
    distance,
    baseDuration: Math.round(baseDuration),
    trafficAdjustment: Math.round(trafficAdjustment),
    finalDuration: Math.round(finalDuration),
    confidence
  };
};

// 📏 CALCUL DISTANCE RÉELLE (Haversine + ajustements)
export const calculateRealDistance = (
  point1: LocationCoordinates,
  point2: LocationCoordinates
): number => {
  // Formule Haversine pour distance à vol d'oiseau
  const R = 6371; // Rayon Terre en km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const straightDistance = R * c;
  
  // Ajustement pour distance réelle (routes, virages, etc.)
  // En ville : +30% , Banlieue : +20% , Autoroute : +10%
  const routeType = determineRouteType(point1, point2);
  const adjustmentFactor = routeType === "city" ? 1.3 : routeType === "suburban" ? 1.2 : 1.1;
  
  return straightDistance * adjustmentFactor;
};

// 🛣️ DÉTERMINER TYPE DE ROUTE
export const determineRouteType = (
  point1: LocationCoordinates,
  point2: LocationCoordinates
): "city" | "suburban" | "highway" => {
  // Logique simplifiée basée sur la distance et la zone
  const distance = calculateRealDistance(point1, point2);
  
  // Zones camerounaises (simulation)
  const abidjanCenter = { lat: 5.3600, lng: -4.0083 };
  const distanceFromCenter = calculateRealDistance(point1, abidjanCenter);
  
  if (distanceFromCenter < 5) return "city";      // Centre-ville
  if (distanceFromCenter < 15) return "suburban"; // Banlieue
  return "highway";                               // Autoroute/périphérique
};

// ⚡ VITESSE MOYENNE SELON CONDITIONS
export const getAverageSpeed = (
  vehicleType: "car" | "moto" | "walking",
  routeType: "city" | "suburban" | "highway",
  urgencyLevel: "normal" | "urgent" | "critical"
): number => {
  let baseSpeed: number;
  
  // Vitesse de base selon véhicule et route
  if (vehicleType === "car") {
    baseSpeed = AVERAGE_SPEEDS.mechanic_car[routeType];
  } else if (vehicleType === "moto") {
    baseSpeed = AVERAGE_SPEEDS.mechanic_moto[routeType];
  } else {
    baseSpeed = AVERAGE_SPEEDS.walking.normal;
  }
  
  // Ajustement selon urgence
  const urgencyMultiplier = 
    urgencyLevel === "critical" ? 1.3 : 
    urgencyLevel === "urgent" ? 1.15 : 1.0;
  
  return baseSpeed * urgencyMultiplier;
};

// 🚗 CALCUL DÉLAI TRAFIC
export const calculateTrafficDelay = (
  routeType: "city" | "suburban" | "highway",
  distance: number
): number => {
  // Simulation trafic selon heure et type de route
  const hour = new Date().getHours();
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  
  let delayFactor = 0;
  
  if (isRushHour) {
    delayFactor = routeType === "city" ? 0.5 : routeType === "suburban" ? 0.3 : 0.2;
  } else {
    delayFactor = routeType === "city" ? 0.2 : routeType === "suburban" ? 0.1 : 0.05;
  }
  
  // Délai en minutes
  return (distance / getAverageSpeed("car", routeType, "normal")) * 60 * delayFactor;
};

// 📊 NIVEAU DE CONFIANCE
export const calculateConfidence = (
  distance: number,
  trafficDelay: number
): "high" | "medium" | "low" => {
  const delayRatio = trafficDelay / (distance * 2); // Ratio délai/distance
  
  if (delayRatio < 0.2) return "high";
  if (delayRatio < 0.5) return "medium";
  return "low";
};

// 📍 TRACKING TEMPS RÉEL DES UTILISATEURS
export class RealTimeLocationTracker {
  private trackedUsers = new Map<string, RealTimeLocation>();
  private updateCallbacks = new Set<(location: RealTimeLocation) => void>();
  private updateInterval: NodeJS.Timeout | null = null;

  // Démarrer le tracking
  startTracking(userId: string, userName: string, role: "user" | "mechanic" | "enterprise") {
    // Demander la position GPS
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const location: RealTimeLocation = {
            userId,
            userName,
            role,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: Date.now()
            },
            address: "", // Sera rempli par reverse geocoding
            isMoving: position.coords.speed !== null && position.coords.speed > 0,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            lastUpdate: new Date()
          };

          this.updateLocation(location);
        },
        (error) => {
          console.error("❌ Erreur géolocalisation:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }

  // Mettre à jour la position
  private updateLocation(location: RealTimeLocation) {
    this.trackedUsers.set(location.userId, location);
    
    // Notifier tous les abonnés
    this.updateCallbacks.forEach(callback => callback(location));
  }

  // S'abonner aux mises à jour
  onLocationUpdate(callback: (location: RealTimeLocation) => void) {
    this.updateCallbacks.add(callback);
    return () => this.updateCallbacks.delete(callback);
  }

  // Obtenir la position d'un utilisateur
  getUserLocation(userId: string): RealTimeLocation | null {
    return this.trackedUsers.get(userId) || null;
  }

  // Obtenir tous les mécaniciens proches
  getNearbyMechanics(
    clientLocation: LocationCoordinates,
    radiusKm: number = 10
  ): RealTimeLocation[] {
    const nearbyMechanics: RealTimeLocation[] = [];
    
    for (const location of this.trackedUsers.values()) {
      if (location.role === "mechanic") {
        const distance = calculateRealDistance(clientLocation, location.coordinates);
        if (distance <= radiusKm) {
          nearbyMechanics.push({
            ...location,
            distance // Ajouter la distance
          });
        }
      }
    }
    
    // Trier par distance
    return nearbyMechanics.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  // Arrêter le tracking
  stopTracking(userId: string) {
    this.trackedUsers.delete(userId);
  }
}

// 🗺️ SERVICE DE CARTES INTERACTIVES
export class MapService {
  private static instance: MapService;
  private map: any = null; // Sera initialisé avec l'API de cartes

  static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  // Initialiser la carte
  async initializeMap(containerId: string, center: LocationCoordinates) {
    try {
      // Integration avec Google Maps, OpenStreetMap, ou Mapbox
      // Pour l'instant, simulation
      
      console.log("🗺️ Initialisation carte centrée sur:", center);
      
      return {
        center,
        zoom: 13,
        markers: [],
        routes: []
      };
    } catch (error) {
      console.error("❌ Erreur initialisation carte:", error);
      return null;
    }
  }

  // Ajouter un marqueur (mécanicien ou client)
  addMarker(
    location: LocationCoordinates,
    type: "mechanic" | "client" | "enterprise",
    info: { name: string; status?: string }
  ) {
    const icon = type === "mechanic" ? "🔧" : type === "client" ? "🚗" : "🏢";
    
    console.log(`📍 Ajout marqueur ${icon} ${info.name} à:`, location);
    
    return {
      id: `marker_${Date.now()}`,
      location,
      type,
      icon,
      info
    };
  }

  // Tracer un itinéraire
  async drawRoute(
    start: LocationCoordinates,
    end: LocationCoordinates
  ): Promise<RouteInfo | null> {
    try {
      // Simulation d'API de routage
      const distance = calculateRealDistance(start, end);
      const duration = (distance / getAverageSpeed("car", "city", "normal")) * 60;
      
      const route: RouteInfo = {
        distance,
        duration,
        steps: [
          {
            instruction: "Depart de votre position",
            distance: 0,
            duration: 0,
            maneuver: {
              location: start,
              type: "depart"
            }
          },
          {
            instruction: "Arrivée à destination",
            distance: distance * 1000, // en mètres
            duration: duration * 60, // en secondes
            maneuver: {
              location: end,
              type: "arrive"
            }
          }
        ],
        trafficInfo: {
          level: "low",
          delay: 0
        }
      };
      
      console.log("🛣️ Itinéraire calculé:", route);
      return route;
      
    } catch (error) {
      console.error("❌ Erreur calcul itinéraire:", error);
      return null;
    }
  }

  // Mettre à jour la position en temps réel
  updateMarkerPosition(markerId: string, newLocation: LocationCoordinates) {
    console.log(`🔄 Mise à jour marqueur ${markerId}:`, newLocation);
  }
}

// Export des services
export const locationTracker = new RealTimeLocationTracker();
export const mapService = MapService.getInstance();

// 🎯 Hook React pour la géolocalisation
export const useRealTimeLocation = (userId: string, userName: string, role: "user" | "mechanic" | "enterprise") => {
  const [currentLocation, setCurrentLocation] = useState<RealTimeLocation | null>(null);
  const [nearbyMechanics, setNearbyMechanics] = useState<RealTimeLocation[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Démarrer le tracking
    locationTracker.startTracking(userId, userName, role);
    setIsTracking(true);

    // S'abonner aux mises à jour
    const unsubscribe = locationTracker.onLocationUpdate((location) => {
      if (location.userId === userId) {
        setCurrentLocation(location);
      }
      
      // Mettre à jour les mécaniciens proches si c'est un client
      if (role === "user" && location.coordinates) {
        const nearby = locationTracker.getNearbyMechanics(location.coordinates, 10);
        setNearbyMechanics(nearby);
      }
    });

    return () => {
      locationTracker.stopTracking(userId);
      unsubscribe();
      setIsTracking(false);
    };
  }, [userId, userName, role]);

  const calculateETA = (mechanicLocation: LocationCoordinates) => {
    if (!currentLocation) return null;
    
    return calculateArrivalTime(
      mechanicLocation,
      currentLocation.coordinates,
      "car", // ou "moto" selon le mécanicien
      "normal"
    );
  };

  return {
    currentLocation,
    nearbyMechanics,
    isTracking,
    calculateETA,
    startTracking: () => locationTracker.startTracking(userId, userName, role),
    stopTracking: () => locationTracker.stopTracking(userId)
  };
};
