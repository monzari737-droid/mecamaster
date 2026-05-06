"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Users,
  Car,
  Wrench,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Star,
  Clock,
  Zap,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ModernLayout } from "@/components/modern-sidebar";
import { OpenStreetMap, useOpenStreetMap } from "@/components/map-openstreetmap";
import { 
  useRealTimeLocation,
  calculateArrivalTime,
  calculateRealDistance,
  type LocationCoordinates 
} from "@/lib/geolocation-realtime";

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState<LocationCoordinates>({
    lat: 5.3600, // Abidjan, Cocody
    lng: -4.0083,
    timestamp: Date.now()
  });

  const { 
    currentLocation, 
    nearbyMechanics, 
    isTracking,
    calculateETA 
  } = useRealTimeLocation("user_001", "Client Test", "user");

  const { addMarker, centerMap } = useOpenStreetMap();

  // Simuler des mécaniciens proches
  const [mechanics, setMechanics] = useState([
    {
      id: "mech_001",
      name: "Pierre Koffi",
      specialties: ["Moteur", "Électricité"],
      rating: 4.8,
      reviews: 127,
      phone: "+237 6900 000 001",
      location: {
        lat: 5.3610,
        lng: -4.0073,
        address: "Abidjan, Cocody"
      },
      isAvailable: true,
      isMoving: true,
      hourlyRate: 5000,
      responseTime: "Immédiat"
    },
    {
      id: "mech_002", 
      name: "Marc Traoré",
      specialties: ["Freins", "Suspension"],
      rating: 4.6,
      reviews: 89,
      phone: "+237 6900 000 002",
      location: {
        lat: 5.3590,
        lng: -4.0093,
        address: "Abidjan, Plateau"
      },
      isAvailable: true,
      isMoving: false,
      hourlyRate: 4500,
      responseTime: "15 min"
    },
    {
      id: "mech_003",
      name: "Jean Assi",
      specialties: ["Climatisation", "Diagnostic"],
      rating: 4.9,
      reviews: 156,
      phone: "+237 6900 000 003",
      location: {
        lat: 5.3620,
        lng: -4.0063,
        address: "Abidjan, Yopougon"
      },
      isAvailable: false,
      isMoving: false,
      hourlyRate: 5500,
      responseTime: "30 min"
    }
  ]);

  // Marqueurs pour la carte
  const mapMarkers = [
    // Position utilisateur
    currentLocation ? {
      id: "user_location",
      position: [currentLocation.coordinates.lat, currentLocation.coordinates.lng] as [number, number],
      type: "client" as const,
      title: "Votre position",
      description: "Localisation GPS active",
      icon: "👤",
      popup: "Vous êtes ici"
    } : null,
    // Mécaniciens
    ...mechanics.map(mechanic => ({
      id: mechanic.id,
      position: [mechanic.location.lat, mechanic.location.lng] as [number, number],
      type: "mechanic" as const,
      title: mechanic.name,
      description: mechanic.specialties.join(", "),
      icon: "🔧",
      popup: `${mechanic.name} - ${mechanic.specialties.join(", ")}`
    }))
  ].filter(Boolean);

  // Calculer le temps d'arrivée pour chaque mécanicien
  const mechanicsWithETA = mechanics.map(mechanic => {
    if (!currentLocation) return mechanic;
    
    const distance = calculateRealDistance(
      currentLocation.coordinates,
      mechanic.location
    );
    
    const eta = calculateArrivalTime(
      mechanic.location,
      currentLocation.coordinates,
      "car",
      "normal"
    );
    
    return {
      ...mechanic,
      distance,
      eta
    };
  });

  // Gérer le clic sur un marqueur
  const handleMarkerClick = (marker: any) => {
    const mechanic = mechanics.find(m => m.id === marker.id);
    if (mechanic) {
      setSelectedMechanic(mechanic);
    }
  };

  // Contacter un mécanicien
  const contactMechanic = (mechanic: any, type: "call" | "message") => {
    if (type === "call") {
      window.open(`tel:${mechanic.phone}`);
    } else {
      // Ouvrir le chat avec ce mécanicien
      console.log(`Ouverture chat avec ${mechanic.name}`);
    }
  };

  // Centrer sur un mécanicien
  const centerOnMechanic = (mechanic: any) => {
    setMapCenter(mechanic.location);
    setSelectedMechanic(mechanic);
  };

  return (
    <ModernLayout role="user" userName="Client Test">
      <div className="p-4 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Carte des Mécaniciens
              </h1>
              <p className="text-gray-600">
                {isTracking ? "🟢 Localisation active" : "🟡 Localisation en cours..."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
              <Button
                size="sm"
                onClick={() => currentLocation && centerMap(currentLocation.coordinates)}
                className="flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Ma position
              </Button>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un mécanicien, une spécialité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Filtres */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Moteur", "Électricité", "Freins", "Climatisation"].map(specialty => (
                    <Button
                      key={specialty}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Contenu principal */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Carte */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1"
          >
            <Card className="h-full p-0 overflow-hidden">
              <OpenStreetMap
                center={mapCenter}
                height="100%"
                markers={mapMarkers}
                showUserLocation={true}
                showMechanics={true}
                onMarkerClick={handleMarkerClick}
                onMapClick={(coords) => setMapCenter(coords)}
              />
            </Card>
          </motion.div>

          {/* Liste des mécaniciens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 overflow-hidden"
          >
            <Card className="h-full flex flex-col">
              <CardContent className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Mécaniciens proches
                  </h3>
                  <Badge className="bg-orange-100 text-orange-800">
                    {mechanicsWithETA.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {mechanicsWithETA.map((mechanic, index) => (
                    <motion.div
                      key={mechanic.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedMechanic?.id === mechanic.id ? "ring-2 ring-orange-500" : ""
                        }`}
                        onClick={() => centerOnMechanic(mechanic)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {mechanic.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {mechanic.specialties.join(", ")}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge 
                                variant={mechanic.isAvailable ? "default" : "secondary"}
                                className={mechanic.isAvailable ? "bg-green-100 text-green-800" : ""}
                              >
                                {mechanic.isAvailable ? "✅ Disponible" : "⏸️ Occupé"}
                              </Badge>
                              {mechanic.isMoving && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <Navigation className="w-3 h-3" />
                                  En route
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">{mechanic.rating}</span>
                              <span className="text-xs text-gray-500">({mechanic.reviews})</span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-semibold text-orange-600">
                                {mechanic.hourlyRate} FCFA/h
                              </p>
                            </div>
                          </div>

                          {/* Distance et temps d'arrivée */}
                          {mechanic.distance && mechanic.eta && (
                            <div className="flex items-center justify-between mb-2 text-xs">
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{mechanic.distance.toFixed(1)} km</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>{mechanic.eta.finalDuration} min</span>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                contactMechanic(mechanic, "call");
                              }}
                              className="flex-1"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Appeler
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                contactMechanic(mechanic, "message");
                              }}
                              className="flex-1"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Détails mécanicien sélectionné */}
        {selectedMechanic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {selectedMechanic.name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedMechanic.specialties.join(", ")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMechanic(null)}
                  >
                    Fermer
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedMechanic.rating}
                    </p>
                    <p className="text-xs text-gray-600">Note</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedMechanic.distance?.toFixed(1) || "0"}km
                    </p>
                    <p className="text-xs text-gray-600">Distance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedMechanic.eta?.finalDuration || "--"}min
                    </p>
                    <p className="text-xs text-gray-600">Arrivée</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" onClick={() => contactMechanic(selectedMechanic, "call")}>
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler maintenant
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => contactMechanic(selectedMechanic, "message")}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Envoyer message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </ModernLayout>
  );
}
