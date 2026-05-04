"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Users, AlertCircle, ShoppingBag, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  role?: "user" | "mechanic" | "enterprise";
}

export function BottomNav({ role = "user" }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const userNavItems = [
    { href: "/dashboard", label: "Accueil", icon: Home },
    { href: "/mechanics", label: "Mécaniciens", icon: Users },
    { href: "/sos", label: "SOS", icon: AlertCircle, isSOS: true },
    { href: "/marketplace", label: "Marché", icon: ShoppingBag },
    { href: "/profile", label: "Profil", icon: UserCircle },
  ];

  const mechanicNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/missions", label: "Missions", icon: AlertCircle },
    { href: "/enterprises", label: "Entreprises", icon: Users },
    { href: "/profile", label: "Profil", icon: UserCircle },
  ];

  const enterpriseNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/mechanics", label: "Mécaniciens", icon: Users },
    { href: "/stock", label: "Stock", icon: ShoppingBag },
    { href: "/sales", label: "Ventes", icon: AlertCircle },
    { href: "/profile", label: "Profil", icon: UserCircle },
  ];

  const navItems =
    role === "mechanic"
      ? mechanicNavItems
      : role === "enterprise"
      ? enterpriseNavItems
      : userNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 bottom-nav safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          if (item.isSOS) {
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="relative -mt-8"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg sos-button">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-red-500 mt-1">{item.label}</span>
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                isActive
                  ? role === "user"
                    ? "text-emerald-500"
                    : role === "mechanic"
                    ? "text-blue-500"
                    : "text-orange-500"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
