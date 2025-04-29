import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';
import AccessibilityMenu from './AccessibilityMenu';

const Footer = () => {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">À propos</h3>
              <p className="text-gray-400">
                Association Bear fondée en 2017. C'est une association pour les Bears mais aussi pour tous ceux qui aiment les Ours, les poils et les tailles allant du XS au XXXXXL.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>49 Rue du faubourg St. Jaumes, Bat E, 34000 Montpellier</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>contactloom34@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>0767179100</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/groups/1868760663424464/?ref=share_group_link" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/loom_ours_34/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Use</Link>
              <button onClick={() => setIsAccessibilityOpen(true)} className="text-gray-400 hover:text-white">Accessibilité</button>
            </div>
            <div className="mt-4 flex items-center justify-center text-gray-400">
              <Heart className="h-4 w-4 mr-1" />
              <span>Made with love in Montpellier</span>
            </div>
          </div>
        </div>
      </footer>
      
      <AccessibilityMenu isOpen={isAccessibilityOpen} onClose={() => setIsAccessibilityOpen(false)} />
    </>
  );
};

export default Footer;
