import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  variant?: 'default' | 'inverted' | 'monochrome';
  showLoading?: boolean;
  priority?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'default',
  showLoading = true,
  priority = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload logo for better UX
    const img = new Image();
    img.onload = () => {
      console.log('Logo image loaded successfully');
      setImageLoaded(true);
      setIsLoading(false);
    };
    img.onerror = (e) => {
      console.error('Logo image failed to load:', e);
      setIsLoading(false);
    };
    img.src = '/logo.png';
    
    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  // Enhanced responsive size classes - bigger on desktop, smaller on mobile
  const sizeClasses = {
    xs: 'h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24',
    sm: 'h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 xl:h-32 xl:w-32',
    md: 'h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36',
    lg: 'h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40',
    xl: 'h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 xl:h-44 xl:w-44',
    '2xl': 'h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 lg:h-44 lg:w-44 xl:h-48 xl:w-48',
    '3xl': 'h-36 w-36 sm:h-40 sm:w-40 md:h-44 md:w-44 lg:h-48 lg:w-48 xl:h-52 xl:w-52'
  };

  const variantClasses = {
    default: 'filter-none',
    inverted: 'filter invert brightness-200 contrast-125',
    monochrome: 'filter grayscale contrast-200 brightness-150'
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
    transition-all duration-300 ease-in-out
    hover:scale-105 hover:brightness-110
    focus:outline-none focus:ring-2 focus:ring-cettex-cyan/50 focus:ring-offset-2 focus:ring-offset-cettex-gray
    rounded-lg object-contain
  `;

  // Simple loading skeleton with responsive sizing
  const LoadingSkeleton = () => (
    <div 
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br from-cettex-cyan/20 to-cettex-cyan/5
        border border-cettex-cyan/30
        rounded-lg
        animate-pulse
        flex items-center justify-center
      `}
    >
      <div className="text-cettex-cyan text-xs font-bold">Loading...</div>
    </div>
  );

  // If still loading and showLoading is true
  if (isLoading && showLoading) {
    return <LoadingSkeleton />;
  }

  // Simple img tag with logo.png only
  return (
    <img
      src="/logo.png"
      alt="CETTEX - Centre Technique du Textile"
      className={baseClasses}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        imageRendering: 'crisp-edges'
      }}
      onLoad={() => {
        console.log('Logo image rendered successfully');
        setImageLoaded(true);
      }}
      onError={(e) => {
        console.error('Logo image rendering error:', e);
      }}
    />
  );
};

export default Logo;