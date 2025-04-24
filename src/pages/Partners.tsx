
import { Heart, Users, Shield, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

const partnersList = [
  {
    name: "COXX",
    logo: "https://scontent-mrs2-3.xx.fbcdn.net/v/t39.30808-6/483940339_1203290995139705_1629202427472008641_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=9MUBUgfubLYQ7kNvwGOyRzk&_nc_oc=AdkcU8KwHpR84motv6oOO8nBa_8eMGJBYntKeTE3--AtbUr3IdzPyZ6UGt8HfF2tvRkmBVqFGgKRLez1WJoIcEIV&_nc_zt=23&_nc_ht=scontent-mrs2-3.xx&_nc_gid=9_TYgDyo3Tn5j7a17YPmbw&oh=00_AfG7MMB4TkHHbr5oIL8XVN_iz9tSFts3dAhFj9iaTPj1Eg&oe=68105990",
    description: "Pinte à 5€, 3€50 le verre de vin, 2€50 le soft toute l'année",
    website: "https://www.instagram.com/coxx_montpellier/",
    type: "Bar"
  },
  {
    name: "Rainbow Foundation",
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
    logo: "https://www.osullivans-pubs.com/wp-content/uploads/2023/07/logo-osullivans.png",
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
    logo: "https://konceptsauna.com/images/Koncept-Sauna-Logo-Blanc-850.png",
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
    logo: "https://static.wixstatic.com/media/34f4c8_8c104c4d0ec3492b87df0ada446197d5~mv2.png/v1/fill/w_205,h_116,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%20one%20sauna%20blanc%203.png",
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
    logo: "https://scontent-mrs2-2.cdninstagram.com/v/t51.2885-19/288860110_327873649516842_881871313493810128_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=scontent-mrs2-2.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2QEs2l-sBPToFScX_1-vwAB-SJB4UXhY2iYMdLKJKnGFDtuUMLhHPrm0y356KHNCBaKckJo36swVZkiUdosbNO9_&_nc_ohc=QnT_JgN9bHYQ7kNvwHxV1BO&_nc_gid=j6Xi-mcAAruYUlcXToTU5g&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfHmFVTE6z6DVHRisIHBF_vkh1iSftH2E6KaSZqeOs5eTA&oe=68104AED&_nc_sid=7a9f4b",
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
    description: "10 % sur le prix d’un séjour au gite à Condom",
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
