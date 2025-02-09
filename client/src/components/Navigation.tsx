import { Link, useLocation } from "wouter";
import { Home, LightbulbIcon, Wand2, Menu, Search, Wifi, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SiHomeassistant } from "react-icons/si";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchModal } from "./SearchModal";
import { useWifiLatency } from "@/hooks/useWifiLatency";
// Missing import:  import { useMobile } from '...'; // You need to add the correct import path
import { Smartphone, Layout } from 'lucide-react'; // or the correct icon library


export default function Navigation() {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  useWifiLatency();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/devices", icon: Smartphone, label: "Devices" },
    { href: "/scenes", icon: Layout, label: "Scenes" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <>
      {/* Top Navigation (This section remains largely unchanged) */}
      <header className="fixed top-0 left-0 right-0 h-16 glass border-b z-50 bg-gradient-to-r from-background/60 via-primary/5 to-background/60">
        <div className="container h-full mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SiHomeassistant className="w-8 h-8 text-primary" />
            <span className="font-semibold text-lg">SmartHome</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span className="text-sm" id="latency">-- ms</span>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Navigation */}
      {isMobile ? (
        <nav className="fixed bottom-0 left-0 right-0 h-16 glass border-t md:hidden z-[100] bg-gradient-to-r from-background/80 via-primary/20 to-background/80 backdrop-blur-lg">
          <div className="container h-full mx-auto grid grid-cols-5">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  className={`w-full h-full rounded-none flex flex-col items-center justify-center gap-1 ${
                    location === href ? "text-primary" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </Button>
              </Link>
            ))}
            <Link href="#" onClick={(e) => { e.preventDefault(); setSearchOpen(true); }}>
              <Button
                variant="ghost"
                className="w-full h-full rounded-none flex flex-col items-center justify-center gap-1"
              >
                <Search className="h-5 w-5" />
                <span className="text-xs">Search</span>
              </Button>
            </Link>
          </div>
        </nav>
      ) : (
        <nav className="fixed left-0 top-0 bottom-0 w-16 border-r bg-background">
          <ul className="flex h-full flex-col items-center justify-center gap-8">
            {navItems.map(({ href, icon: Icon, label }) => (
              <li key={href}>
                <Link href={href}>
                  <Button
                    variant={location === href ? "default" : "ghost"}
                    size="icon"
                    className="h-10 w-10"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}