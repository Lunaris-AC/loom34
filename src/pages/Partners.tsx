import { Heart, Users, Shield, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

const partnersList = [
  {
    name: "COXX",
    logo: "https://www.montpelliergay.com/wp-content/uploads/2020/07/image0.jpeg",
    description: "Pinte à 5€, 3€50 le verre de vin, 2€50 le soft toute l'année",
    website: "https://www.instagram.com/coxx_montpellier/",
    type: "Bar"
  },
  {
    name: "Le Mercury Bar",
    logo: "https://mcfiles.inferi.fr/api/public/dl/5pAFPUct?inline=true",
    description: "Pinte de blonde 5€, bière spéciale à 6,50€",
    website: "https://www.instagram.com/lemercurybar/",
    type: "Bar"
  },
  {
    name: "Hypnobar",
    logo: "https://mcfiles.inferi.fr/api/public/dl/fzUnOBmn?inline=true",
    description: "5€ la Pinte de blonde, 6.50 € la bière spéciale et 5 € le verre de vin",
    website: "https://www.instagram.com/hypnobar34/",
    type: "Bar"
  },
  {
    name: "Marvelous",
    logo: "https://mcfiles.inferi.fr/api/public/dl/Roj0882Q?inline=true",
    description: "10 % de réduction sur les menus (N'inclut pas plats à la carte et boissons) au restaurant",
    website: "https://www.instagram.com/marvelousmontpellier/",
    type: "Restaurant"
  },
  {
    name: "O'Sullivans",
    logo: "https://mcfiles.inferi.fr/api/public/dl/8xPsFuov?inline=true",
    description: "Kronenbourg à 5€, bières spéciales, blanche et ambrée à 6€ / Sur certains cocktails (Cuba libre, Sex on the beach, Téquila Sunrise, gin-fizz, Gin tonique) et verre de vin à 5€ / Soft à 4€ et cocktails sans alcool à 5€",
    website: "https://www.instagram.com/osullivans_mtp/",
    type: "Pub'"
  },
  {
    name: "Ilebo",
    logo: "https://image.jimcdn.com/app/cms/image/transf/dimension=1280x10000:format=jpg/path/se278ebbbfaf2ef2e/image/ia2cf1b1193814e6a/version/1648891641/image.jpg",
    description: "10 % sur les soins, massage et épilation",
    website: "https://www.ilebo.fr/",
    type: "Cabinet d'esthétique"
  },
  {
    name: "Genome",
    logo: "https://local-fr-public.s3.eu-west-3.amazonaws.com/prod/webtool/userfiles/78981/Logo-Genome.webp",
    description: "10 % sur les soins, massage et épilation",
    website: "https://www.genome-institut.com/",
    type: "Cabinet d'esthétique"
  },
  {
    name: "VEAN Tatoo",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs_sBajwUUKOGM-OQ7mWam3kIaa5A3tfZSjA&s",
    description: "10% sur un tatouage 10x10 et 15% sur tatouage 15x15 ",
    website: "https://vean-tattoo.fr/studios-de-tatouage/montpellier",
    type: "Salon de Tatouage"
  },
  {
    name: "Koncept Sauna",
    logo: "https://konceptsauna.com/images/Koncept-Sauna-Logo-Couleur-850.png",
    description: "Boisson offerte lors des jeudis Bears",
    website: "https://konceptsauna.com/",
    type: "Sauna gay"
  },
  {
    name: "Sauna H2O",
    logo: "https://www.h2o-sauna.fr/sites/4926cw0123/files/logo.png",
    description: "Réduction sur l'entrée pour les après-midi Bears et une boisson hors alcool offerte les autres jours",
    website: "https://www.h2o-sauna.fr/",
    type: "Sauna gay"
  },
  {
    name: "ONE Sauna",
    logo: "https://mcfiles.inferi.fr/api/public/dl/I_wjd9qN?inline=true",
    description: "Une boisson offerte",
    website: "https://www.one-sauna.com/",
    type: "Sauna gay"
  },
  {
    name: "Lilou Plaisir",
    logo: "https://lilouplaisir.com/cdn/shop/files/Logo_1000x.png?v=1656052312",
    description: "20% de réduction",
    website: "https://lilouplaisir.com/",
    type: "Love Shop"
  },
  {
    name: "MOOM Club",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0gzY3X-kD2aqjt_tT9CqEwbacrMxFBTa77A&s",
    description: "Entrée Gratuite",
    website: "https://www.instagram.com/moom_club/?hl=fr",
    type: "Club"
  },
  {
    name: "Boogui Burger",
    logo: "https://booguiburger.fr/wa_83htr4kd8xdlh8_text.png?v=6iazqw79sk45ber",
    description: "10% de remise sur la carte",
    website: "https://booguiburger.fr/",
    type: "Restaurant"
  },
  {
    name: "Ma Boutique Alternative",
    logo: "https://www.maboutiquealternative.fr/wp-content/uploads/go-x/u/f76b6a67-fb40-4b48-bdea-22513dd06cc4/image-455x455.jpg",
    description: "10% sur les produits de la boutique",
    website: "https://www.maboutiquealternative.fr/",
    type: "Boutique"
  },
  {
    name: "Bears n Breakfast",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSODkdTS1CNGwmybx7xMiaAdTgUtz2ZjlefgA&s",
    description: "10 % sur le prix d'un séjour au gite à Condom",
    website: "https://www.bearsnbreakfast.com/",
    type: "Chambres d'hôtes LGBTQIA+"
  },
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
              Nos Partenaires
            </h1>
            <p className="text-lg text-gray-700">
              Nous sommes reconnaissants envers les organisations et entreprises qui soutiennent notre mission.
              Ensemble, nous créons une communauté plus forte et plus inclusive.
            </p>
          </div>
        </div>
      </section>
      
      {/* Partners Grid Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Découvrez nos partenaires" 
            subtitle="Les organisations et entreprises qui rendent notre travail possible."
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
                    Visiter le site
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
      {/* CTA Section */}
      <section className="py-16 bg-brown text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Intéressé pour devenir partenaire ?</h2>
            <p className="text-tan/90 text-lg mb-8">
              Nous serions ravis de discuter de la façon dont nous pouvons créer un partenariat significatif qui s'aligne 
              avec les valeurs et les objectifs de votre organisation tout en soutenant notre communauté.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:contactloom34@gmail.com"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Nous contacter
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
