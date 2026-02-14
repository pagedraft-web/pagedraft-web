
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Square */}
      <rect width="100" height="100" rx="8" fill="currentColor" />
      
      {/* Drafting Pen / Stylized 'P' */}
      <path 
        d="M30 25V75" 
        stroke="white" 
        strokeWidth="12" 
        strokeLinecap="square" 
      />
      <path 
        d="M30 31H55C65 31 70 38 70 45C70 52 65 59 55 59H30" 
        stroke="white" 
        strokeWidth="12" 
        strokeLinejoin="bevel"
      />
      
      {/* Accent - Orange Tip */}
      <rect x="75" y="75" width="15" height="15" fill="#f97316" />
    </svg>
  );
};

export default Logo;
