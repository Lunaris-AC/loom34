import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Quote, SunMedium, Leaf, Coffee, CircleDot, X, MousePointerClick } from "lucide-react";
import { useState } from "react";

const MonsieurOurs = () => {
  // HelloAsso URLs
  const SHOP_URL = "https://www.helloasso.com/associations/your-association/boutiques/shop";
  const MEMBERSHIP_URL = "https://www.helloasso.com/associations/association-les-ours-occitanie-mediterranee-loom/adhesions/adhesion-2024-2025";
  
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const timelineItems = [
    { year: '2018', title: 'Cédric François', description: 'Monsieur Ours élu en 2018' },
    { year: '2019', title: 'Romain Tertrais', description: 'Monsieur Ours élu en 2019' },
    { year: '2022', title: 'Pierre Marty Cardin', description: 'Monsieur Ours élu en 2022' },
    { year: '2023', title: 'Lucas Milani', description: 'Monsieur Ours élu en 2023' },
    { year: '2024', title: 'Antonio Gabriel', description: 'Monsieur Ours élu en 2024' },
  ];

  const galleryImages: Record<string, { url: string; alt: string } | undefined> = {
    '2018': { url: 'https://mcfiles.inferi.fr/api/public/dl/4yYoW18R?inline=true', alt: 'Cédric François' },
    '2019': { url: 'https://mcfiles.inferi.fr/api/public/dl/SNG33NJI?inline=true', alt: 'Romain Tertrais' },
    '2022': { url: 'https://mcfiles.inferi.fr/api/public/dl/N7p9JwUI?inline=true', alt: 'Pierre Marty Cardin' },
    '2023': { url: 'https://mcfiles.inferi.fr/api/public/dl/PqPgvVpz?inline=true', alt: 'Lucas Milani' },
    '2024': { url: 'https://mcfiles.inferi.fr/api/public/dl/_Hf8VSw_?inline=true', alt: 'Antonio Gabriel' },
  };

  const handleTimelineClick = (year: string) => {
    setSelectedYear(year);
    setIsGalleryOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange/10 text-orange text-sm font-medium">
                <Heart size={16} className="mr-2" />
                <span>Monsieur Ours</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Rencontrez <span className="text-brown">Monsieur Ours</span>
              </h1>
              <p className="text-lg text-gray-700">
                Comme tous les ans, au mois de juin, la Monpell' Bears organisée par Loom permet d'élire Monsieur Ours et Ses Oursons!
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://mcfiles.inferi.fr/api/public/dl/hYD4NeWA?inline=true" 
                  alt="Monsieur Ours" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Timeline Section */}
      <section className="py-16 bg-tan/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre histoire</h2>
          <div className="relative max-w-3xl mx-auto mt-16">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-brown/30"></div>
            {timelineItems.map((item, index) => {
              // Alternance pastille orange ou brown
              const isOrange = index === 1;
              return (
                <div className={`relative mb-16`} key={item.year}>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full border-4 ${isOrange ? 'border-orange' : 'border-brown'} bg-white z-10`}></div>
                  <div className={`ml-auto mr-auto ${index % 2 === 0 ? 'md:ml-0 md:mr-[50%] md:pr-8 text-right' : 'md:ml-[50%] md:mr-0 md:pl-8'} w-full md:w-1/2`}> 
                    <div className="bg-white p-6 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow flex items-center justify-between" onClick={() => handleTimelineClick(item.year)}>
                      <div>
                        <span className={`${isOrange ? 'text-orange' : 'text-brown'} font-bold`}>{item.year}</span>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                      <MousePointerClick className="ml-4 text-orange" size={22} aria-label="Voir la galerie" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Galerie {selectedYear}</h3>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="text-center">
              {selectedYear && galleryImages[selectedYear] ? (
                <img
                  src={galleryImages[selectedYear]!.url}
                  alt={galleryImages[selectedYear]!.alt}
                  className="mx-auto max-h-[60vh] rounded shadow"
                />
              ) : (
                <div className="text-gray-500">Aucune image disponible pour cette année.</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Community Section */}
      <section className="py-16 bg-brown text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Rejoignez la communauté</h2>
          <p className="text-tan/90 text-lg mb-8 max-w-2xl mx-auto">
            Devenez membre de notre communauté et participez à nos événements, ateliers et activités. Ensemble, nous faisons la différence!
          </p>
          <button
            onClick={() => window.open(MEMBERSHIP_URL, '_blank', 'noopener,noreferrer')}
            className="inline-flex items-center justify-center bg-orange hover:bg-orange-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Become a Member
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MonsieurOurs;
