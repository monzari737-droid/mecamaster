// 🗺️ CARTE OPENSTREETMAP TEMPS RÉEL - Meca Master
// Carte interactive avec tracking GPS en temps réel

"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Users,
  Car,
  Wrench,
  Smartphone,
  Maximize2,
  Layers,
  Crosshair,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  calculateArrivalTime, 
  calculateRealDistance,
  type LocationCoordinates,
  type RealTimeLocation 
} from "@/lib/geolocation-realtime";

// Types pour OpenStreetMap
interface MapMarker {
  id: string;
  position: [number, number]; // [lat, lng]
  type: "client" | "mechanic" | "enterprise";
  title: string;
  description?: string;
  icon: string;
  popup?: string;
}

interface MapRoute {
  coordinates: [number, number][];
  color: string;
  weight: number;
  opacity: number;
}

declare global {
  interface Window {
    L: any;
  }
}

export function OpenStreetMap({
  center,
  zoom = 13,
  markers = [],
  showUserLocation = true,
  showMechanics = true,
  height = "400px",
  onMarkerClick,
  onMapClick
}: {
  center: LocationCoordinates;
  zoom?: number;
  markers?: MapMarker[];
  showUserLocation?: boolean;
  showMechanics?: boolean;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (coordinates: LocationCoordinates) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [mechanicsLocations, setMechanicsLocations] = useState<RealTimeLocation[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapType, setMapType] = useState<"street" | "satellite" | "terrain">("street");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Charger OpenStreetMap (Leaflet)
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Charger CSS Leaflet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Charger JS Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        
        script.onload = () => {
          initializeMap();
        };
        
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    loadLeaflet();
  }, [center, zoom]);

  // Initialiser la carte
  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    // Créer la carte
    const map = window.L.map(mapRef.current).setView([center.lat, center.lng], zoom);

    // Ajouter le layer de carte
    const streetLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    });

    const satelliteLayer = window.L.tileMap('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
      maxZoom: 19
    });

    streetMap.addTo(map);
    mapInstanceRef.current = { map, streetMap, satelliteMap };

    // Contrôles de zoom
    map.addControl(window.L.control.zoom());

    // Écouter les clics sur la carte
    map.on('click', (e: any) => {
      const coords: LocationCoordinates = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        timestamp: Date.now()
      };
      onMapClick?.(coords);
    });

    setIsLoading(false);
  };

  // Ajouter les marqueurs
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const { map } = mapInstanceRef.current;
    
    // Nettoyer les marqueurs existants
    map.eachLayer((layer: any) => {
      if (layer instanceof window.L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Ajouter le marqueur de l'utilisateur
    if (showUserLocation && userLocation) {
      const userIcon = window.L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full shadow-lg border-2 border-white">
            <span class="text-white text-xs">👤</span>
          </div>
        `,
        className: 'user-location-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Votre position</b><br>Localisation GPS active');

      map.addLayer(userMarker);
    }

    // Ajouter les marqueurs des mécaniciens
    if (showMechanics) {
      mechanicsLocations.forEach((mechanic, index) => {
        const mechanicIcon = window.L.divIcon({
          html: `
            <div class="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full shadow-lg border-2 border-white animate-pulse">
              <span class="text-white text-sm">🔧</span>
            </div>
          `,
          className: 'mechanic-location-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const distance = userLocation ? 
          calculateRealDistance(userLocation, mechanic.coordinates) : 0;

        const eta = userLocation ? 
          calculateArrivalTime(mechanic.coordinates, userLocation, "car", "normal") : null;

        const popupContent = `
          <div class="p-2">
            <b class="text-orange-600">${mechanic.userName}</b><br>
            📍 ${mechanic.address}<br>
            🛣️ ${distance.toFixed(1)} km<br>
            ⏱️ ${eta ? `${eta.finalDuration} min` : 'Calcul...'}<br>
            ✅ ${mechanic.isMoving ? 'En déplacement' : 'Disponible'}
          </div>
        `;

        const mechanicMarker = window.L.marker(
          [mechanic.coordinates.lat, mechanic.coordinates.lng], 
          { icon: mechanicIcon }
        )
          .addTo(map)
          .bindPopup(popupContent);

        map.addLayer(mechanicMarker);
      });
    }

    // Ajouter les marqueurs personnalisés
    markers.forEach(marker => {
      const iconHtml = marker.type === "client" ? "🚗" : 
                       marker.type === "mechanic" ? "🔧" : "🏢";

      const customIcon = window.L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 bg-${
            marker.type === "client" ? "blue" : 
            marker.type === "mechanic" ? "orange" : "purple"
          }-500 rounded-full shadow-lg border-2 border-white">
            <span class="text-white text-xs">${iconHtml}</span>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const customMarker = window.L.marker(marker.position, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <b>${marker.title}</b><br>
            ${marker.description || ''}<br>
            ${marker.popup || ''}
          </div>
        `);

      customMarker.on('click', () => onMarkerClick?.(marker));
      map.addLayer(customMarker);
    });

  }, [markers, userLocation, mechanicsLocations, showUserLocation, showMechanics]);

  // Obtenir la position de l'utilisateur
  useEffect(() => {
    if (!showUserLocation) return;

    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            const location: LocationCoordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: Date.now()
            };
            setUserLocation(location);
          },
          (error) => {
            console.error("❌ Erreur GPS:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      }
    };

    getUserLocation();
  }, [showUserLocation]);

  // Simuler les mécaniciens proches
  useEffect(() => {
    if (!showMechanics || !userLocation) return;

    // Simuler des mécaniciens autour de la position utilisateur
    const mockMechanics: RealTimeLocation[] = [
      {
        userId: "mech_001",
        userName: "Pierre Koffi",
        role: "mechanic",
        coordinates: {
          lat: userLocation.lat + 0.01,
          lng: userLocation.lng + 0.01,
          timestamp: Date.now()
        },
        address: "Abidjan, Cocody",
        isMoving: true,
        speed: 35,
        lastUpdate: new Date()
      },
      {
        userId: "mech_002",
        userName: "Marc Traoré",
        role: "mechanic",
        coordinates: {
          lat: userLocation.lat - 0.008,
          lng: userLocation.lng + 0.015,
          timestamp: Date.now()
        },
        address: "Abidjan, Yopougon",
        isMoving: false,
        lastUpdate: new Date()
      }
    ];

    setMechanicsLocations(mockMechanics);

    // Simuler le mouvement des mécaniciens
    const interval = setInterval(() => {
      setMechanicsLocations(prev => prev.map(mechanic => ({
        ...mechanic,
        coordinates: {
          ...mechanic.coordinates,
          lat: mechanic.coordinates.lat + (Math.random() - 0.5) * 0.001,
          lng: mechanic.coordinates.lng + (Math.random() - 0.5) * 0.001,
          timestamp: Date.now()
        },
        isMoving: Math.random() > 0.3
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [showMechanics, userLocation]);

  // Changer le type de carte
  const changeMapType = (type: "street" | "satellite" | "terrain") => {
    if (!mapInstanceRef.current) return;
    
    const { map, streetMap, satelliteMap } = mapInstanceRef.current;
    
    // Retirer le layer actuel
    map.eachLayer((layer: any) => {
      if (layer instanceof window.L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Ajouter le nouveau layer
    if (type === "satellite" && satelliteMap) {
      satelliteMap.addTo(map);
    } else {
      streetMap.addTo(map);
    }
    
    setMapType(type);
  };

  // Centrer sur la position utilisateur
  const centerOnUser = () => {
    if (!userLocation || !mapInstanceRef.current) return;
    
    const { map } = mapInstanceRef.current;
    map.setView([userLocation.lat, userLocation.lng], 16);
  };

  // Mode plein écran
  const toggleFullscreen = () => {
    if (!mapRef.current) return;
    
    if (!isFullscreen) {
      mapRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isfullscreen);
  };

  return (
    <div className="relative">
      {/* Contrôles de la carte */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-3">
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant={mapType === "street" ? "default" : "outline"}
                onClick={() => changeMapType("street")}
                className="flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                Rue
              </Button>
              <Button
                size="sm"
                variant={mapType === "satellite" ? "default" : "outline"}
                onClick={() => changeMapType("satellite")}
                className="flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Satellite
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-3">
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={centerOnUser}
                className="flex items-center gap-2"
                disabled={!userLocation}
              >
                <Crosshair className="w-4 h-4" />
                Ma position
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={toggleFullscreen}
                className="flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Plein écran
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info mécaniciens */}
      {mechanicsLocations.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-sm">Mécaniciens proches</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {mechanicsLocations.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {mechanicsLocations.slice(0, 3).map((mechanic) => {
                  const distance = userLocation ? 
                    calculateRealDistance(userLocation, mechanic.coordinates) : 0;
                  const eta = userLocation ? 
                    calculateArrivalTime(mechanic.coordinates, userLocation, "car", "normal") : null;
                  
                  return (
                    <div key={mechanic.userId} className="flex items-center justify-between text-xs">
                      <span className="font-medium">{mechanic.userName}</span>
                      <div className="flex items-center gap-1">
                        <span>{distance.toFixed(1)} km</span>
                        <span className="text-gray-500">
                          {eta ? `${eta.finalDuration}min` : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="text-sm text-gray-600">Chargement de la carte...</span>
          </div>
        </div>
      )}

      {/* Conteneur de la carte */}
      <div
        ref={mapRef}
        className="rounded-lg overflow-hidden border border-gray-200"
        style={{ height, width: "100%" }}
      />

      {/* Légende */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-lg">👤</span>
                <span>Vous</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">🔧</span>
                <span>Mécanicien</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">🚗</span>
                <span>Client</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Hook pour utiliser la carte OpenStreetMap
export const useOpenStreetMap = () => {
  const [mapCenter, setMapCenter] = useState<LocationCoordinates>({
    lat: 5.3600, // Abidjan
    lng: -4.0083,
    timestamp: Date.now()
  });

  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  // Ajouter un marqueur
  const addMarker = (marker: Omit<MapMarker, "id">) => {
    const newMarker: MapMarker = {
      ...marker,
      id: `marker_${Date.now()}_${Math.random()}`
    };
    setMapMarkers(prev => [...prev, newMarker]);
    return newMarker.id;
  };

  // Supprimer un marqueur
  const removeMarker = (markerId: string) => {
    setMapMarkers(prev => prev.filter(m => m.id !== markerId));
  };

  // Centrer la carte sur des coordonnées
  const centerMap = (coordinates: LocationCoordinates) => {
    setMapCenter(coordinates);
  };

  // Calculer un itinéraire
  const calculateRoute = async (
    start: LocationCoordinates,
    end: LocationCoordinates
  ) => {
    // Utiliser l'API OpenStreetMap Routing Machine (OSRM)
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.routes[0];
      }
    } catch (error) {
      console.error("❌ Erreur calcul itinéraire:", error);
    }
    return null;
  };

  return {
    mapCenter,
    mapMarkers,
    addMarker,
    removeMarker,
    centerMap,
    calculateRoute
  };
};
