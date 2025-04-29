import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ExternalLink, Info, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  slug: string;
  registrationUrl?: string;
  className?: string;
}

const EventCard = ({
  title,
  description,
  date,
  time,
  location,
  image,
  slug,
  registrationUrl,
  className,
}: EventCardProps) => {
  return (
    <article 
      className={cn(
        "group overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover-lift",
        className
      )}
    >
      <div className="relative overflow-hidden aspect-[5/3]">
        <img
          src={image}
          alt={`Image de l'événement : ${title}`}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-white text-shadow text-xl font-semibold mb-1">
            {title}
          </h3>
          <div className="flex items-center text-white/90 text-sm">
            <Calendar size={16} className="mr-1" />
            <time dateTime={new Date(date).toISOString()}>{date}</time>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-start">
            <Clock size={18} className="mr-2 text-orange mt-0.5 flex-shrink-0" />
            <span>{time}</span>
          </div>
          <div className="flex items-start">
            <MapPin size={18} className="mr-2 text-orange mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-600">
              {location}
            </span>
          </div>
        </div>
        <p className="text-gray-600 line-clamp-3 mb-4">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            asChild
          >
            <Link to={`/events/${slug}`} aria-label={`Voir les détails de l'événement : ${title}`}>
              <Info className="w-4 h-4 mr-2" />
              Plus d'infos
          </Link>
          </Button>
          {registrationUrl && (
            <Button
              variant="default"
              size="sm"
              className="w-full"
              asChild
            >
              <Link
                to={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
                aria-label={`S'inscrire à l'événement : ${title}`}
              >
                <Ticket className="w-4 h-4 mr-2" />
                S'inscrire
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
