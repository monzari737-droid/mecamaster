import { ReactNode } from "react";

export type UserRole = "user" | "mechanic" | "enterprise" | "admin";

export type UserStatus = "pending" | "active" | "suspended" | "blocked";

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  age?: number;
  avatarUrl?: string;
  address?: string;
  city?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  documents?: {
    cniFront?: string;
    cniBack?: string;
    licenseFront?: string;
    licenseBack?: string;
    selfie?: string;
  };
  verifiedAt?: Date;
}

export interface MechanicProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone: string;
  email: string;
  documents?: {
    cniFront?: string;
    cniBack?: string;
    diploma?: string;
    certifications?: string[];
  };
  experienceYears: number;
  specializations: string[];
  workRadiusKm: number;
  hourlyRate?: number;
  availability?: {
    monday?: { start: string; end: string };
    tuesday?: { start: string; end: string };
    wednesday?: { start: string; end: string };
    thursday?: { start: string; end: string };
    friday?: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  balance: number;
  subscriptionActive: boolean;
  subscriptionExpiresAt?: Date;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface EnterpriseProfile {
  id: string;
  userId: string;
  responsibleFirstName: string;
  responsibleLastName: string;
  responsiblePhone: string;
  responsibleEmail: string;
  responsibleAvatarUrl?: string;
  enterpriseName: string;
  enterpriseType: "garage" | "parts_seller" | "hybrid";
  registrationNumber?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  openingHours?: {
    monday?: { open: string; close: string; isOpen: boolean };
    tuesday?: { open: string; close: string; isOpen: boolean };
    wednesday?: { open: string; close: string; isOpen: boolean };
    thursday?: { open: string; close: string; isOpen: boolean };
    friday?: { open: string; close: string; isOpen: boolean };
    saturday?: { open: string; close: string; isOpen: boolean };
    sunday?: { open: string; close: string; isOpen: boolean };
  };
  legalDocuments?: {
    registrationCertificate?: string;
    proofOfAddress?: string;
    license?: string;
    insurance?: string;
  };
  services: string[];
  rating: number;
  reviewCount: number;
  balance: number;
  visibilitySubscription: boolean;
  premiumSubscription: boolean;
}

export interface Vehicle {
  id: string;
  userId: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color?: string;
  mileage?: number;
  photos?: {
    front?: string;
    back?: string;
    left?: string;
    right?: string;
    dashboard?: string;
  };
  isPrimary: boolean;
}

export interface SOSRequest {
  id: string;
  userId: string;
  vehicleId?: string;
  type: string;
  description?: string;
  photos?: string[];
  latitude: number;
  longitude: number;
  address?: string;
  searchRadiusKm: number;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface Mission {
  id: string;
  sosId: string;
  mechanicId: string;
  status: "pending" | "accepted" | "en_route" | "arrived" | "in_progress" | "completed" | "cancelled";
  acceptedAt?: Date;
  startedAt?: Date;
  enRouteAt?: Date;
  arrivedAt?: Date;
  completedAt?: Date;
  price?: number;
  commission?: number;
  finalPrice?: number;
  rating?: number;
  review?: string;
}

export interface Product {
  id: string;
  enterpriseId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  photos?: string[];
  compatibility?: {
    brands?: string[];
    models?: string[];
    years?: number[];
  };
  manufacturerRef?: string;
  isActive: boolean;
  enterpriseName?: string;
  enterpriseRating?: number;
}

export interface Order {
  id: string;
  userId: string;
  enterpriseId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  commission?: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "shipped" | "delivered" | "cancelled";
  deliveryAddress?: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal" | "mission_payment" | "subscription" | "commission" | "refund" | "product_sale" | "product_purchase";
  amount: number;
  balanceAfter: number;
  description?: string;
  referenceId?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  missionId?: string;
  orderId?: string;
  rating: number;
  punctualityRating?: number;
  qualityRating?: number;
  communicationRating?: number;
  valueRating?: number;
  comment?: string;
  createdAt: Date;
  reviewerName?: string;
  reviewerAvatar?: string;
}

export interface VehicleHealthRecord {
  id: string;
  vehicleId: string;
  mechanicId?: string;
  missionId?: string;
  date: Date;
  interventionType: string;
  description: string;
  partsChanged?: { name: string; reference?: string; price?: number }[];
  cost?: number;
  mileage?: number;
  photos?: string[];
  nextServiceRecommendation?: string;
  nextServiceDue?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export interface AIChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  context?: Record<string, unknown>;
  createdAt: Date;
}

export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  color?: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface BottomNavItem {
  href: string;
  label: string;
  icon: ReactNode;
  isSOS?: boolean;
}
