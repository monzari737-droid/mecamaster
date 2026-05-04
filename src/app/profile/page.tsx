"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Car,
  FileText,
  Settings,
  ChevronRight,
  LogOut,
  Edit,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Wrench,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { AIAssistant } from "@/components/ai/ai-assistant";

// Mock user data
const mockUser = {
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean.dupont@email.com",
  phone: "+225 01 23 45 67 89",
  avatar: null,
  role: "user" as const,
  address: "Cocody, Abidjan",
  vehicles: [
    {
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      plateNumber: "AB-123-CD",
      isPrimary: true,
    },
  ],
};

const menuItems = [
  { icon: User, label: "Informations personnelles", href: "/profile/edit" },
  { icon: Car, label: "Mes véhicules", href: "/profile/vehicles" },
  { icon: FileText, label: "Carnet de santé du véhicule", href: "/profile/health-record" },
  { icon: History, label: "Historique des dépenses", href: "/profile/expenses" },
  { icon: CreditCard, label: "Moyens de paiement", href: "/profile/payment" },
  { icon: Bell, label: "Notifications", href: "/profile/notifications" },
  { icon: Shield, label: "Sécurité", href: "/profile/security" },
  { icon: Settings, label: "Paramètres", href: "/profile/settings" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user] = useState(mockUser);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Mon Profil</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-emerald-100">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 h-8 w-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {user.address}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Vehicles Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="h-5 w-5 text-emerald-500" />
                  Mes véhicules
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-emerald-600">
                  <Edit className="h-4 w-4 mr-1" />
                  Gérer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Car className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vehicle.year} • {vehicle.plateNumber}
                      </p>
                    </div>
                    {vehicle.isPrimary && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => toast({ title: "Ajout de véhicule..." })}
                >
                  + Ajouter un véhicule
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Menu Items */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-0">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.href === "/profile/health-record") {
                        toast({
                          title: "Carnet de santé",
                          description: "Cette section est modifiable uniquement par les mécaniciens.",
                        });
                      } else {
                        toast({ title: `${item.label} - En développement` });
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                      index !== menuItems.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="flex-1 text-left font-medium text-gray-900">
                      {item.label}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </motion.section>

        {/* Stats Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-emerald-500" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">12</p>
                  <p className="text-xs text-gray-500">Interventions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">5</p>
                  <p className="text-xs text-gray-500">Mécaniciens</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">3</p>
                  <p className="text-xs text-gray-500">Achats</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Logout Button */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            variant="outline"
            className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Se déconnecter
          </Button>
        </motion.section>

        {/* App Info */}
        <div className="text-center text-xs text-gray-400">
          <p>Meca Master v1.0.0</p>
          <p>© 2026 Tous droits réservés</p>
        </div>
      </main>

      <BottomNav role="user" />
      <AIAssistant />
    </div>
  );
}
