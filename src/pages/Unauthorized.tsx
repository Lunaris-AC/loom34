import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-8">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold text-red-600">Accès non autorisé</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <svg className="mx-auto h-24 w-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          
          <p className="mt-4 text-lg">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          
          <div className="mt-8 space-y-3">
            <Button 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </Button>
            
            {isAuthenticated ? (
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                Retour à la page précédente
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/auth/login')}
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 