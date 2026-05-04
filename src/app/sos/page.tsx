"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  X,
  Check,
  Car,
  Wrench,
  Battery,
  Thermometer,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { useToast } from "@/hooks/use-toast";

const breakdownTypes = [
  { id: "engine", label: "Moteur / Démarrage", icon: Car, color: "bg-red-500" },
  { id: "tire", label: "Pneu crevé", icon: CircleDot, color: "bg-orange-500" },
  { id: "battery", label: "Batterie", icon: Battery, color: "bg-yellow-500" },
  { id: "accident", label: "Accident", icon: AlertCircle, color: "bg-red-600" },
  { id: "overheat", label: "Surchauffe", icon: Thermometer, color: "bg-orange-600" },
  { id: "other", label: "Autre problème", icon: Wrench, color: "bg-gray-500" },
];

const searchRadiusOptions = [5, 10, 20, 50];

// Mock mechanics data
const mockMechanics = [
  {
    id: "1",
    name: "Pierre K.",
    rating: 4.8,
    distance: 2.3,
    eta: 8,
    photo: null,
    specializations: ["Moteur", "Électricité"],
    status: "online",
  },
  {
    id: "2",
    name: "Amadou D.",
    rating: 4.6,
    distance: 3.1,
    eta: 12,
    photo: null,
    specializations: ["Pneumatique", "Freins"],
    status: "online",
  },
  {
    id: "3",
    name: "Kouamé B.",
    rating: 4.9,
    distance: 4.5,
    eta: 18,
    photo: null,
    specializations: ["Climatisation", "Électricité"],
    status: "online",
  },
];

type SOSStatus = "form" | "searching" | "matched" | "en_route" | "arrived" | "completed";

