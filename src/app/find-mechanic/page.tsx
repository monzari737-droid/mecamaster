"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Wrench,
  Clock,
  Filter,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ModernLayout } from "@/components/modern-sidebar";

// Mock mechanics - À remplacer par API réelle
const mockMechanics = [
  {
    id: "1",
    name: "Pierre Koffi",
    rating: 4.8,
    distance: 2.3,
    specialties: ["Moteur", "Électricité"],
    phone: "+225 07 00 00 00 01",
    status: "available",
    responseTime: "8 min",
    price: "5000 FCFA/h",
    image: null,
  },
  {
    id: "2", 
    name: "Garage Auto Pro",
    rating: 4.6,
    distance: 3.7,
    specialties: ["Freins", "Suspension"],
    phone: "+225 07 00 00 00 02",
    status: "busy",
    responseTime: "15 min",
    price: "7000 FCFA/h",
    image: null,
  },
  {
    id: "3",
    name: "Marc Traoré",
    rating: 4.9,
    distance: 5.1,
    specialties: ["Climatisation", "Diagnostic"],
    phone: "+225 07 00 00 00 03", 
    status: "available",
    responseTime: "12 min",
    price: "6000 FCFA/h",
    image: null,
  },
];

export default function FindMechanicPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [mechanics, setMechanics] = useState(mockMechanics);

  const specialties = [
    { id: "all", label: "Tous" },
    { id: "Moteur", label: "Moteur" },
    { id: "Électricité", label: "Électricité" },
    { id: "Freins", label: "Freins" },
    { id: "Climatisation", label: "Climatisation" },
  ];

  const filteredMechanics = mechanics.filter(mechanic => {
    const matchesSearch = mechanic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || 
      mechanic.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <ModernLayout role="user" userName="Utilisateur">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trouver un Mécanicien
          </h1>
          <p className="text-gray-600">
            Des mécaniciens vérifiés près de chez vous
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un mécanicien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Specialty Filters */}
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <Button
                key={specialty.id}
                variant={selectedSpecialty === specialty.id ? "default" : "outline"}
                onClick={() => setSelectedSpecialty(specialty.id)}
                className="flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                {specialty.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMechanics.map((mechanic, index) => (
            <motion.div
              key={mechanic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {mechanic.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {mechanic.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          {mechanic.rating}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={mechanic.status === "available" ? "default" : "secondary"}
                      className={
                        mechanic.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {mechanic.status === "available" ? "Disponible" : "Occupé"}
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {mechanic.distance} km
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {mechanic.responseTime}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">
                        {mechanic.price}
                      </span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mechanic.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Appeler
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMechanics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun mécanicien trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos filtres de recherche
            </p>
          </motion.div>
        )}
      </div>
    </ModernLayout>
  );
}
