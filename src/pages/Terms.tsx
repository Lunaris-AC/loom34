import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Construction className="h-24 w-24 text-gray-400 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Terms of Use</h1>
      <p className="text-gray-600 mb-4">Cette page est en cours de construction.</p>
      <Link to="/" className="text-blue-600 hover:text-blue-800">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default Terms; 