"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PackageSearch, 
  ClipboardList, 
  ArrowRightLeft, 
  FileSpreadsheet, 
  Settings,
  Store,
  Pizza,
  TrendingDown
} from "lucide-react";
import { motion } from "framer-motion";

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/inventory", label: "Live Inventory", icon: PackageSearch },
  { href: "/dashboard/counts", label: "Physical Counts", icon: ClipboardList },
  { href: "/dashboard/transfers", label: "Transfers", icon: ArrowRightLeft },
  { href: "/dashboard/sales", label: "Sales Imports", icon: FileSpreadsheet },
  { href: "/dashboard/recipes", label: "Recipes", icon: Pizza },
  { href: "/dashboard/reports", label: "Variance Reports", icon: TrendingDown },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-64 glass border-r border-white/5 bg-[#09090b]/60">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-xl text-primary">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">InventoryOS</h1>
          <p className="text-xs text-muted-foreground">Enterprise Control</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {routes.map((route) => {
          const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
          return (
            <Link key={route.href} href={route.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <route.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {route.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="glass-card p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-amber-700 flex items-center justify-center text-black font-bold">
            N
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Nik Owner</p>
            <p className="text-xs text-muted-foreground truncate">Owner • Bella Cucina</p>
          </div>
        </div>
      </div>
    </div>
  );
}
