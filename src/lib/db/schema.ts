import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "user",
  "mechanic",
  "enterprise",
  "admin",
]);

export const userStatusEnum = pgEnum("user_status", [
  "pending",
  "active",
  "suspended",
  "blocked",
]);

export const sosStatusEnum = pgEnum("sos_status", [
  "pending",
  "accepted",
  "in_progress",
  "completed",
  "cancelled",
]);

export const missionStatusEnum = pgEnum("mission_status", [
  "pending",
  "accepted",
  "en_route",
  "arrived",
  "in_progress",
  "completed",
  "cancelled",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "deposit",
  "withdrawal",
  "mission_payment",
  "subscription",
  "commission",
  "refund",
  "product_sale",
  "product_purchase",
]);

export const enterpriseTypeEnum = pgEnum("enterprise_type", [
  "garage",
  "parts_seller",
  "hybrid",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
]);

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 50 }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: userRoleEnum("role").notNull().default("user"),
    status: userStatusEnum("status").notNull().default("pending"),
    emailVerified: boolean("email_verified").default(false),
    phoneVerified: boolean("phone_verified").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastLoginAt: timestamp("last_login_at"),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
      phoneIdx: index("phone_idx").on(table.phone),
      roleIdx: index("role_idx").on(table.role),
    };
  }
);

