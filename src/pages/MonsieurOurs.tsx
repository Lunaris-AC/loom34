
import { Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

const MonsieurOurs = () => {
  // Previous mascots data
  const previousMascots = [
    {
      name: "Olivier L'Ours",
      period: "2010-2015",
      description: "The first incarnation of our mascot, known for his classic design and friendly demeanor.",
      image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Pierre L'Ours",
      period: "2015-2018",
      description: "A more modern take on our mascot, with a sleeker design and vibrant colors.",
      image: "https://images.unsplash.com/photo-1587922546307-776227941871?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Monsieur Ours Classic",
      period: "2018-2022",
      description: "The refined version that established our mascot's distinguished personality.",
      image: "https://images.unsplash.com/photo-1566903451935-7e8836199ac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange/10 text-orange text-sm font-medium">
                <span className="animate-pulse-soft">•</span>
                <span className="ml-2">Our Mascot</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Meet <span className="text-brown">Monsieur Ours</span>
              </h1>
              <p className="text-lg text-gray-700">
                More than just a mascot, Monsieur Ours represents the heart and soul of our community. 
                His story reflects our values of warmth, acceptance, and strength in diversity.
              </p>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1525268771113-32d9e9021a97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Monsieur Ours" 
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown/30 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="The Story" 
            subtitle="How Monsieur Ours came to be the heart of our community."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">Origins</h3>
              <p className="text-gray-700 mb-4">
                In the early days of our association, we wanted a symbol that would represent 
                the strength, warmth, and protective nature of our community. The bear, with 
                its powerful yet gentle demeanor, was the perfect choice.
              </p>
              <p className="text-gray-700">
                We named him "Monsieur Ours" – Mister Bear in French – to honor the French 
                heritage of many of our founding members and to give him a touch of distinguished character.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">Symbolism</h3>
              <p className="text-gray-700 mb-4">
                Monsieur Ours embodies many of the qualities we value in our community. He represents 
                strength in adversity, the warmth of companionship, and the protective instinct 
                that drives us to look out for one another.
              </p>
              <p className="text-gray-700">
                His friendly appearance reminds us that even those who might seem intimidating 
                at first glance often have the biggest hearts – a lesson in not judging by appearances.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">Evolution</h3>
              <p className="text-gray-700 mb-4">
                Over the years, Monsieur Ours has evolved alongside our community. His design has been 
                refined, but his essence remains the same – a guardian figure who welcomes everyone 
                with open arms.
              </p>
              <p className="text-gray-700">
                Today, he appears at all our events, on our merchandise, and serves as an 
                instantly recognizable symbol of our association's values and mission.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4">Community Icon</h3>
              <p className="text-gray-700 mb-4">
                Monsieur Ours has become more than just a mascot – he's a beloved community icon. 
                Members often share stories of how seeing him at their first event made them 
                feel immediately welcome and at ease.
              </p>
              <p className="text-gray-700">
                For many, he represents the sense of belonging they've found within our community – 
                a reminder that everyone has a place here.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section className="py-16 bg-tan/20">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Gallery" 
            subtitle="Monsieur Ours in action throughout our community events."
            centered
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Monsieur Ours at Pride" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1682686580186-b55d2a91053c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Monsieur Ours at community picnic" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1578269174936-2709b6aeb913?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Monsieur Ours with children" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Monsieur Ours merchandise" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1560806175-c9897c992eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Monsieur Ours artwork" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Monsieur Ours celebration" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Previous Monsieur Ours Section - Replacing "Take Home" section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Previous Monsieur Ours" 
            subtitle="The evolution of our beloved mascot through the years."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {previousMascots.map((mascot, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="h-56 overflow-hidden">
                  <img 
                    src={mascot.image} 
                    alt={mascot.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{mascot.name}</h3>
                  <p className="text-orange text-sm font-medium mb-3">{mascot.period}</p>
                  <p className="text-gray-700">{mascot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-tan/10">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Community Love" 
            subtitle="What our members say about Monsieur Ours."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center">
                  <span className="text-2xl">❝</span>
                </div>
              </div>
              <p className="text-gray-700 text-center mb-6">
                "Seeing Monsieur Ours at my first event made me feel instantly welcome. 
                He's become a symbol of the belonging I've found in this community."
              </p>
              <div className="text-center">
                <h4 className="font-semibold">Thomas L.</h4>
                <p className="text-sm text-gray-500">Member since 2018</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center">
                  <span className="text-2xl">❝</span>
                </div>
              </div>
              <p className="text-gray-700 text-center mb-6">
                "My kids adore Monsieur Ours! He's helped them understand the values 
                of acceptance and kindness in a way that's accessible and fun."
              </p>
              <div className="text-center">
                <h4 className="font-semibold">Sophie M.</h4>
                <p className="text-sm text-gray-500">Member since 2020</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center">
                  <span className="text-2xl">❝</span>
                </div>
              </div>
              <p className="text-gray-700 text-center mb-6">
                "I have the Monsieur Ours plushie on my desk at work. It's a daily 
                reminder of the supportive community I've found here."
              </p>
              <div className="text-center">
                <h4 className="font-semibold">Pierre D.</h4>
                <p className="text-sm text-gray-500">Member since 2016</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default MonsieurOurs;
