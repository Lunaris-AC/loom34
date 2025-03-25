
import { BookOpen, Users, Calendar, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-tan/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-36 pb-16 bg-gradient-to-b from-tan/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">About Our Association</h1>
            <p className="text-lg text-gray-700">
              Founded in 2010, our community has grown to become a vibrant hub for connection, 
              support, and celebration. Learn about our history, mission, and the people who make it all possible.
            </p>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-20 h-1.5 bg-orange mb-6"></div>
              <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
              <p className="text-gray-700 mb-4">
                We strive to create a welcoming and inclusive community where everyone feels valued and respected. 
                Our mission is to provide a safe space for connection, self-expression, and celebration of diversity.
              </p>
              <p className="text-gray-700 mb-4">
                We envision a world where communities like ours are no longer necessary because everyone is 
                accepted for who they are. Until then, we'll continue to build bridges, foster understanding, 
                and create spaces where authentic connections can flourish.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="rounded-full bg-brown/10 w-12 h-12 flex items-center justify-center mb-3">
                    <BookOpen size={24} className="text-brown" />
                  </div>
                  <h3 className="font-semibold mb-1">Education</h3>
                  <p className="text-sm text-gray-600">Providing resources and opportunities for learning</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="rounded-full bg-orange/10 w-12 h-12 flex items-center justify-center mb-3">
                    <Users size={24} className="text-orange" />
                  </div>
                  <h3 className="font-semibold mb-1">Community</h3>
                  <p className="text-sm text-gray-600">Building connections and fostering belonging</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Community gathering" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* History Timeline */}
      <section className="py-16 bg-tan/20">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Our History" 
            subtitle="The journey from our humble beginnings to where we are today."
            centered
          />
          
          <div className="relative max-w-3xl mx-auto mt-16">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-brown/30"></div>
            
            {/* 2010 */}
            <div className="relative mb-16">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full border-4 border-brown bg-white z-10"></div>
              <div className="ml-auto mr-auto md:ml-0 md:mr-[50%] md:pr-8 w-full md:w-1/2 text-right">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <span className="text-brown font-bold">2010</span>
                  <h3 className="text-xl font-semibold mb-2">Foundation</h3>
                  <p className="text-gray-700">
                    Our association was founded by a small group of friends who wanted to create 
                    a space where everyone could feel welcome and accepted.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 2015 */}
            <div className="relative mb-16">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full border-4 border-orange bg-white z-10"></div>
              <div className="ml-auto mr-auto md:ml-[50%] md:mr-0 md:pl-8 w-full md:w-1/2">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <span className="text-orange font-bold">2015</span>
                  <h3 className="text-xl font-semibold mb-2">Growth & Recognition</h3>
                  <p className="text-gray-700">
                    Our community grew to over 500 members, and we received our first grant 
                    to expand our programming and reach.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 2020 */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full border-4 border-brown bg-white z-10"></div>
              <div className="ml-auto mr-auto md:ml-0 md:mr-[50%] md:pr-8 w-full md:w-1/2 text-right">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <span className="text-brown font-bold">2020</span>
                  <h3 className="text-xl font-semibold mb-2">Digital Transformation</h3>
                  <p className="text-gray-700">
                    During the pandemic, we pivoted to virtual events and connections, 
                    allowing us to reach even more people and expand our impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Meet Our Team" 
            subtitle="The dedicated individuals who make our community thrive."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Alexandre Dupont" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Alexandre Dupont</h3>
                <p className="text-orange mb-4">President</p>
                <p className="text-gray-600">
                  Alexandre has been with us since the beginning and leads with compassion and vision.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Marie Leclerc" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Marie Leclerc</h3>
                <p className="text-orange mb-4">Secretary</p>
                <p className="text-gray-600">
                  Marie keeps our organization running smoothly with her exceptional organizational skills.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Jean Moreau" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Jean Moreau</h3>
                <p className="text-orange mb-4">Treasurer</p>
                <p className="text-gray-600">
                  Jean ensures our finances are managed responsibly so we can continue our mission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-brown text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-20 h-1.5 bg-orange mb-6"></div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-tan/90 mb-8">
                We'd love to hear from you! Whether you have questions about membership, 
                upcoming events, or how to get involved, our team is here to help.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="mr-4 text-orange mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-tan/90">123 Community Avenue, Paris, 75001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="mr-4 text-orange mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-tan/90">Monday to Friday: 10am - 6pm</p>
                    <p className="text-tan/90">Saturday: 10am - 2pm</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white text-gray-900 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Contact Form</h3>
              <form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                    placeholder="Subject"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-brown hover:bg-brown-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
