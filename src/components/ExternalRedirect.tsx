
import { useEffect } from 'react';

interface ExternalRedirectProps {
  url: string;
}

const ExternalRedirect = ({ url }: ExternalRedirectProps) => {
  useEffect(() => {
    // Redirect to external URL
    window.location.href = url;
  }, [url]);

  // Show loading state while redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-tan/10">
      <div className="w-16 h-16 border-4 border-brown/20 border-t-brown rounded-full animate-spin mb-4"></div>
      <p className="text-lg text-gray-700">Redirecting to external site...</p>
    </div>
  );
};

export default ExternalRedirect;
