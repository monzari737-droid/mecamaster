"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  Wrench,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { useToast } from "@/hooks/use-toast";

// Mock mechanics data
const mockMechanics = [
  {
    id: "1",
    firstName: "Pierre",
    lastName: "Konan",
    avatar: null,
    rating: 4.8,
    reviewCount: 127,
    distance: 2.3,
    isAvailable: true,
    specializations: ["Moteur", "Électricité", "Diagnostic"],
    hourlyRate: 5000,
    experienceYears: 8,
    address: "Cocody, Abidjan",
    isOnline: true,
  },
  {
    id: "2",
    firstName: "Amadou",
    lastName: "Diallo",
    avatar: null,
    rating: 4.6,
    reviewCount: 89,
    distance: 3.1,
    isAvailable: true,
    specializations: ["Pneumatique", "Freins", "Suspension"],
    hourlyRate: 4500,
    experienceYears: 5,
    address: "Marcory, Abidjan",
    isOnline: true,
  },
  {
    id: "3",
    firstName: "Kouamé",
    lastName: "Bakayoko",
    avatar: null,
    rating: 4.9,
    reviewCount: 203,
    distance: 4.5,
    isAvailable: false,
    specializations: ["Climatisation", "Électricité", "Électronique"],
    hourlyRate: 6000,
    experienceYears: 12,
    address: "Plateau, Abidjan",
    isOnline: false,
  },
  {
    id: "4",
    firstName: "Jean",
    lastName: "Yao",
    avatar: null,
    rating: 4.7,
    reviewCount: 56,
    distance: 5.2,
    isAvailable: true,
    specializations: ["Carrosserie", "Peinture"],
    hourlyRate: 5500,
    experienceYears: 6,
    address: "Yopougon, Abidjan",
    isOnline: true,
  },
  {
    id: "5",
    firstName: "Emmanuel",
    lastName: "Koffi",
    avatar: null,
    rating: 4.5,
    reviewCount: 34,
    distance: 6.8,
    isAvailable: true,
    specializations: ["Moteur", "Transmission", "Embrayage"],
    hourlyRate: 4000,
    experienceYears: 4,
    address: "Koumassi, Abidjan",
    isOnline: true,
  },
];

const specializations = [
  "Tous",
  "Moteur",
  "Électricité",
  "Pneumatique",
  "Freins",
  "Climatisation",
  "Carrosserie",
  "Diagnostic",
];

export default function MechanicsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<typeof mockMechanics[0] | null>(null);

  const filteredMechanics = mockMechanics.filter((mechanic) => {
    const matchesSearch =
      mechanic.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mechanic.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mechanic.specializations.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSpecialization =
      selectedSpecialization === "Tous" ||
      mechanic.specializations.includes(selectedSpecialization);

    const matchesAvailability = !availableOnly || mechanic.isAvailable;

    return matchesSearch && matchesSpecialization && matchesAvailability;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleContact = (type: "call" | "message", mechanic: typeof mockMechanics[0]) => {
    toast({
      title: type === "call" ? "Appel en cours..." : "Messagerie",
      description: `Contacter ${mechanic.firstName} ${mechanic.lastName}`,
    });
  };

  const handleRequestIntervention = (mechanic: typeof mockMechanics[0]) => {
    toast({
      title: "Demande envoyée",
      description: `Demande d'intervention envoyée à ${mechanic.firstName} ${mechanic.lastName}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Mécaniciens</h1>
          
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un mécanicien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-gray-100" : ""}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Spécialisation
                </label>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialization(spec)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedSpecialization === spec
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Disponible maintenant uniquement</span>
              </label>
            </motion.div>
          )}

          {/* Specialization horizontal scroll (when filters closed) */}
          {!showFilters && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {specializations.slice(0, 6).map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedSpecialization === spec
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {filteredMechanics.length} mécanicien{filteredMechanics.length > 1 ? "s" : ""} trouvé
          {filteredMechanics.length > 1 ? "s" : ""}
        </p>

        {/* Mechanics List */}
        <div className="space-y-4">
          {filteredMechanics.map((mechanic, index) => (
            <motion.div
              key={mechanic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedMechanic(mechanic)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={mechanic.avatar || undefined} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                          {getInitials(mechanic.firstName, mechanic.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online status */}
                      <span
                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                          mechanic.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {mechanic.firstName} {mechanic.lastName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{mechanic.address}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{mechanic.rating}</span>
                          <span className="text-gray-400">({mechanic.reviewCount})</span>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mechanic.specializations.slice(0, 3).map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {mechanic.specializations.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{mechanic.specializations.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Info row */}
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          {mechanic.distance} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {mechanic.experienceYears} ans exp.
                        </span>
                        <span className="font-medium text-blue-600">
                          {mechanic.hourlyRate.toLocaleString()} FCFA/h
                        </span>
                      </div>

                      {/* Availability badge */}
                      <div className="mt-3">
                        {mechanic.isAvailable ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            🟢 Disponible maintenant
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-gray-600">
                            🔴 Occupé
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact("call", mechanic);
                      }}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Appeler
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact("message", mechanic);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestIntervention(mechanic);
                      }}
                      disabled={!mechanic.isAvailable}
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      Intervenir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMechanics.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucun mécanicien trouvé</h3>
            <p className="text-gray-500 mt-1">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </main>

      {/* Mechanic Detail Modal */}
      {selectedMechanic && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedMechanic(null)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMechanic.avatar || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                    {getInitials(selectedMechanic.firstName, selectedMechanic.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedMechanic.firstName} {selectedMechanic.lastName}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{selectedMechanic.rating}</span>
                    <span>({selectedMechanic.reviewCount} avis)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMechanic(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-6 w-6 rotate-90" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-blue-600">{selectedMechanic.experienceYears}</p>
                  <p className="text-xs text-gray-500">ans d&apos;exp.</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-blue-600">{selectedMechanic.distance}</p>
                  <p className="text-xs text-gray-500">km</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-blue-600">{selectedMechanic.hourlyRate.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">FCFA/h</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Spécialisations</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMechanic.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Adresse</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedMechanic.address}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleContact("call", selectedMechanic)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleRequestIntervention(selectedMechanic)}
                  disabled={!selectedMechanic.isAvailable}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Demander intervention
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav role="user" />
    </div>
  );
}
