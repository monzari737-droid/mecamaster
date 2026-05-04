"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Filter,
  Star,
  MapPin,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { useToast } from "@/hooks/use-toast";

// Categories
const categories = [
  { id: "all", name: "Tous", icon: "🔧" },
  { id: "brakes", name: "Freins", icon: "🛑" },
  { id: "engine", name: "Moteur", icon: "⚙️" },
  { id: "filters", name: "Filtres", icon: "🌀" },
  { id: "electrical", name: "Électricité", icon: "⚡" },
  { id: "body", name: "Carrosserie", icon: "🚗" },
  { id: "tires", name: "Pneus", icon: "🛞" },
  { id: "ac", name: "Climatisation", icon: "❄️" },
];

// Mock products
const mockProducts = [
  {
    id: "1",
    name: "Plaquettes de frein avant - Toyota Corolla",
    description: "Plaquettes de frein haute qualité pour Toyota Corolla 2010-2020",
    category: "brakes",
    price: 15000,
    stockQuantity: 15,
    enterpriseId: "1",
    enterpriseName: "Auto Pieces CI",
    enterpriseRating: 4.7,
    photos: ["/brake-pads.jpg"],
    compatibility: {
      brands: ["Toyota"],
      models: ["Corolla"],
      years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    },
    isActive: true,
  },
  {
    id: "2",
    name: "Filtre à huile - Universel",
    description: "Filtre à huile compatible avec la plupart des véhicules",
    category: "filters",
    price: 3500,
    stockQuantity: 8,
    enterpriseId: "2",
    enterpriseName: "Garage Pro Pieces",
    enterpriseRating: 4.5,
    photos: ["/oil-filter.jpg"],
    compatibility: {
      brands: ["Toyota", "Honda", "Nissan", "Hyundai"],
      models: ["Corolla", "Civic", "Sentra", "Elantra"],
      years: [2015, 2016, 2017, 2018, 2019, 2020],
    },
    isActive: true,
  },
  {
    id: "3",
    name: "Batterie 12V 60Ah - Varta",
    description: "Batterie de démarrage haute performance",
    category: "electrical",
    price: 45000,
    stockQuantity: 5,
    enterpriseId: "1",
    enterpriseName: "Auto Pieces CI",
    enterpriseRating: 4.7,
    photos: ["/battery.jpg"],
    compatibility: {
      brands: ["Toyota", "Honda", "Mitsubishi"],
      models: ["Corolla", "Civic", "Lancer"],
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
    },
    isActive: true,
  },
  {
    id: "4",
    name: "Courroie de distribution - Kit complet",
    description: "Kit distribution avec galet tendeur et pompe à eau",
    category: "engine",
    price: 65000,
    stockQuantity: 3,
    enterpriseId: "3",
    enterpriseName: "Mecanique Express",
    enterpriseRating: 4.8,
    photos: ["/timing-belt.jpg"],
    compatibility: {
      brands: ["Toyota"],
      models: ["Corolla", "Avensis"],
      years: [2012, 2013, 2014, 2015, 2016, 2017, 2018],
    },
    isActive: true,
  },
  {
    id: "5",
    name: "Pneu 195/65R15 - Michelin",
    description: "Pneu été haute qualité",
    category: "tires",
    price: 35000,
    stockQuantity: 12,
    enterpriseId: "4",
    enterpriseName: "Pneumatiques Abidjan",
    enterpriseRating: 4.6,
    photos: ["/tire.jpg"],
    compatibility: {
      brands: ["Toyota", "Honda", "Renault"],
      models: ["Corolla", "Civic", "Megane"],
      years: [2015, 2016, 2017, 2018, 2019, 2020],
    },
    isActive: true,
  },
  {
    id: "6",
    name: "Compresseur de climatisation",
    description: "Compresseur clim reconditionné avec garantie",
    category: "ac",
    price: 85000,
    stockQuantity: 2,
    enterpriseId: "2",
    enterpriseName: "Garage Pro Pieces",
    enterpriseRating: 4.5,
    photos: ["/ac-compressor.jpg"],
    compatibility: {
      brands: ["Toyota"],
      models: ["Corolla", "RAV4"],
      years: [2014, 2015, 2016, 2017, 2018, 2019],
    },
    isActive: true,
  },
];

export default function MarketplacePage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [quantity, setQuantity] = useState(1);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = () => {
    toast({
      title: "Ajouté au panier",
      description: `${selectedProduct?.name} (x${quantity})`,
    });
    setSelectedProduct(null);
    setQuantity(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-emerald-500" />
            Marché
          </h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des pièces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Categories */}
        <div className="px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-emerald-500 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 pb-6">
          <p className="text-sm text-gray-500 mb-4">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full"
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardContent className="p-0">
                    {/* Product Image Placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-300" />
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                        {product.name}
                      </h3>
                      
                      <p className="text-lg font-bold text-emerald-600 mt-1">
                        {formatPrice(product.price)}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        {product.enterpriseName}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{product.enterpriseRating}</span>
                      </div>

                      {product.stockQuantity <= 5 && (
                        <Badge variant="destructive" className="mt-2 text-xs">
                          Stock limité: {product.stockQuantity}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
              <p className="text-gray-500 mt-1">Essayez de modifier votre recherche</p>
            </div>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold pr-8">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
              >
                <ChevronRight className="h-6 w-6 rotate-90" />
              </button>
            </div>

            {/* Product Image */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="h-20 w-20 text-gray-300" />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-2xl text-emerald-600">
                  {formatPrice(selectedProduct.price)}
                </h3>
                <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
              </div>

              {/* Seller info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Vendeur</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-medium">{selectedProduct.enterpriseName}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{selectedProduct.enterpriseRating}</span>
                  </div>
                </div>
              </div>

              {/* Compatibility */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Compatibilité</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.compatibility.brands.map((brand) => (
                    <Badge key={brand} variant="secondary">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stock disponible</span>
                <span className={`font-medium ${selectedProduct.stockQuantity <= 5 ? "text-red-500" : "text-green-600"}`}>
                  {selectedProduct.stockQuantity} unités
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Quantité</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stockQuantity, quantity + 1))}
                    className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-emerald-600">
                    {formatPrice(selectedProduct.price * quantity)}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      toast({ title: "Contacter le vendeur..." });
                    }}
                  >
                    Contacter
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    onClick={handleAddToCart}
                  >
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav role="user" />
    </div>
  );
}
