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
  const [simpleMode, setSimpleMode] = useState(false);

  // Appliquer les paramètres dès qu'ils changent
  useEffect(() => {
    applyAccessibilitySettings();
  }, [textSize, highContrast, underlineLinks, simpleMode]);

  // Charger les paramètres au montage
  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = () => {
    try {
      const savedTextSize = localStorage.getItem('textSize');
      const savedHighContrast = localStorage.getItem('highContrast');
      const savedUnderlineLinks = localStorage.getItem('underlineLinks');
      const savedSimpleMode = localStorage.getItem('simpleMode');

      if (savedTextSize) setTextSize(Number(savedTextSize));
      if (savedHighContrast === 'true') setHighContrast(true);
      if (savedUnderlineLinks === 'true') setUnderlineLinks(true);
      if (savedSimpleMode === 'true') setSimpleMode(true);
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
      localStorage.setItem('simpleMode', simpleMode.toString());

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

      // Mode simple : désactive toute la CSS
      const simpleStyleId = 'simple-mode-style';
      if (simpleMode) {
        document.documentElement.classList.add('simple-mode');
        // Injecte une feuille de style qui force le mode simple
        if (!document.getElementById(simpleStyleId)) {
          const style = document.createElement('style');
          style.id = simpleStyleId;
          style.innerHTML = `
            body, main, header, footer, nav, section, article, aside, div, span {
              all: unset !important;
              font-family: Arial, Helvetica, sans-serif !important;
              color: #111 !important;
              background: #fff !important;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              margin: 2em;
              line-height: 1.7;
              font-size: 1.2em;
              background: #fff !important;
              color: #111 !important;
            }
            h1, h2, h3, h4, h5, h6 {
              font-weight: bold;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              color: #000 !important;
            }
            a {
              color: #0033cc !important;
              text-decoration: underline !important;
            }
            ul, ol {
              margin-left: 2em;
            }
            p {
              margin-bottom: 1em;
            }
            button, input, select, textarea {
              font-size: 1em;
              color: #111 !important;
              background: #fff !important;
              border: 1px solid #888 !important;
              padding: 0.3em 0.6em;
              margin-bottom: 1em;
            }
          `;
          document.head.appendChild(style);
        }
      } else {
        document.documentElement.classList.remove('simple-mode');
        const style = document.getElementById(simpleStyleId);
        if (style) style.remove();
      }

      console.log('Paramètres appliqués:', { textSize, highContrast, underlineLinks, simpleMode });
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

  const handleSimpleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimpleMode(e.target.checked);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${highContrast ? 'high-contrast' : ''}`}>
      <div className={`p-6 rounded-lg shadow-xl max-w-md w-full transition-all ${highContrast ? 'bg-black border-4 border-yellow-400' : 'bg-white'}`} style={highContrast ? { color: '#ffff00' } : {}}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${highContrast ? 'text-yellow-400' : ''}`}>Options d'accessibilité</h2>
          <button 
            onClick={onClose} 
            className={`hover:text-gray-700 ${highContrast ? 'text-yellow-400' : 'text-gray-500'}`}
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}
            >
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
              style={highContrast ? { accentColor: '#ffff00' } : {}}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="highContrast"
              checked={highContrast}
              onChange={handleHighContrastChange}
              className="h-4 w-4"
              style={highContrast ? { accentColor: '#ffff00' } : {}}
            />
            <label htmlFor="highContrast" className={`ml-2 block text-sm ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}
            >
              Contraste élevé
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="underlineLinks"
              checked={underlineLinks}
              onChange={handleUnderlineLinksChange}
              className="h-4 w-4"
              style={highContrast ? { accentColor: '#ffff00' } : {}}
            />
            <label htmlFor="underlineLinks" className={`ml-2 block text-sm ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}
            >
              Souligner les liens
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="simpleMode"
              checked={simpleMode}
              onChange={handleSimpleModeChange}
              className="h-4 w-4"
              style={highContrast ? { accentColor: '#ffff00' } : {}}
            />
            <label htmlFor="simpleMode" className={`ml-2 block text-sm ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}
            >
              Mode Simple (lecture adaptée)
            </label>
          </div>
        </div>

        <button
          onClick={() => {
            applyAccessibilitySettings();
            onClose();
          }}
          className={`w-full py-2 px-4 rounded transition-colors ${highContrast ? 'bg-yellow-400 text-black font-bold border-2 border-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          Appliquer les modifications
        </button>
      </div>
    </div>
  );
};

export default AccessibilityMenu; 