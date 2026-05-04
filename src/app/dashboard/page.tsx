"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  DollarSign,
  MapPin,
  Wrench,
  Star,
  Zap,
  TrendingUp,
  Calendar,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModernLayout } from "@/components/modern-sidebar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Données mock modernisées
const mockUser = {
  firstName: "Jean",
  lastName: "Dupont",
  avatar: null,
  location: "Abidjan, Cocody",
  memberSince: "2024",
};

const mockVehicle = {
  brand: "Toyota",
  model: "Corolla",
  year: 2020,
  plateNumber: "AB-123-CD",
  health: 85,
  nextMaintenance: "Dans 15 jours",
};

const mockStats = {
  totalSpent: 125000,
  interventions: 8,
  savings: 25000,
  rating: 4.8,
};

const mockRecentInterventions = [
  {
    id: "1",
    date: "2026-04-15",
    mechanic: "Pierre K.",
    type: "Vidange",
    amount: 25000,
    status: "completed",
    icon: CheckCircle,
    color: "#10b981",
  },
  {
    id: "2",
    date: "2026-03-20",
    mechanic: "Garage Auto Pro",
    type: "Freins",
    amount: 45000,
    status: "completed",
    icon: CheckCircle,
    color: "#10b981",
  },
  {
    id: "3",
    date: "2026-05-10",
    mechanic: "En attente",
    type: "Climatisation",
    amount: 35000,
    status: "pending",
    icon: Clock,
    color: "#f59e0b",
  },
];

export default function DashboardPage() {
  const [currentUser] = useState(mockUser);
  const [currentVehicle] = useState(mockVehicle);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <ModernLayout role="user" userName={`${currentUser.firstName} ${currentUser.lastName}`}>
      {/* Header moderne */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-bold text-xl">
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </span>
            </div>
            <div>
              <p className="text-sm text-white/60">Bienvenue 👋</p>
              <h2 className="text-2xl font-bold text-white">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className="text-sm text-white/50 flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {currentUser.location}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Button className="btn-vibrant text-white px-6 h-12">
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle demande
            </Button>
          </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Vehicle Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="h-5 w-5 text-emerald-500" />
                  Mon véhicule
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-emerald-600">
                  Modifier
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Vehicle Photo Carousel */}
              <div className="relative mb-4">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {/* Placeholder - replace with actual image */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Car className="h-20 w-20 text-gray-300" />
                  </div>
                </div>
                {/* Photo indicators */}
                <div className="flex justify-center gap-2 mt-3">
                  {(["front", "back", "left", "right"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setActivePhoto(pos)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        activePhoto === pos ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Marque / Modèle</p>
                  <p className="font-semibold text-gray-900">
                    {currentVehicle.brand} {currentVehicle.model}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Année</p>
                  <p className="font-semibold text-gray-900">{currentVehicle.year}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500">Plaque</p>
                  <p className="font-semibold text-gray-900">{currentVehicle.plateNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Expenses Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Dépenses ce mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(monthlyExpenses)}
                </span>
                <span className="text-sm text-gray-500 mb-1">FCFA</span>
              </div>
              {/* Simple bar chart */}
              <div className="flex items-end gap-2 h-24">
                {[30, 45, 25, 60, 40, 75, 50].map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                7 derniers jours
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Recent Interventions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-emerald-500" />
                  Interventions récentes
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-emerald-600">
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentInterventions.map((intervention) => (
                  <div
                    key={intervention.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{intervention.type}</p>
                      <p className="text-sm text-gray-500">{intervention.mechanic}</p>
                      <p className="text-xs text-gray-400">{formatDate(intervention.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(intervention.amount)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                        <Star className="h-3 w-3 fill-current" />
                        4.5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            variant="outline"
            className="h-auto py-4 flex-col items-center gap-2 border-emerald-200 hover:bg-emerald-50"
            onClick={() => toast({ title: "Fonctionnalité à venir" })}
          >
            <Car className="h-6 w-6 text-emerald-500" />
            <span className="text-sm">Carnet de santé</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col items-center gap-2 border-emerald-200 hover:bg-emerald-50"
            onClick={() => toast({ title: "Fonctionnalité à venir" })}
          >
            <DollarSign className="h-6 w-6 text-emerald-500" />
            <span className="text-sm">Historique</span>
          </Button>
        </motion.section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav role="user" />
    </div>
  );
}
