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
  const [imageError, setImageError] = useState(false);
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
      setImageError(true);
      setIsLoading(false);
    };
    img.src = '/cettex.png';
    
    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  const sizeClasses = {
    xs: 'h-8 w-8',
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
    xl: 'h-24 w-24',
    '2xl': 'h-28 w-28',
    '3xl': 'h-32 w-32'
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
    focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:ring-offset-2 focus:ring-offset-dark-purple
    rounded-lg
  `;

  // Simple loading skeleton
  const LoadingSkeleton = () => (
    <div 
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br from-neon-green/20 to-neon-green/5
        border border-neon-green/30
        rounded-lg
        animate-pulse
        flex items-center justify-center
      `}
    >
      <div className="text-neon-green text-xs font-bold">Loading...</div>
    </div>
  );

  // If still loading and showLoading is true
  if (isLoading && showLoading) {
    return <LoadingSkeleton />;
  }

  // Simple img tag with robust error handling
  return (
    <img
      src="/cettex.png"
      srcSet={`
        /cettex.png 1x,
        /cettex@2x.png 2x,
        /cettex@3x.png 3x
      `}
      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
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
        setImageError(true);
      }}
    />
  );
};

export default Logo;