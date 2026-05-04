"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  DollarSign,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Phone,
  MessageCircle,
  Navigation,
  User,
  ChevronRight,
  Power,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { AIAssistant } from "@/components/ai/ai-assistant";

// Mock mechanic data
const mockMechanic = {
  firstName: "Pierre",
  lastName: "Konan",
  avatar: null,
  rating: 4.8,
  reviewCount: 127,
  isAvailable: true,
  balance: 125000,
  todayEarnings: 35000,
  weekEarnings: 142000,
  monthEarnings: 580000,
  specializations: ["Moteur", "Électricité", "Diagnostic"],
  experienceYears: 8,
  ranking: "Top 5% à Abidjan",
};

// Mock missions
const mockMissions = {
  pending: [
    {
      id: "1",
      type: "Moteur",
      description: "Moteur qui ne démarre plus",
      distance: 2.3,
      address: "Cocody, Angré",
      estimatedPrice: 25000,
      createdAt: "2026-05-03T10:30:00",
    },
  ],
  active: [
    {
      id: "2",
      type: "Pneu crevé",
      clientName: "Marie D.",
      address: "Marcory, Zone 4",
      distance: 1.8,
      status: "en_route",
      startedAt: "2026-05-03T09:15:00",
    },
  ],
  completed: [
    {
      id: "3",
      type: "Vidange",
      clientName: "Koffi B.",
      price: 25000,
      rating: 5,
      completedAt: "2026-05-02T16:45:00",
    },
  ],
};

// Chart data (simplified)
const weeklyData = [
  { day: "Lun", amount: 25000 },
  { day: "Mar", amount: 45000 },
  { day: "Mer", amount: 30000 },
  { day: "Jeu", amount: 52000 },
  { day: "Ven", amount: 38000 },
  { day: "Sam", amount: 65000 },
  { day: "Dim", amount: 35000 },
];

export default function MechanicDashboardPage() {
  const { toast } = useToast();
  const [mechanic] = useState(mockMechanic);
  const [isAvailable, setIsAvailable] = useState(mechanic.isAvailable);
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "completed">("pending");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleAvailabilityToggle = () => {
    setIsAvailable(!isAvailable);
    toast({
      title: isAvailable ? "Vous êtes hors ligne" : "Vous êtes en ligne",
      description: isAvailable
        ? "Vous ne recevrez plus de demandes SOS"
        : "Vous êtes maintenant visible pour les clients",
    });
  };

  const handleAcceptMission = (missionId: string) => {
    toast({
      title: "Mission acceptée",
      description: "Le client a été notifié de votre acceptation.",
    });
  };

  const handleDeclineMission = (missionId: string) => {
    toast({
      title: "Mission déclinée",
      description: "La mission sera proposée à un autre mécanicien.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={mechanic.avatar || undefined} />
                <AvatarFallback className="bg-blue-800 text-white">
                  {getInitials(mechanic.firstName, mechanic.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-bold">
                  {mechanic.firstName} {mechanic.lastName}
                </h1>
                <div className="flex items-center gap-1 text-sm text-blue-100">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {mechanic.rating} ({mechanic.reviewCount} avis)
                </div>
              </div>
            </div>
            <button
              onClick={handleAvailabilityToggle}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                isAvailable
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <Power className="h-4 w-4" />
              {isAvailable ? "En ligne" : "Hors ligne"}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
              <p className="text-lg font-bold">{formatCurrency(mechanic.todayEarnings)}</p>
              <p className="text-xs text-blue-100">Aujourd&apos;hui</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
              <p className="text-lg font-bold">{formatCurrency(mechanic.weekEarnings)}</p>
              <p className="text-xs text-blue-100">Cette semaine</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
              <p className="text-lg font-bold">{formatCurrency(mechanic.monthEarnings)}</p>
              <p className="text-xs text-blue-100">Ce mois</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Balance & Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm">Solde actuel</p>
                  <p className="text-3xl font-bold">{formatCurrency(mechanic.balance)}</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-white/20 text-white hover:bg-white/30"
                  onClick={() => toast({ title: "Dépôt..." })}
                >
                  Déposer
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-white text-blue-600 hover:bg-white/90"
                  onClick={() => toast({ title: "Retrait..." })}
                >
                  Retirer
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Ranking Badge */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-yellow-800">{mechanic.ranking}</p>
                <p className="text-sm text-yellow-600">Continuez comme ça !</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Weekly Earnings Chart */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Revenus cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {weeklyData.map((data, index) => (
                  <div key={data.day} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                      style={{ height: `${(data.amount / 70000) * 100}%` }}
                    />
                    <p className="text-xs text-gray-500 mt-1">{data.day}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Missions Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                Mes missions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {(["pending", "active", "completed"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab === "pending" && "En attente"}
                    {tab === "active" && "En cours"}
                    {tab === "completed" && "Terminées"}
                    <span className="ml-1">
                      ({mockMissions[tab].length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Mission List */}
              <div className="space-y-3">
                {activeTab === "pending" && mockMissions.pending.map((mission) => (
                  <div key={mission.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{mission.type}</h3>
                        <p className="text-sm text-gray-600">{mission.description}</p>
                      </div>
                      <Badge className="bg-orange-500">{formatCurrency(mission.estimatedPrice)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3.5 w-3.5" />
                        {mission.distance} km
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {mission.address}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleAcceptMission(mission.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accepter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDeclineMission(mission.id)}
                      >
                        Décliner
                      </Button>
                    </div>
                  </div>
                ))}

                {activeTab === "active" && mockMissions.active.map((mission) => (
                  <div key={mission.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{mission.type}</h3>
                      <Badge className="bg-blue-500">En route</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Client: {mission.clientName}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3.5 w-3.5" />
                        {mission.distance} km
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {mission.address}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => toast({ title: "Appel client..." })}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => toast({ title: "Navigation..." })}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Itinéraire
                      </Button>
                    </div>
                  </div>
                ))}

                {activeTab === "completed" && mockMissions.completed.map((mission) => (
                  <div key={mission.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{mission.type}</h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{mission.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Client: {mission.clientName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(mission.completedAt).toLocaleDateString("fr-FR")}
                      </span>
                      <span className="font-semibold text-green-600">
                        +{formatCurrency(mission.price)}
                      </span>
                    </div>
                  </div>
                ))}

                {mockMissions[activeTab].length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Aucune mission {activeTab === "pending" ? "en attente" : activeTab === "active" ? "en cours" : "terminée"}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Enterprise Applications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" />
                Entreprises partenaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Garage Auto Pro</p>
                      <p className="text-sm text-gray-500">Cocody, Abidjan</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Postuler
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toast({ title: "Voir toutes les entreprises..." })}
                >
                  Voir toutes les entreprises
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Specializations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-500" />
                  Mes spécialisations
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Modifier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mechanic.specializations.map((spec) => (
                  <Badge key={spec} className="bg-blue-100 text-blue-700 px-3 py-1">
                    {spec}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <BottomNav role="mechanic" />
      <AIAssistant />
    </div>
  );
}
