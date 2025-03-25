
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  subtitleClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
}

const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  className,
  subtitleClassName,
  as = 'h2',
}: SectionHeadingProps) => {
  const Heading = as;
  
  return (
    <div className={cn(
      'mb-10',
      centered && 'text-center',
      className
    )}>
      <div className="inline-block mb-2">
        <div className="w-10 h-1 bg-orange mb-2"></div>
      </div>
      <Heading className={cn(
        "text-3xl md:text-4xl font-bold text-gray-900",
        centered && "mx-auto"
      )}>
        {title}
      </Heading>
      {subtitle && (
        <p className={cn(
          "mt-3 text-lg text-gray-600 max-w-2xl",
          centered && "mx-auto",
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
