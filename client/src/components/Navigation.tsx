import { Link, useLocation } from "wouter";
import { Home, LightbulbIcon, Wand2, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SiHomeassistant } from "react-icons/si";
import { useState } from "react";
import { SearchModal } from "./SearchModal";

export default function Navigation() {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/devices", label: "Devices", icon: LightbulbIcon },
    { href: "/scenes", label: "History", icon: Wand2 },
  ];

  return (
    <>
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 glass border-b z-50 bg-gradient-to-r from-background/60 via-primary/5 to-background/60">
        <div className="container h-full mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SiHomeassistant className="w-8 h-8 text-primary" />
            <span className="font-semibold text-lg">SmartHome</span>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-2 mt-8">
                {links.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <Button
                      variant={location === href ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Icon className="mr-2 h-5 w-5" />
                      {label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 glass border-t md:hidden z-[100] bg-gradient-to-r from-background/80 via-primary/20 to-background/80 backdrop-blur-lg">
        <div className="container h-full mx-auto grid grid-cols-4">
          {links.map(({ href, label, icon: Icon }) => (
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
          <Button
            variant="ghost"
            className="w-full h-full rounded-none flex flex-col items-center justify-center gap-1"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Button>
        </div>
      </nav>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}