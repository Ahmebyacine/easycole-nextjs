import { Mail, Phone, MapPin } from "lucide-react"; 
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="pt-16 pb-8"> 
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Top Section: Logo and Description */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-700 pb-12 mb-12">
          {/* Column 1: Brand Info */}
          <div className="md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">
              EasyCole
            </h3>
            <p className="text-sm text-muted-foreground">
              Centre de formation professionnelle agréé.
            </p>
            
            {/* Contact Info (Icons and Text) */}
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 shrink-0 text-blue-900" />
                    <p>Alger : Bordj El Kiffan, près de l’ancienne mairie</p>
                </div>
                <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 shrink-0 text-blue-900" />
                    <p> El Oued : Centre-ville</p>
                </div>
            </div>
          </div>

          {/* Columns 2, 3, 4: Navigation Links (Grid on larger screens) */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-x-16 md:w-3/4">
            
            {/* Column 2: Quick Links */}
            <div className="hidden">
              <h4 className="font-bold  mb-4 uppercase text-sm">Liens Rapides</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="transition-colors">Accueil</a></li>
                <li><a href="#" className="transition-colors">À Propos</a></li>
                <li><a href="#" className="transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Formations */}
            <div>
              <h4 className="font-bold  mb-4 uppercase text-sm">Employee</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/login" className="transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact & Social */}
            <div>
              <h4 className="font-bold  mb-4 uppercase text-sm">Nous Contacter</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="transition-colors">Termes et Conditions</a></li>
                {/* Social Icons Placeholder */}
                <li className="hidden pt-2 space-x-3">
                    {/* [Facebook Icon] [Instagram Icon] [YouTube Icon] */}
                    <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} EasyCole Formation. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;