export default function SOSPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<SOSStatus>("form");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [searchRadius, setSearchRadius] = useState(10);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationAddress, setLocationAddress] = useState("Détection en cours...");
  const [selectedMechanic, setSelectedMechanic] = useState<(typeof mockMechanics)[0] | null>(null);
  const [acceptedMechanic, setAcceptedMechanic] = useState<(typeof mockMechanics)[0] | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationAddress("Abidjan, Cocody - Rue des Jardins");
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationAddress("Localisation non disponible");
        }
      );
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleSOSPress = useCallback(() => {
    if (!selectedType) {
      toast({
        title: "Sélectionnez un type de panne",
        description: "Veuillez choisir le type de problème rencontré",
        variant: "destructive",
      });
      return;
    }

    setStatus("searching");

    // Simulate searching for mechanics
    setTimeout(() => {
      setStatus("matched");
    }, 3000);
  }, [selectedType, toast]);

  const handleAcceptMechanic = (mechanic: (typeof mockMechanics)[0]) => {
    setAcceptedMechanic(mechanic);
    setStatus("en_route");
    toast({
      title: "Mécanicien accepté !",
      description: `${mechanic.name} est en route vers vous.`,
    });
  };

  const handleArrived = () => {
    setStatus("arrived");
    setIsTimerRunning(true);
    toast({
      title: "Mécanicien arrivé",
      description: "L'intervention a commencé.",
    });
  };

  const handleComplete = () => {
    setIsTimerRunning(false);
    setStatus("completed");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Location Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Votre position</p>
              <p className="text-sm text-gray-600">{locationAddress}</p>
              {location && (
                <p className="text-xs text-gray-500 mt-1">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Type Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Type de panne</h2>
        <div className="grid grid-cols-2 gap-3">
          {breakdownTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedType === type.id
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`h-12 w-12 rounded-full ${type.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-center">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description (optionnel)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre problème en détail..."
          className="w-full h-24 p-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
        />
      </div>

      {/* Search Radius */}
      <div>
        <label className="block text-sm font-medium mb-2">Rayon de recherche</label>
        <div className="flex gap-2">
          {searchRadiusOptions.map((radius) => (
            <button
              key={radius}
              onClick={() => setSearchRadius(radius)}
              className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                searchRadius === radius
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {radius} km
            </button>
          ))}
        </div>
      </div>

      {/* SOS Button */}
      <Button
        onClick={handleSOSPress}
        className="w-full h-16 bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-xl sos-button"
      >
        <AlertCircle className="h-6 w-6 mr-2" />
        LANCER UN SOS
      </Button>

      <p className="text-xs text-center text-gray-500">
        En cas d&apos;urgence médicale, appelez directement le 185
      </p>
    </motion.div>
  );

  const renderSearching = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-12"
    >
      <div className="relative h-24 w-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping" />
        <div className="absolute inset-2 rounded-full border-4 border-red-300 animate-ping delay-100" />
        <div className="absolute inset-4 rounded-full bg-red-500 flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-white" />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Recherche de mécaniciens...</h2>
      <p className="text-gray-600">Nous recherchons les mécaniciens disponibles à proximité</p>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <MapPin className="h-4 w-4" />
        <span>Rayon: {searchRadius} km</span>
      </div>
    </motion.div>
  );

  const renderMatched = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Mécaniciens disponibles</h2>
        <p className="text-gray-600">{mockMechanics.length} mécaniciens trouvés</p>
      </div>

      <div className="space-y-3">
        {mockMechanics.map((mechanic, index) => (
          <motion.div
            key={mechanic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Wrench className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{mechanic.name}</h3>
                      <span className="flex items-center gap-1 text-sm text-yellow-500">
                        <span className="text-lg">★</span>
                        {mechanic.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {mechanic.distance} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mechanic.eta} min
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mechanic.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toast({ title: "Appel en cours..." })}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Appeler
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toast({ title: "Messagerie..." })}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleAcceptMechanic(mechanic)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Choisir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setStatus("form")}
      >
        <X className="h-4 w-4 mr-2" />
        Annuler la demande
      </Button>
    </motion.div>
  );

  const renderEnRoute = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {acceptedMechanic && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-full bg-blue-500 flex items-center justify-center">
                <Wrench className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{acceptedMechanic.name}</h3>
                <p className="text-sm text-gray-600">En route vers vous</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-600">{acceptedMechanic.eta}</p>
                <p className="text-xs text-gray-500">minutes</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-600">{acceptedMechanic.distance}</p>
                <p className="text-xs text-gray-500">kilomètres</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-2xl font-bold text-yellow-500">★ {acceptedMechanic.rating}</p>
                <p className="text-xs text-gray-500">étoiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Placeholder */}
      <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-center">
            <Navigation className="h-12 w-12 text-blue-500 mx-auto mb-2 animate-bounce" />
            <p className="text-gray-600">Carte en temps réel</p>
            <p className="text-sm text-gray-500">Position du mécanicien</p>
          </div>
        </div>
        {/* User position marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-4 w-4 bg-red-500 rounded-full border-2 border-white shadow-lg" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => toast({ title: "Appel en cours..." })}
        >
          <Phone className="h-4 w-4 mr-2" />
          Appeler
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => toast({ title: "Messagerie..." })}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>
      </div>

      <Button
        className="w-full bg-green-500 hover:bg-green-600"
        onClick={handleArrived}
      >
        <Check className="h-4 w-4 mr-2" />
        Le mécanicien est arrivé
      </Button>
    </motion.div>
  );

  const renderArrived = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 text-center"
    >
      <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-10 w-10 text-green-600" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Intervention en cours</h2>
        <p className="text-gray-600">{acceptedMechanic?.name} est arrivé</p>
      </div>

      {/* Timer */}
      <div className="bg-gray-900 text-white rounded-2xl p-8">
        <p className="text-sm text-gray-400 mb-2">Temps d&apos;intervention</p>
        <p className="text-5xl font-mono font-bold">{formatTime(timer)}</p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => toast({ title: "Appel en cours..." })}
        >
          <Phone className="h-4 w-4 mr-2" />
          Appeler
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => toast({ title: "Messagerie..." })}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>
      </div>

      <Button
        className="w-full h-14 bg-green-500 hover:bg-green-600 text-lg"
        onClick={handleComplete}
      >
        <Check className="h-5 w-5 mr-2" />
        Terminer l&apos;intervention
      </Button>
    </motion.div>
  );

  const renderCompleted = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Intervention terminée !</h2>
        <p className="text-gray-600">Durée: {formatTime(timer)}</p>
      </div>

      {/* Rating */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-center mb-4">Notez {acceptedMechanic?.name}</h3>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="h-10 w-10 text-2xl text-yellow-400 hover:scale-110 transition-transform"
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            placeholder="Laissez un commentaire (optionnel)"
            className="w-full h-20 p-3 rounded-lg border border-gray-300 resize-none"
          />
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Paiement</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Intervention</span>
              <span className="font-medium">15 000 FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Déplacement</span>
              <span className="font-medium">2 500 FCFA</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">17 500 FCFA</span>
            </div>
          </div>
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
            Payer maintenant
          </Button>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/dashboard")}
      >
        Retour au tableau de bord
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {status === "form" && (
              <>
                <AlertCircle className="h-6 w-6 text-red-500" />
                SOS Panné
              </>
            )}
            {status === "searching" && "Recherche..."}
            {status === "matched" && "Mécaniciens disponibles"}
            {status === "en_route" && "En route"}
            {status === "arrived" && "Intervention"}
            {status === "completed" && "Terminé"}
          </h1>
          {status !== "form" && status !== "completed" && (
            <button
              onClick={() => setStatus("form")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {status === "form" && renderForm()}
          {status === "searching" && renderSearching()}
          {status === "matched" && renderMatched()}
          {status === "en_route" && renderEnRoute()}
          {status === "arrived" && renderArrived()}
          {status === "completed" && renderCompleted()}
        </AnimatePresence>
      </main>

      {/* Only show bottom nav when on form or completed */}
      {(status === "form" || status === "completed") && <BottomNav role="user" />}
    </div>
  );
}
