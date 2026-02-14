
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-black uppercase tracking-tighter transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-center border-2 py-3 px-6 active:translate-x-1 active:translate-y-1 active:shadow-none";
  
  const variants = {
    primary: "bg-black text-white border-black neo-shadow hover:bg-orange-500 hover:border-orange-500 hover:neo-shadow-orange",
    secondary: "bg-orange-500 text-white border-orange-500 neo-shadow hover:bg-black hover:border-black",
    outline: "bg-white text-black border-black neo-shadow hover:bg-black hover:text-white"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 mr-3 text-current" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      <span className="inline-block w-full text-inherit">
        {children}
      </span>
    </button>
  );
};

export default Button;
