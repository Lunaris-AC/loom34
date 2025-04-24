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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">A propos de Loom</h1>
            <p className="text-lg text-gray-700">
            L'association Les Ours Occitanie Méditerranée (LOOM) a été créée le 9 novembre 2017. C'est une association pour les Bears mais aussi pour tous ceux qui aiment les Ours, les poils et les tailles allant du XS à XXXXXL.
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
              <h2 className="text-3xl font-bold mb-6">Notre vision</h2>
              <p className="text-gray-700 mb-4">
              Nous proposons, tout au long de l'année, des événements griffés Bears, comme des sorties, apéro, resto, ciné, rando, pique-nique. Le tout dans la bonne humeur et la convivialité.
              </p>
              <p className="text-gray-700 mb-4">
              Être Bear ce n'est pas qu'un physique c'est aussi un état d'esprit qui se veut bienveillant, convivial, amical et tolérant...
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="rounded-full bg-brown/10 w-12 h-12 flex items-center justify-center mb-3">
                    <BookOpen size={24} className="text-brown" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="rounded-full bg-orange/10 w-12 h-12 flex items-center justify-center mb-3">
                    <Users size={24} className="text-orange" />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://mcfiles.inferi.fr/api/public/dl/IDTLBxnE?inline=true" 
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
            title="Notre Histoire" 
            centered
          />
          
          <div className="relative max-w-3xl mx-auto mt-16">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-brown/30"></div>
            
            {/* 2017 */}
            <div className="relative mb-16">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full border-4 border-brown bg-white z-10"></div>
              <div className="ml-auto mr-auto md:ml-0 md:mr-[50%] md:pr-8 w-full md:w-1/2 text-right">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <span className="text-brown font-bold">9 Novembre 2017</span>
                  <h3 className="text-xl font-semibold mb-2">Création</h3>
                  <p className="text-gray-700">
                    6 copains ont eu l'idée de créer cette association pour ajouter du moelleux et des poils dans l'univers LGBTQ de Montpellier.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 2018 */}
            <div className="relative mb-16">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full border-4 border-orange bg-white z-10"></div>
              <div className="ml-auto mr-auto md:ml-[50%] md:mr-0 md:pl-8 w-full md:w-1/2">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <span className="text-orange font-bold">2018</span>
                  <h3 className="text-xl font-semibold mb-2">Premier Monsieur Ours</h3>
                  <p className="text-gray-700">
                    En juillet 2018 a été élu notre Unique Monsieur Ours Languedoc-Roussillon, Cédric François.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 2023 */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full border-4 border-brown bg-white z-10"></div>
              <div className="ml-auto mr-auto md:ml-0 md:mr-[50%] md:pr-8 w-full md:w-1/2 text-right">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <span className="text-brown font-bold">2024</span>
                  <h3 className="text-xl font-semibold mb-2">Un grand événement</h3>
                  <p className="text-gray-700">
                    En 2024, pour la première fois nous avons participé à la Marche des fièretés, avec notre propre char. C'est aussi l'année où nous avons dépassés les 100 adhérents.
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
                  src="https://mcfiles.inferi.fr/api/public/dl/k9Janer6?inline=true" 
                  alt="Stephane" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Stephane</h3>
                <p className="text-orange mb-4">Président</p>
                <p className="text-gray-600">
                  Ours fondateur de l'association.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://mcfiles.inferi.fr/api/public/dl/NQtPsDEF?inline=true" 
                  alt="Jean-Louis" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Jean-Louis</h3>
                <p className="text-orange mb-4">Vice-Président</p>
                <p className="text-gray-600">
                  Ours fondateur de l'association.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://mcfiles.inferi.fr/api/public/dl/MvotYu7L?inline=true" 
                  alt="Marc" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Marc</h3>
                <p className="text-orange mb-4">Trésorier</p>
                <p className="text-gray-600">
                  Ours responsable des bourses.
                </p>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://mcfiles.inferi.fr/api/public/dl/MoeBJVNs?inline=true" 
                  alt="Pascal" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Pascal</h3>
                <p className="text-orange mb-4">Co-Secrétaire</p>
                <p className="text-gray-600">
                  X
                </p>
              </div>
            </div>

            {/* Team Member 5 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://mcfiles.inferi.fr/api/public/dl/ZlJxFuwv?inline=true" 
                  alt="Florent" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Florent</h3>
                <p className="text-orange mb-4">Co-Secrétaire</p>
                <p className="text-gray-600">
                  X
                </p>
              </div>
            </div>

            {/* Team Member 6 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://mcfiles.inferi.fr/api/public/dl/SCyycrc6?inline=true" 
                  alt="Jean-Luc" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Jean-Luc</h3>
                <p className="text-orange mb-4">Chargé en Relations Publiques</p>
                <p className="text-gray-600">
                  Ours à l'appel depuis 2019 !
                </p>
              </div>
            </div>

            {/* Team Member 7 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://mcfiles.inferi.fr/share/hH8msW18" 
                  alt="Franck" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Franck</h3>
                <p className="text-orange mb-4">Chargé de communications</p>
                <p className="text-gray-600">
                  Un lover des Ours.
                </p>
              </div>
            </div>

            {/* Team Member 8 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://mcfiles.inferi.fr/api/public/dl/GcO8vG8l?inline=true" 
                  alt="Sylfried" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Sylfried</h3>
                <p className="text-orange mb-4">Adjoint Chargé de relations publiques</p>
                <p className="text-gray-600">
                  X
                </p>
              </div>
            </div>

            {/* Team Member 9 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://mcfiles.inferi.fr/api/public/dl/hb_-0wLM?inline=true" 
                  alt="Henri" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Henri</h3>
                <p className="text-orange mb-4">Monsieur Culture</p>
                <p className="text-gray-600">
                  X
                </p>
              </div>
            </div>

            {/* Team Member 10 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover-lift transition-all duration-300">
              <div className="aspect-square">
                <img 
                  src="https://mcfiles.inferi.fr/share/PIZdu2pA" 
                  alt="Étienne" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Étienne</h3>
                <p className="text-orange mb-4">Administrateur</p>
                <p className="text-gray-600">
                  X
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
              <h2 className="text-3xl font-bold mb-6">Nous Contacter</h2>
                <p className="text-tan/90 mb-8">
                Nous serions ravis de vous entendre ! Que vous ayez des questions sur l'adhésion, 
                les événements à venir ou comment vous impliquer, notre équipe est là pour vous aider.
                </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="mr-4 text-orange mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Nous retrouver</h3>
                    <p className="text-tan/90">49 Rue du faubourg St. Jaumes, Bat E, 34000 Montpellier</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white text-gray-900 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Formulaire de Contact</h3>
              <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                  placeholder="Votre nom"
                />
                </div>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                  placeholder="Votre email"
                />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input 
                type="text" 
                id="subject" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                placeholder="Sujet"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                id="message" 
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brown focus:border-brown"
                placeholder="Votre message"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-brown hover:bg-brown-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Envoyer le message
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
