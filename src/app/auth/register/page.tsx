"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  ArrowLeft,
  User,
  Briefcase,
  Store,
  ChevronRight,
  ChevronLeft,
  Check,
  Car,
  FileText,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type UserRole = "user" | "mechanic" | "enterprise";

const steps = [
  { id: "role", title: "Type de compte" },
  { id: "personal", title: "Informations personnelles" },
  { id: "documents", title: "Documents" },
  { id: "vehicle", title: "Véhicule" },
  { id: "enterprise", title: "Entreprise" },
  { id: "mechanic", title: "Profil mécanicien" },
  { id: "confirm", title: "Confirmation" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const [formData, setFormData] = useState({
    // Personal info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    address: "",
    
    // Vehicle info (for users)
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
    plateNumber: "",
    
    // Enterprise info
    enterpriseName: "",
    enterpriseType: "",
    registrationNumber: "",
    responsibleFirstName: "",
    responsibleLastName: "",
    
    // Mechanic info
    experienceYears: "",
    specializations: [] as string[],
    hourlyRate: "",
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < getTotalSteps() - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTotalSteps = () => {
    if (!selectedRole) return 1;
    if (selectedRole === "user") return 5; // role, personal, documents, vehicle, confirm
    if (selectedRole === "mechanic") return 5; // role, personal, documents, mechanic, confirm
    return 5; // enterprise: role, personal, documents, enterprise, confirm
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès.",
      });
      router.push("/auth/login");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">
        Je suis un...
      </h2>
      <div className="grid gap-4">
        <button
          onClick={() => handleRoleSelect("user")}
          className="flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
        >
          <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <User className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Utilisateur</h3>
            <p className="text-sm text-gray-600">
              Je cherche un mécanicien pour mon véhicule
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => handleRoleSelect("mechanic")}
          className="flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
        >
          <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Briefcase className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Mécanicien</h3>
            <p className="text-sm text-gray-600">
              Je propose mes services de réparation
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => handleRoleSelect("enterprise")}
          className="flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
        >
          <div className="h-14 w-14 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Store className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Entreprise</h3>
            <p className="text-sm text-gray-600">
              Je gère un garage ou vends des pièces
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Informations personnelles</h2>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="Jean"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Dupont"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="jean.dupont@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+225 01 23 45 67 89"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date de naissance</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Abidjan, Cocody"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            placeholder="••••••••"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Documents d&apos;identité</h2>
      <p className="text-sm text-gray-600">
        Ces documents sont nécessaires pour vérifier votre identité
      </p>
      
      <div className="grid gap-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-orange transition-colors cursor-pointer">
          <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">CNI (Recto)</p>
          <p className="text-xs text-gray-500">Cliquez pour télécharger</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-orange transition-colors cursor-pointer">
          <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">CNI (Verso)</p>
          <p className="text-xs text-gray-500">Cliquez pour télécharger</p>
        </div>

        {selectedRole === "user" && (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-orange transition-colors cursor-pointer">
              <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Permis de conduire (Recto)</p>
              <p className="text-xs text-gray-500">Cliquez pour télécharger</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-orange transition-colors cursor-pointer">
              <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Permis de conduire (Verso)</p>
              <p className="text-xs text-gray-500">Cliquez pour télécharger</p>
            </div>
          </>
        )}

        {selectedRole === "mechanic" && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-orange transition-colors cursor-pointer">
            <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Diplôme mécanique</p>
            <p className="text-xs text-gray-500">Cliquez pour télécharger</p>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-orange transition-colors cursor-pointer">
          <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">Selfie avec CNI</p>
          <p className="text-xs text-gray-500">Prenez une photo de vous tenant votre CNI</p>
        </div>
      </div>
    </div>
  );

  const renderVehicleInfo = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Car className="h-5 w-5" />
        Informations du véhicule
      </h2>
      <p className="text-sm text-gray-600">
        Ajoutez au moins un véhicule. Vous pourrez en ajouter d&apos;autres plus tard.
      </p>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleType">Type de véhicule</Label>
          <select
            id="vehicleType"
            value={formData.vehicleType}
            onChange={(e) =>
              setFormData({ ...formData, vehicleType: e.target.value })
            }
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            required
          >
            <option value="">Sélectionnez...</option>
            <option value="car">Voiture</option>
            <option value="motorcycle">Moto</option>
            <option value="truck">Camion</option>
            <option value="van">Van</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleBrand">Marque</Label>
            <Input
              id="vehicleBrand"
              value={formData.vehicleBrand}
              onChange={(e) =>
                setFormData({ ...formData, vehicleBrand: e.target.value })
              }
              placeholder="Toyota"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleModel">Modèle</Label>
            <Input
              id="vehicleModel"
              value={formData.vehicleModel}
              onChange={(e) =>
                setFormData({ ...formData, vehicleModel: e.target.value })
              }
              placeholder="Corolla"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleYear">Année</Label>
            <Input
              id="vehicleYear"
              type="number"
              value={formData.vehicleYear}
              onChange={(e) =>
                setFormData({ ...formData, vehicleYear: e.target.value })
              }
              placeholder="2020"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plateNumber">Plaque</Label>
            <Input
              id="plateNumber"
              value={formData.plateNumber}
              onChange={(e) =>
                setFormData({ ...formData, plateNumber: e.target.value })
              }
              placeholder="AB-123-CD"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {["Avant", "Arrière", "Gauche", "Droite"].map((position) => (
            <div
              key={position}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-brand-orange transition-colors cursor-pointer"
            >
              <Camera className="h-6 w-6 mx-auto text-gray-400 mb-1" />
              <p className="text-xs font-medium text-gray-700">Photo {position}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMechanicProfile = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Profil mécanicien</h2>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Années d&apos;expérience</Label>
          <Input
            id="experienceYears"
            type="number"
            value={formData.experienceYears}
            onChange={(e) =>
              setFormData({ ...formData, experienceYears: e.target.value })
            }
            placeholder="5"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specializations">Spécialités</Label>
          <div className="grid grid-cols-2 gap-2">
            {["Moteur", "Électricité", "Carrosserie", "Climatisation", "Pneumatique", "Freins"].map(
              (spec) => (
                <label
                  key={spec}
                  className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.specializations.includes(spec)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          specializations: [...formData.specializations, spec],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          specializations: formData.specializations.filter(
                            (s) => s !== spec
                          ),
                        });
                      }
                    }}
                  />
                  <span className="text-sm">{spec}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Tarif horaire (FCFA)</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={formData.hourlyRate}
            onChange={(e) =>
              setFormData({ ...formData, hourlyRate: e.target.value })
            }
            placeholder="5000"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderEnterpriseInfo = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Informations entreprise</h2>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="enterpriseName">Nom de l&apos;entreprise</Label>
          <Input
            id="enterpriseName"
            value={formData.enterpriseName}
            onChange={(e) =>
              setFormData({ ...formData, enterpriseName: e.target.value })
            }
            placeholder="Garage Auto Pro"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="enterpriseType">Type d&apos;entreprise</Label>
          <select
            id="enterpriseType"
            value={formData.enterpriseType}
            onChange={(e) =>
              setFormData({ ...formData, enterpriseType: e.target.value })
            }
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            required
          >
            <option value="">Sélectionnez...</option>
            <option value="garage">Garage (réparation)</option>
            <option value="parts_seller">Vendeur de pièces</option>
            <option value="hybrid">Hybride (les deux)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Numéro d&apos;enregistrement</Label>
          <Input
            id="registrationNumber"
            value={formData.registrationNumber}
            onChange={(e) =>
              setFormData({ ...formData, registrationNumber: e.target.value })
            }
            placeholder="CI-AB-12345"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="responsibleFirstName">Prénom responsable</Label>
            <Input
              id="responsibleFirstName"
              value={formData.responsibleFirstName}
              onChange={(e) =>
                setFormData({ ...formData, responsibleFirstName: e.target.value })
              }
              placeholder="Jean"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsibleLastName">Nom responsable</Label>
            <Input
              id="responsibleLastName"
              value={formData.responsibleLastName}
              onChange={(e) =>
                setFormData({ ...formData, responsibleLastName: e.target.value })
              }
              placeholder="Dupont"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {["Façade", "Intérieur", "Équipement"].map((photo) => (
            <div
              key={photo}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-brand-orange transition-colors cursor-pointer"
            >
              <Camera className="h-6 w-6 mx-auto text-gray-400 mb-1" />
              <p className="text-xs font-medium text-gray-700">Photo {photo}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-4 text-center">
      <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold">Vérifiez vos informations</h2>
      <p className="text-gray-600">
        Votre compte sera soumis à validation par notre équipe.
        Vous recevrez une notification une fois approuvé.
      </p>
      <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 text-sm">
        <p><strong>Type:</strong> {selectedRole === "user" ? "Utilisateur" : selectedRole === "mechanic" ? "Mécanicien" : "Entreprise"}</p>
        <p><strong>Nom:</strong> {formData.firstName} {formData.lastName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Téléphone:</strong> {formData.phone}</p>
      </div>
    </div>
  );

  const getStepContent = () => {
    if (currentStep === 0) return renderRoleSelection();
    if (currentStep === 1) return renderPersonalInfo();
    if (currentStep === 2) return renderDocuments();
    if (currentStep === 3) {
      if (selectedRole === "user") return renderVehicleInfo();
      if (selectedRole === "mechanic") return renderMechanicProfile();
      return renderEnterpriseInfo();
    }
    return renderConfirmation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto"
      >
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange text-white mb-4">
            <Wrench className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inscription</h1>
          <p className="text-gray-600 mt-2">
            Créez votre compte Meca Master
          </p>
        </div>

        {/* Progress */}
        {selectedRole && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Étape {currentStep} sur {getTotalSteps() - 1}</span>
              <span>{Math.round(((currentStep) / (getTotalSteps() - 1)) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-orange transition-all duration-300"
                style={{ width: `${(currentStep / (getTotalSteps() - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border p-6"
          >
            {getStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {selectedRole && (
          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
            <Button
              onClick={currentStep === getTotalSteps() - 1 ? handleSubmit : handleNext}
              className="flex-1 bg-brand-orange hover:bg-brand-orange-dark h-12"
              loading={isLoading}
            >
              {currentStep === getTotalSteps() - 1 ? (
                "Confirmer l'inscription"
              ) : (
                <>
                  Continuer
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Login link */}
        <p className="text-center mt-6 text-gray-600">
          Déjà un compte ?{" "}
          <Link
            href="/auth/login"
            className="text-brand-orange hover:underline font-medium"
          >
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
