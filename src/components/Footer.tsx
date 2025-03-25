
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-brown text-white">
      {/* Main Footer */}
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-bold">Loom</h3>
            <p className="text-tan/90 leading-relaxed">
              A welcoming community celebrating diversity and connection. Join us in creating a space where everyone belongs.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialLink href="https://facebook.com" aria-label="Facebook">
                <Facebook size={20} />
              </SocialLink>
              <SocialLink href="https://instagram.com" aria-label="Instagram">
                <Instagram size={20} />
              </SocialLink>
              <SocialLink href="https://twitter.com" aria-label="Twitter">
                <Twitter size={20} />
              </SocialLink>
              <SocialLink href="https://linkedin.com" aria-label="LinkedIn">
                <Linkedin size={20} />
              </SocialLink>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li><FooterLink to="/about">About Us</FooterLink></li>
              <li><FooterLink to="/events">Events</FooterLink></li>
              <li><FooterLink to="/shop">Shop</FooterLink></li>
              <li><FooterLink to="/gallery">Gallery</FooterLink></li>
              <li><FooterLink to="/monsieur-ours">Monsieur Ours</FooterLink></li>
            </ul>
          </div>
          
          {/* Join & Support */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold">Join & Support</h3>
            <ul className="space-y-2">
              <li><FooterLink to="/membership">Become a Member</FooterLink></li>
              <li><FooterLink to="/partners">Our Partners</FooterLink></li>
              <li><FooterLink to="/partners/become">Become a Partner</FooterLink></li>
              <li><FooterLink to="/donate">Donate</FooterLink></li>
              <li><FooterLink to="/volunteer">Volunteer</FooterLink></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-tan flex-shrink-0 mt-1" />
                <span className="text-tan/90">123 Community Street, Paris, France</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-tan" />
                <a href="mailto:contact@loom.org" className="text-tan/90 hover:text-white transition-colors">
                  contact@loom.org
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-tan" />
                <a href="tel:+33123456789" className="text-tan/90 hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="bg-brown-dark py-4">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-tan/80 text-sm">
          <div className="mb-4 md:mb-0">
            © {currentYear} Loom. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-1">
            Made with <Heart size={16} className="text-orange animate-pulse-soft" /> in Paris
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, children, ...props }) => {
  return (
    <a 
      href={href} 
      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
};

const FooterLink = ({ to, children }) => {
  return (
    <Link 
      to={to} 
      className="text-tan/90 hover:text-white transition-colors duration-200 block"
    >
      {children}
    </Link>
  );
};

export default Footer;