// User Profiles
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  age: integer("age"),
  avatarUrl: text("avatar_url"),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }).default("CI"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  documents: jsonb("documents").$type<{
    cniFront?: string;
    cniBack?: string;
    licenseFront?: string;
    licenseBack?: string;
    selfie?: string;
  }>(),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Mechanic Profiles
export const mechanicProfiles = pgTable("mechanic_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  age: integer("age"),
  avatarUrl: text("avatar_url"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  documents: jsonb("documents").$type<{
    cniFront?: string;
    cniBack?: string;
    diploma?: string;
    certifications?: string[];
  }>(),
  experienceYears: integer("experience_years").default(0),
  specializations: jsonb("specializations").$type<string[]>().default([]),
  workRadiusKm: integer("work_radius_km").default(10),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  availability: jsonb("availability").$type<{
    monday?: { start: string; end: string };
    tuesday?: { start: string; end: string };
    wednesday?: { start: string; end: string };
    thursday?: { start: string; end: string };
    friday?: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  }>(),
  isAvailable: boolean("is_available").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0"),
  subscriptionActive: boolean("subscription_active").default(false),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Enterprise Profiles
export const enterpriseProfiles = pgTable("enterprise_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  responsibleFirstName: varchar("responsible_first_name", { length: 100 }).notNull(),
  responsibleLastName: varchar("responsible_last_name", { length: 100 }).notNull(),
  responsibleAge: integer("responsible_age"),
  responsiblePhone: varchar("responsible_phone", { length: 50 }),
  responsibleEmail: varchar("responsible_email", { length: 255 }),
  responsibleAvatarUrl: text("responsible_avatar_url"),
  responsibleDocuments: jsonb("responsible_documents").$type<{
    cniFront?: string;
    cniBack?: string;
  }>(),
  enterpriseName: varchar("enterprise_name", { length: 255 }).notNull(),
  enterpriseType: enterpriseTypeEnum("enterprise_type").notNull(),
  registrationNumber: varchar("registration_number", { length: 100 }),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }).default("CI"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  photos: jsonb("photos").$type<string[]>().default([]),
  openingHours: jsonb("opening_hours").$type<{
    monday?: { open: string; close: string; isOpen: boolean };
    tuesday?: { open: string; close: string; isOpen: boolean };
    wednesday?: { open: string; close: string; isOpen: boolean };
    thursday?: { open: string; close: string; isOpen: boolean };
    friday?: { open: string; close: string; isOpen: boolean };
    saturday?: { open: string; close: string; isOpen: boolean };
    sunday?: { open: string; close: string; isOpen: boolean };
  }>(),
  legalDocuments: jsonb("legal_documents").$type<{
    registrationCertificate?: string;
    proofOfAddress?: string;
    license?: string;
    insurance?: string;
  }>(),
  services: jsonb("services").$type<string[]>().default([]),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0"),
  visibilitySubscription: boolean("visibility_subscription").default(false),
  visibilitySubscriptionExpiresAt: timestamp("visibility_subscription_expires_at"),
  premiumSubscription: boolean("premium_subscription").default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vehicles
export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 50 }).notNull(), // car, motorcycle, truck, etc.
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  plateNumber: varchar("plate_number", { length: 50 }).notNull(),
  color: varchar("color", { length: 50 }),
  mileage: integer("mileage"),
  photos: jsonb("photos").$type<{
    front?: string;
    back?: string;
    left?: string;
    right?: string;
    dashboard?: string;
  }>(),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// SOS Requests
export const sosRequests = pgTable("sos_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  type: varchar("type", { length: 100 }).notNull(), // engine, tire, battery, accident, etc.
  description: text("description"),
  photos: jsonb("photos").$type<string[]>(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  searchRadiusKm: integer("search_radius_km").default(10),
  status: sosStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// Missions
export const missions = pgTable("missions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sosId: uuid("sos_id")
    .references(() => sosRequests.id, { onDelete: "cascade" })
    .notNull(),
  mechanicId: uuid("mechanic_id")
    .references(() => users.id)
    .notNull(),
  status: missionStatusEnum("status").default("pending").notNull(),
  acceptedAt: timestamp("accepted_at"),
  startedAt: timestamp("started_at"),
  enRouteAt: timestamp("en_route_at"),
  arrivedAt: timestamp("arrived_at"),
  completedAt: timestamp("completed_at"),
  price: decimal("price", { precision: 10, scale: 2 }),
  commission: decimal("commission", { precision: 10, scale: 2 }),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }),
  rating: integer("rating"),
  review: text("review"),
  cancellationReason: text("cancellation_reason"),
  cancelledBy: uuid("cancelled_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products (Marketplace)
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  enterpriseId: uuid("enterprise_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  photos: jsonb("photos").$type<string[]>(),
  compatibility: jsonb("compatibility").$type<{
    brands?: string[];
    models?: string[];
    years?: number[];
  }>(),
  manufacturerRef: varchar("manufacturer_ref", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  enterpriseId: uuid("enterprise_id")
    .references(() => users.id)
    .notNull(),
  items: jsonb("items").$type<
    {
      productId: string;
      name: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[]
  >().notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }),
  status: orderStatusEnum("status").default("pending").notNull(),
  deliveryAddress: text("delivery_address"),
  deliveryLatitude: decimal("delivery_latitude", { precision: 10, scale: 8 }),
  deliveryLongitude: decimal("delivery_longitude", { precision: 11, scale: 8 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transactions
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  referenceId: uuid("reference_id"), // Mission or Order ID
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  reviewerId: uuid("reviewer_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  revieweeId: uuid("reviewee_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  missionId: uuid("mission_id").references(() => missions.id),
  orderId: uuid("order_id").references(() => orders.id),
  rating: integer("rating").notNull(),
  punctualityRating: integer("punctuality_rating"),
  qualityRating: integer("quality_rating"),
  communicationRating: integer("communication_rating"),
  valueRating: integer("value_rating"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Vehicle Health Records
export const vehicleHealthRecords = pgTable("vehicle_health_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  mechanicId: uuid("mechanic_id").references(() => users.id),
  missionId: uuid("mission_id").references(() => missions.id),
  date: timestamp("date").defaultNow().notNull(),
  interventionType: varchar("intervention_type", { length: 100 }).notNull(),
  description: text("description").notNull(),
  partsChanged: jsonb("parts_changed").$type<
    { name: string; reference?: string; price?: number }[]
  >(),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  mileage: integer("mileage"),
  photos: jsonb("photos").$type<string[]>(),
  nextServiceRecommendation: text("next_service_recommendation"),
  nextServiceDue: timestamp("next_service_due"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mechanic-Enterprise Affiliations
export const mechanicAffiliations = pgTable("mechanic_affiliations", {
  id: uuid("id").defaultRandom().primaryKey(),
  mechanicId: uuid("mechanic_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  enterpriseId: uuid("enterprise_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, active, suspended, terminated
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  data: jsonb("data"),
  isRead: boolean("is_read").default(false),
  sentViaPush: boolean("sent_via_push").default(false),
  sentViaEmail: boolean("sent_via_email").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Chat History
export const aiChatHistory = pgTable("ai_chat_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar("role", { length: 20 }).notNull(), // user, assistant
  content: text("content").notNull(),
  context: jsonb("context"), // Additional context about the conversation
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type MechanicProfile = typeof mechanicProfiles.$inferSelect;
export type EnterpriseProfile = typeof enterpriseProfiles.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type SOSRequest = typeof sosRequests.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type VehicleHealthRecord = typeof vehicleHealthRecords.$inferSelect;
export type MechanicAffiliation = typeof mechanicAffiliations.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AIChatHistory = typeof aiChatHistory.$inferSelect;
