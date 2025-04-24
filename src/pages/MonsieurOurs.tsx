
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Quote, SunMedium, Leaf, Coffee, CircleDot } from "lucide-react";

const MonsieurOurs = () => {
  const MEMBERSHIP_URL = "https://www.helloasso.com/associations/association-les-ours-occitanie-mediterranee-loom/adhesions/adhesion-2024-2025";
  
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
          <h2 className="text-3xl font-bold text-center mb-12">Monsieur Ours au fil des ans</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-brown/30"></div>
              
              {/* Timeline events */}
              <div className="space-y-12">
                {/* 2017 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="order-1 md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                    <div className="bg-white rounded-xl p-6 shadow-sm inline-block">
                      <h3 className="text-xl font-bold text-brown mb-2">2017</h3>
                      <p className="text-gray-700">
                        Cédric François
                      </p>
                    </div>
                  </div>
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-brown border-4 border-white text-white absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                    <CircleDot size={16} />
                  </div>
                  <div className="order-2 md:w-1/2 md:pl-8 hidden md:block">
                    {/* Empty space for layout on right timeline events */}
                  </div>
                </div>
                
                {/* 2014 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="order-2 md:order-2 md:w-1/2 md:pl-8 mb-4 md:mb-0">
                    <div className="bg-white rounded-xl p-6 shadow-sm inline-block">
                      <h3 className="text-xl font-bold text-brown mb-2">2018-2020</h3>
                      <p className="text-gray-700">
                        Romain Tertrais
                      </p>
                    </div>
                  </div>
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-brown border-4 border-white text-white absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                    <CircleDot size={16} />
                  </div>
                  <div className="order-1 md:order-1 md:w-1/2 md:pr-8 md:text-right hidden md:block">
                    {/* Empty space for layout on left timeline events */}
                  </div>
                </div>
                
                {/* 2018 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="order-1 md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                    <div className="bg-white rounded-xl p-6 shadow-sm inline-block">
                      <h3 className="text-xl font-bold text-brown mb-2">2023</h3>
                      <p className="text-gray-700">
                        Lucas Milani
                      </p>
                    </div>
                  </div>
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-brown border-4 border-white text-white absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                    <CircleDot size={16} />
                  </div>
                  <div className="order-2 md:w-1/2 md:pl-8 hidden md:block">
                    {/* Empty space for layout on right timeline events */}
                  </div>
                </div>
                
                {/* 2022 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="order-2 md:order-2 md:w-1/2 md:pl-8 mb-4 md:mb-0">
                    <div className="bg-white rounded-xl p-6 shadow-sm inline-block">
                      <h3 className="text-xl font-bold text-brown mb-2">2024</h3>
                      <p className="text-gray-700">
                       Antonio Gabriel
                      </p>
                    </div>
                  </div>
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-brown border-4 border-white text-white absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                    <CircleDot size={16} />
                  </div>
                  <div className="order-1 md:order-1 md:w-1/2 md:pr-8 md:text-right hidden md:block">
                    {/* Empty space for layout on left timeline events */}
                  </div>
                </div>
                
                {/* Today */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="order-1 md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                    <div className="bg-white rounded-xl p-6 shadow-sm inline-block">
                      <h3 className="text-xl font-bold text-brown mb-2">2025</h3>
                      <p className="text-gray-700">
                        Élection le 28 Juin 2025!
                      </p>
                    </div>
                  </div>
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-brown border-4 border-white text-white absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                    <CircleDot size={16} />
                  </div>
                  <div className="order-2 md:w-1/2 md:pl-8 hidden md:block">
                    {/* Empty space for layout on right timeline events */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
