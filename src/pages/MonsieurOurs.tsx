
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Quote, SunMedium, Leaf, Coffee, CircleDot } from "lucide-react";

const MonsieurOurs = () => {
  const MEMBERSHIP_URL = "https://www.helloasso.com/associations/your-association/adhesions/membership";
  
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
                <span>Our Mascot</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Meet <span className="text-brown">Monsieur Ours</span>
              </h1>
              <p className="text-lg text-gray-700">
                The heart and soul of our community. Monsieur Ours is more than just a mascot; 
                he represents our values, our history, and our love for diversity and inclusion.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1591652910703-a1a8ceb52e7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Monsieur Ours" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-brown"></div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-8">The Story of Monsieur Ours</h2>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Monsieur Ours was born in the heart of Paris during a community gathering in 2010. 
                As our members came together to celebrate diversity and inclusion, we realized we 
                needed a symbol to represent our values. 
              </p>
              
              <p>
                Designed by local artist Louise Dubois, Monsieur Ours was inspired by the traditional 
                French teddy bear, but with a modern and inclusive twist. His warm smile and open arms 
                represent our community's welcoming nature, while his colorful outfit symbolizes the 
                diversity we celebrate.
              </p>
              
              <div className="my-12 bg-tan/20 rounded-2xl p-8 text-center">
                <Quote size={36} className="text-brown mx-auto mb-4" />
                <p className="text-xl italic text-brown font-medium">
                  "Monsieur Ours reminds us that everyone belongs, everyone matters, 
                  and everyone has a place in our community."
                </p>
                <p className="mt-4 text-gray-700">— Michelle Laurent, Founder</p>
              </div>
              
              <p>
                Over the years, Monsieur Ours has become more than just a mascot. He has been present 
                at every major community event, celebration, and milestone. Through good times and 
                challenging ones, Monsieur Ours has stood as a symbol of resilience, compassion, 
                and solidarity.
              </p>
              
              <p>
                Today, Monsieur Ours continues to be at the heart of our association. 
                You'll see him at our events, in our materials, and in the stories we share. 
                He reminds us of our mission to create a world where everyone feels welcome, 
                valued, and loved for who they are.
              </p>
            </div>
            
            <div className="my-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="rounded-full bg-orange/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <SunMedium size={28} className="text-orange" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Warmth</h3>
                  <p className="text-gray-600">
                    Representing the warm, welcoming spirit of our community.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="rounded-full bg-brown/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Heart size={28} className="text-brown" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Love</h3>
                  <p className="text-gray-600">
                    Symbolizing our love for diversity and inclusion.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Leaf size={28} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Growth</h3>
                  <p className="text-gray-600">
                    Inspiring personal and community growth and development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Timeline Section */}
      <section className="py-16 bg-tan/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Monsieur Ours Through the Years</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-brown/30"></div>
              
              {/* Timeline events */}
              <div className="space-y-12">
                {/* 2010 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="order-1 md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                    <div className="bg-white rounded-xl p-6 shadow-sm inline-block">
                      <h3 className="text-xl font-bold text-brown mb-2">2010</h3>
                      <p className="text-gray-700">
                        Monsieur Ours is born during our first community gathering in Paris.
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
                      <h3 className="text-xl font-bold text-brown mb-2">2014</h3>
                      <p className="text-gray-700">
                        Monsieur Ours makes his first public appearance at the Paris Pride Parade.
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
                      <h3 className="text-xl font-bold text-brown mb-2">2018</h3>
                      <p className="text-gray-700">
                        Monsieur Ours becomes the official logo of our association and appears on all materials.
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
                      <h3 className="text-xl font-bold text-brown mb-2">2022</h3>
                      <p className="text-gray-700">
                        Monsieur Ours helps our association reach 1,000 members and celebrates with a special event.
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
                      <h3 className="text-xl font-bold text-brown mb-2">Today</h3>
                      <p className="text-gray-700">
                        Monsieur Ours continues to inspire our community and represents our values everywhere we go.
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Monsieur Ours & Our Community</h2>
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
