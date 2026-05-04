"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Store,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  PieChart,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Building,
  Plus,
  Edit,
  Wrench,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { AIAssistant } from "@/components/ai/ai-assistant";

// Mock enterprise data
const mockEnterprise = {
  name: "Garage Auto Pro",
  type: "hybrid" as const,
  rating: 4.7,
  reviewCount: 156,
  address: "Cocody, Riviera",
  responsibleName: "Kouamé B.",
  avatar: null,
  balance: 450000,
  todayRevenue: 125000,
  weekRevenue: 680000,
  monthRevenue: 2450000,
  subscriptionActive: true,
  premiumSubscription: true,
};

// Mock mechanics
const mockMechanics = [
  {
    id: "1",
    firstName: "Pierre",
    lastName: "Konan",
    avatar: null,
    rating: 4.8,
    missionsCount: 45,
    revenue: 450000,
    status: "active",
  },
  {
    id: "2",
    firstName: "Amadou",
    lastName: "Diallo",
    avatar: null,
    rating: 4.6,
    missionsCount: 32,
    revenue: 320000,
    status: "active",
  },
];

// Mock products
const mockProducts = [
  {
    id: "1",
    name: "Plaquettes de frein - Toyota",
    price: 15000,
    stock: 15,
    lowStock: false,
    sales: 23,
  },
  {
    id: "2",
    name: "Filtre à huile - Universel",
    price: 3500,
    stock: 3,
    lowStock: true,
    sales: 45,
  },
  {
    id: "3",
    name: "Batterie 12V 60Ah",
    price: 45000,
    stock: 8,
    lowStock: false,
    sales: 12,
  },
];

// Mock orders
const mockOrders = [
  {
    id: "CMD-001",
    customer: "Jean D.",
    items: 3,
    total: 52000,
    status: "pending" as const,
    date: "2026-05-03T10:30:00",
  },
  {
    id: "CMD-002",
    customer: "Marie K.",
    items: 2,
    total: 18500,
    status: "confirmed" as const,
    date: "2026-05-03T09:15:00",
  },
  {
    id: "CMD-003",
    customer: "Paul B.",
    items: 1,
    total: 45000,
    status: "delivered" as const,
    date: "2026-05-02T16:45:00",
  },
];

// Chart data
const revenueByCategory = [
  { name: "Pièces", value: 60, color: "bg-orange-500" },
  { name: "Services", value: 40, color: "bg-blue-500" },
];

const weeklyRevenue = [
  { day: "Lun", amount: 85000 },
  { day: "Mar", amount: 120000 },
  { day: "Mer", amount: 95000 },
  { day: "Jeu", amount: 140000 },
  { day: "Ven", amount: 110000 },
  { day: "Sam", amount: 180000 },
  { day: "Dim", amount: 75000 },
];

