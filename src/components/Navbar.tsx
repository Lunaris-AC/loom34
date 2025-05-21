import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Articles', path: '/articles' },    
    { name: 'Événements', path: '/events' },
    { name: 'Boutique', path: 'https://www.helloasso.com/associations/association-les-ours-occitanie-mediterranee-loom#shop', external: true },
    { name: 'Monsieur Ours', path: '/monsieur-ours' },
    { name: 'Photos', path: '/gallery' },
    { name: 'Nos Partenaires', path: '/partners' },
    { name: 'Adhésion', path: 'https://www.helloasso.com/associations/association-les-ours-occitanie-mediterranee-loom/adhesions/adhesion-2024-2025', external: true },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/logo.png" 
            alt="LOOM Logo" 
            className="h-12 w-auto"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.path}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'bg-brown/10 text-brown font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'bg-brown/10 text-brown font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>
        
        {/* Auth/User Menu (Desktop) */}
        <div className="hidden md:flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative rounded-full h-8 w-8 p-0">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.username || 'Utilisateur'} 
                      className="rounded-full object-cover" 
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile?.full_name || profile?.username || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer">Tableau de bord admin</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-700"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-16">
          <div className="container mx-auto px-4 py-6 flex flex-col h-full">
            <nav className="flex flex-col space-y-2 mb-6">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-3 rounded-md ${
                      isActive(link.path)
                        ? 'bg-brown/10 text-brown font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-md ${
                      isActive(link.path)
                        ? 'bg-brown/10 text-brown font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </nav>
            
            {/* Auth/User (Mobile) */}
            <div className="mt-auto">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.username || 'Utilisateur'} 
                          className="rounded-full object-cover h-10 w-10" 
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{profile?.full_name || profile?.username || 'Utilisateur'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
                      Tableau de bord admin
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
                  <LogIn className="h-5 w-5 mr-2" />
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
