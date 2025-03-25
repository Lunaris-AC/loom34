
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  slug: string;
  className?: string;
  featured?: boolean;
}

const ArticleCard = ({
  title,
  excerpt,
  date,
  image,
  category,
  slug,
  className,
  featured = false,
}: ArticleCardProps) => {
  return (
    <article 
      className={cn(
        "group overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover-lift",
        featured ? "md:col-span-2" : "",
        className
      )}
    >
      <Link to={`/articles/${slug}`} className="block h-full">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute top-4 left-4 bg-orange text-white text-xs font-medium px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <Calendar size={16} className="mr-1" />
            <time dateTime={new Date(date).toISOString()}>{date}</time>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-brown transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-600 line-clamp-3">
            {excerpt}
          </p>
          <div className="mt-4 text-brown font-medium flex items-center">
            Read more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;
