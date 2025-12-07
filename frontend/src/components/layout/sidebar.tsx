"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Home,
  Wallet,
  TrendingUp,
  GraduationCap,
  Settings,
  FileCheck,
  Building2,
  Users,
  BarChart3,
  Brain,
  MapPin,
} from "lucide-react";

interface SidebarProps {
  role?: "investor" | "owner" | "admin";
}

const investorLinks = [
  { href: "/dashboard/investor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/properties", label: "Properties", icon: Home },
  { href: "/ai/price-prediction", label: "Price Prediction", icon: TrendingUp },
  { href: "/ai/cluster-map", label: "Cluster Map", icon: MapPin },
  { href: "/ai/advisor", label: "Investment Advisor", icon: Brain },
  { href: "/dividends", label: "Dividends", icon: TrendingUp },
  { href: "/education", label: "Learn", icon: GraduationCap },
  { href: "/settings", label: "Settings", icon: Settings },
];

const ownerLinks = [
  { href: "/dashboard/owner", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "My Properties", icon: Building2 },
  { href: "/dividends", label: "Revenue", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kyc", label: "KYC Management", icon: FileCheck },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/metrics", label: "Metrics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ role = "investor" }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : role === "owner" ? ownerLinks : investorLinks;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass border-r border-white/10 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                  : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

