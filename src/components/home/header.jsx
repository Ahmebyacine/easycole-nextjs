import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ReactCountryFlag from "react-country-flag";

// Component for the navigation links
const NavLinks = [
  { name: "Accueil", href: "#accueil" },
  { name: "À propos", href: "#propos" },
  { name: "Formations", href: "#formations" },
  { name: "Contact", href: "#contact" },
];

const languages = [
  { value: "fr", flag: "fr" },
  { value: "en", flag: "us" },
  { value: "ar", flag: "dz" },
];

export function Header() {
  return (
    <header>
      <div className="container mx-auto flex items-center justify-between border-b h-16">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 border border-blue-600 rounded-full flex items-center justify-center text-blue-600 text-lg font-bold">
            <span className="text-sm">EC</span>
          </div>
        </div>

        {/* Right Section: Navigation Links, Language Selector, and Button */}
        <nav className="flex items-center space-x-6">
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            {NavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium hover:text-blue-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Language Selector (France Flag + Chevron) */}
          <Select defaultValue="fr">
            <SelectTrigger className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SelectValue placeholder="Language" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                  className="flex items-center space-x-2"
                >
                  <ReactCountryFlag countryCode={lang.flag.toUpperCase()} svg />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* S'inscrire Button (Shadcn Button) */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-base h-auto"
            variant="default"
          >
            S&apos;inscrire
          </Button>
        </nav>
      </div>
    </header>
  );
}
