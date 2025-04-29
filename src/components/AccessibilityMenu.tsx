import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityMenu = ({ isOpen, onClose }: AccessibilityMenuProps) => {
  const [textSize, setTextSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);

  // Appliquer les paramètres dès qu'ils changent
  useEffect(() => {
    applyAccessibilitySettings();
  }, [textSize, highContrast, underlineLinks]);

  // Charger les paramètres au montage
  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = () => {
    try {
      const savedTextSize = localStorage.getItem('textSize');
      const savedHighContrast = localStorage.getItem('highContrast');
      const savedUnderlineLinks = localStorage.getItem('underlineLinks');

      if (savedTextSize) setTextSize(Number(savedTextSize));
      if (savedHighContrast === 'true') setHighContrast(true);
      if (savedUnderlineLinks === 'true') setUnderlineLinks(true);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const applyAccessibilitySettings = () => {
    try {
      // Sauvegarder les paramètres
      localStorage.setItem('textSize', textSize.toString());
      localStorage.setItem('highContrast', highContrast.toString());
      localStorage.setItem('underlineLinks', underlineLinks.toString());

      // Appliquer les styles
      document.documentElement.style.fontSize = `${textSize}%`;
      
      // Appliquer le contraste élevé
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
        document.body.style.backgroundColor = '#000';
        document.body.style.color = '#fff';
      } else {
        document.documentElement.classList.remove('high-contrast');
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }

      // Appliquer le soulignement des liens
      const links = document.getElementsByTagName('a');
      for (let i = 0; i < links.length; i++) {
        links[i].style.textDecoration = underlineLinks ? 'underline' : '';
      }

      console.log('Paramètres appliqués:', { textSize, highContrast, underlineLinks });
    } catch (error) {
      console.error('Erreur lors de l\'application des paramètres:', error);
    }
  };

  const handleTextSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value);
    setTextSize(newSize);
  };

  const handleHighContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHighContrast(e.target.checked);
  };

  const handleUnderlineLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnderlineLinks(e.target.checked);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Options d'accessibilité</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taille du texte : {textSize}%
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={textSize}
              onChange={handleTextSizeChange}
              className="w-full"
              aria-label="Ajuster la taille du texte"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="highContrast"
              checked={highContrast}
              onChange={handleHighContrastChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="highContrast" className="ml-2 block text-sm text-gray-700">
              Contraste élevé
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="underlineLinks"
              checked={underlineLinks}
              onChange={handleUnderlineLinksChange}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="underlineLinks" className="ml-2 block text-sm text-gray-700">
              Souligner les liens
            </label>
          </div>
        </div>

        <button
          onClick={() => {
            applyAccessibilitySettings();
            onClose();
          }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Appliquer les modifications
        </button>
      </div>
    </div>
  );
};

export default AccessibilityMenu; 