export default function EnterpriseDashboardPage() {
  const { toast } = useToast();
  const [enterprise] = useState(mockEnterprise);
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "delivered">("pending");

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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-700" },
      confirmed: { label: "Confirmée", className: "bg-blue-100 text-blue-700" },
      preparing: { label: "En préparation", className: "bg-purple-100 text-purple-700" },
      shipped: { label: "Expédiée", className: "bg-indigo-100 text-indigo-700" },
      delivered: { label: "Livrée", className: "bg-green-100 text-green-700" },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Store className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold">{enterprise.name}</h1>
              <div className="flex items-center gap-2 text-sm text-orange-100">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{enterprise.rating}</span>
                <span>({enterprise.reviewCount} avis)</span>
                {enterprise.premiumSubscription && (
                  <Badge className="bg-yellow-400 text-yellow-900 text-xs ml-2">
                    PREMIUM
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
              <p className="text-lg font-bold">{formatCurrency(enterprise.todayRevenue)}</p>
              <p className="text-xs text-orange-100">Aujourd&apos;hui</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
              <p className="text-lg font-bold">{formatCurrency(enterprise.weekRevenue)}</p>
              <p className="text-xs text-orange-100">Cette semaine</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
              <p className="text-lg font-bold">{formatCurrency(enterprise.monthRevenue)}</p>
              <p className="text-xs text-orange-100">Ce mois</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-orange-100 text-sm">Solde disponible</p>
                  <p className="text-3xl font-bold">{formatCurrency(enterprise.balance)}</p>
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
                  className="flex-1 bg-white text-orange-600 hover:bg-white/90"
                  onClick={() => toast({ title: "Retrait..." })}
                >
                  Retirer
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Revenue Charts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Revenus cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {weeklyRevenue.map((data, index) => (
                  <div key={data.day} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-orange-500 rounded-t-sm transition-all hover:bg-orange-600"
                      style={{ height: `${(data.amount / 200000) * 100}%` }}
                    />
                    <p className="text-xs text-gray-500 mt-1">{data.day}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Revenue Distribution */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-orange-500" />
                Répartition des revenus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                    {revenueByCategory.map((category, index) => {
                      const offset = revenueByCategory
                        .slice(0, index)
                        .reduce((acc, c) => acc + c.value, 0);
                      return (
                        <circle
                          key={category.name}
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className={category.color}
                          strokeDasharray={`${category.value} ${100 - category.value}`}
                          strokeDashoffset={-offset}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {revenueByCategory.map((category) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${category.color}`} />
                      <span className="text-sm text-gray-600 flex-1">{category.name}</span>
                      <span className="font-medium">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Orders Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-orange-500" />
                  Commandes
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-orange-600">
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {(["pending", "confirmed", "delivered"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab === "pending" && "En attente"}
                    {tab === "confirmed" && "Confirmées"}
                    {tab === "delivered" && "Livrées"}
                  </button>
                ))}
              </div>

              {/* Order List */}
              <div className="space-y-3">
                {mockOrders
                  .filter((order) => order.status === activeTab)
                  .map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{order.id}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <span className="font-bold text-orange-600">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{order.customer}</span>
                        <span>{order.items} article(s)</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(order.date).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  ))}

                {mockOrders.filter((o) => o.status === activeTab).length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Aucune commande</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Stock Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-500" />
                  Stock produits
                </CardTitle>
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => toast({ title: "Ajout produit..." })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      product.lowStock ? "bg-red-50 border border-red-200" : "bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${product.lowStock ? "text-red-600" : "text-gray-900"}`}>
                        {product.stock} en stock
                      </p>
                      {product.lowStock && (
                        <p className="text-xs text-red-500">Stock faible !</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => toast({ title: "Gestion complète du stock..." })}
              >
                Gérer tout le stock
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        {/* Mechanics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  Mécaniciens affiliés
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-orange-600">
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockMechanics.map((mechanic) => (
                  <div key={mechanic.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mechanic.avatar || undefined} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(mechanic.firstName, mechanic.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {mechanic.firstName} {mechanic.lastName}
                        </p>
                        <div className="flex items-center gap-0.5 text-sm text-yellow-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {mechanic.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {mechanic.missionsCount} missions • {formatCurrency(mechanic.revenue)} générés
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      Actif
                    </Badge>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => toast({ title: "Recrutement mécanicien..." })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Recruter un mécanicien
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        {/* Subscription Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className={enterprise.premiumSubscription ? "bg-yellow-50 border-yellow-200" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Abonnement</p>
                  <p className="text-sm text-gray-500">
                    {enterprise.premiumSubscription ? "Premium (1000 FCFA/mois)" : "Visibilité (500 FCFA/mois)"}
                  </p>
                </div>
                <Badge className={enterprise.premiumSubscription ? "bg-yellow-400 text-yellow-900" : "bg-orange-500"}>
                  Actif
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <BottomNav role="enterprise" />
      <AIAssistant />
    </div>
  );
}
