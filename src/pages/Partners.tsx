
import { Heart, Users, Shield, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

const partnersList = [
  {
    name: "Community Center Paris",
    logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+Logo",
    description: "Providing space and resources for our community events and activities.",
    website: "https://example.com",
    type: "Community Organization"
  },
  {
    name: "Rainbow Foundation",
    logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+Logo",
    description: "Supporting our initiatives through grants and advocacy.",
    website: "https://example.com",
    type: "Non-Profit Organization"
  },
  {
    name: "Local Bistro",
    logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+Logo",
    description: "Catering our events and providing discounts to our members.",
    website: "https://example.com",
    type: "Local Business"
  },
  {
    name: "Inclusive Spaces Co.",
    logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+Logo",
    description: "Helping us create welcoming environments for all community members.",
    website: "https://example.com",
    type: "Service Provider"
  },
  {
    name: "City of Paris",
    logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+Logo",
    description: "Supporting our mission through municipal grants and facilities.",
    website: "https://example.com",
    type: "Government Entity"
  },
  {
    name: "Pride Alliance",
    logo: "https://via.placeholder.com/200x100/f3f4f6/666666?text=Partner+Logo",
    description: "Collaborating on events and community initiatives throughout the year.",
    website: "https://example.com",
    type: "Community Organization"
  }
];

const Partners = () => {
  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-36 pb-16 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Our Partners & Supporters
            </h1>
            <p className="text-lg text-gray-700">
              We're grateful for the organizations and businesses that support our mission. 
              Together, we're creating a stronger, more inclusive community.
            </p>
          </div>
        </div>
      </section>
      
      {/* Partners Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Meet Our Partners" 
            subtitle="The organizations and businesses that help make our work possible."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {partnersList.map((partner, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-center items-center h-32">
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-orange bg-orange/10 px-3 py-1 rounded-full">
                    {partner.type}
                  </span>
                  <h3 className="text-xl font-bold mt-3 mb-2">{partner.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {partner.description}
                  </p>
                  <a 
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-brown font-medium hover:underline inline-flex items-center"
                  >
                    Visit Website
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Partnership Benefits Section */}
      <section className="py-16 bg-tan/20">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Partnership Benefits" 
            subtitle="Why organizations choose to partner with us."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="rounded-full bg-brown/10 w-14 h-14 flex items-center justify-center mb-4">
                <Users size={24} className="text-brown" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Connection</h3>
              <p className="text-gray-600">
                Connect with our 1,200+ members and wider community audience through events and digital platforms.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="rounded-full bg-orange/10 w-14 h-14 flex items-center justify-center mb-4">
                <Heart size={24} className="text-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Social Impact</h3>
              <p className="text-gray-600">
                Demonstrate your commitment to diversity and inclusion while making a meaningful difference.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="rounded-full bg-yellow/10 w-14 h-14 flex items-center justify-center mb-4">
                <Shield size={24} className="text-yellow-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Brand Visibility</h3>
              <p className="text-gray-600">
                Gain exposure through our events, website, social media, and promotional materials.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="rounded-full bg-tan/30 w-14 h-14 flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-brown" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exclusive Access</h3>
              <p className="text-gray-600">
                Enjoy special opportunities at our events and influence the future of our community.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partnership Tiers Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Partnership Tiers" 
            subtitle="Find the right level of involvement for your organization."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Bronze Tier */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="bg-[#CD7F32]/10 p-6 text-center">
                <h3 className="text-xl font-bold text-[#CD7F32]">Bronze Partner</h3>
                <div className="text-3xl font-bold mt-2 mb-1">€500</div>
                <p className="text-gray-600 text-sm">Annual contribution</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Logo on our website</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Social media recognition</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mention in newsletter</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg className="h-5 w-5 text-gray-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Event presence</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg className="h-5 w-5 text-gray-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Exclusive partner events</span>
                  </li>
                </ul>
                <a 
                  href="https://www.helloasso.com/associations/your-association/formulaires/partner-bronze" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-center w-full py-2 px-4 bg-[#CD7F32]/20 hover:bg-[#CD7F32]/30 text-[#CD7F32] rounded-lg font-medium transition-colors"
                >
                  Become a Bronze Partner
                </a>
              </div>
            </div>
            
            {/* Silver Tier */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300 transform scale-105 z-10">
              <div className="bg-[#C0C0C0]/10 p-6 text-center">
                <div className="inline-block bg-orange/10 px-3 py-1 rounded-full text-orange text-xs font-medium mb-3">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-[#808080]">Silver Partner</h3>
                <div className="text-3xl font-bold mt-2 mb-1">€1,000</div>
                <p className="text-gray-600 text-sm">Annual contribution</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Logo on our website</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Social media recognition</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dedicated newsletter feature</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Event presence (2 per year)</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg className="h-5 w-5 text-gray-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Exclusive partner events</span>
                  </li>
                </ul>
                <a 
                  href="https://www.helloasso.com/associations/your-association/formulaires/partner-silver" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-center w-full py-2 px-4 bg-[#808080] hover:bg-[#707070] text-white rounded-lg font-medium transition-colors"
                >
                  Become a Silver Partner
                </a>
              </div>
            </div>
            
            {/* Gold Tier */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="bg-[#FFD700]/10 p-6 text-center">
                <h3 className="text-xl font-bold text-[#DAA520]">Gold Partner</h3>
                <div className="text-3xl font-bold mt-2 mb-1">€2,500</div>
                <p className="text-gray-600 text-sm">Annual contribution</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Premium logo placement</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dedicated social media campaigns</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Featured partner article</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Event presence (all events)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Exclusive partner events</span>
                  </li>
                </ul>
                <a 
                  href="https://www.helloasso.com/associations/your-association/formulaires/partner-gold" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-center w-full py-2 px-4 bg-[#DAA520] hover:bg-[#B8860B] text-white rounded-lg font-medium transition-colors"
                >
                  Become a Gold Partner
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-brown text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in Becoming a Partner?</h2>
            <p className="text-tan/90 text-lg mb-8">
              We'd love to discuss how we can create a meaningful partnership that aligns with your 
              organization's values and goals while supporting our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.helloasso.com/associations/your-association/formulaires/partner-inquiry" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-orange hover:bg-orange-light transition-all"
                >
                  Become a Partner
                </Button>
              </a>
              <a 
                href="mailto:partnerships@yourdomain.com"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Partners;
