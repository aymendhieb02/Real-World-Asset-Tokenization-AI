"use client";

import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  role?: "investor" | "owner" | "admin";
  showSidebar?: boolean;
}

export function MainLayout({ children, role, showSidebar = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {showSidebar && <Sidebar role={role} />}
        <main
          className={cn(
            "flex-1",
            showSidebar && "ml-64"
          )}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

