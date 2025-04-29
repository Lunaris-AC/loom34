import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Quote, SunMedium, Leaf, Coffee, CircleDot, X } from "lucide-react";
import { useState } from "react";

const MonsieurOurs = () => {
  // HelloAsso URLs
  const SHOP_URL = "https://www.helloasso.com/associations/your-association/boutiques/shop";
  const MEMBERSHIP_URL = "https://www.helloasso.com/associations/association-les-ours-occitanie-mediterranee-loom/adhesions/adhesion-2024-2025";
  
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const timelineItems = [
    { year: '2017', title: 'Création de Loom', description: 'L\'association est fondée' },
    { year: '2018', title: 'Premier Monsieur Ours', description: 'Élection du premier Monsieur Ours' },
    { year: '2019', title: 'Expansion', description: 'L\'association grandit' },
    { year: '2020', title: 'Adaptation', description: 'Période de pandémie' },
    { year: '2021', title: 'Renaissance', description: 'Retour des événements' },
    { year: '2022', title: 'Nouveau Monsieur Ours', description: 'Élection du nouveau Monsieur Ours' },
  ];

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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre histoire</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-brown/30"></div>
            <div className="space-y-12">
              {timelineItems.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`w-1/2 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow bg-white ${
                      index % 2 === 0 ? 'mr-auto' : 'ml-auto'
                    }`}
                    onClick={() => handleTimelineClick(item.year)}
                  >
                    <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-brown ${
                      index % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                    }`}></div>
                    <h3 className="text-xl font-bold mb-2">{item.year}</h3>
                    <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="text-center text-gray-500">
              Les photos seront ajoutées prochainement
            </div>
          </div>
        </div>
      )}
      
      {/* Community Section */}
      <section className="py-16 bg-brown text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Rejoignez la communauté</h2>
          <p className="text-tan/90 text-lg mb-8 max-w-2xl mx-auto">
            Become a member of our vibrant community today and be part of Monsieur Ours' ongoing story.
            Together, we can create more spaces where everyone feels welcome and appreciated.
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
