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

import { createNewUser, getWelcomeMessage, getEmptyStateMessage } from "@/lib/real-data";

// Données RÉELLES - plus de fausses informations !
const currentUser = createNewUser({
  firstName: "Utilisateur",
  lastName: "Test",
  email: "test@mecamaster.com",
  role: "user",
});

// Stats RÉELLES - initialisées à 0 pour les nouveaux comptes
const realStats = {
  totalSpent: 0,
  interventions: 0,
  savings: 0,
  rating: 0,
};

const currentVehicle = null; // Pas de véhicule au début

// Plus de fausses interventions ! État vide pour nouveaux comptes
const recentInterventions: any[] = [];

export default function DashboardPage() {
  const [user] = useState(currentUser);
  const [vehicle] = useState(currentVehicle);

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
    <ModernLayout role="user" userName={`${user.firstName} ${user.lastName}`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                {getProfessionalWelcomeMessage(user)}
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un véhicule
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(realStats.totalSpent)}
              </h3>
              <p className="text-gray-600 text-sm">Total dépensé</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {realStats.interventions}
              </h3>
              <p className="text-gray-600 text-sm">Interventions</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {realStats.vehicles}
              </h3>
              <p className="text-gray-600 text-sm">Véhicules</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {realStats.memberSince}
              </h3>
              <p className="text-gray-600 text-sm">Membre depuis</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Empty State - No vehicle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun véhicule enregistré
              </h3>
              <p className="text-gray-600 mb-4">
                Ajoutez votre premier véhicule pour commencer à utiliser toutes les fonctionnalités.
              </p>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter un véhicule
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ModernLayout>
  );
}
