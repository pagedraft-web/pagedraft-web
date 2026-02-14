
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label className="block text-xs font-black uppercase tracking-widest text-black mb-3 ml-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-5 py-3 border-4 font-black transition-all duration-200 outline-none placeholder:text-gray-300 placeholder:font-medium
          ${error ? 'border-red-500 neo-shadow' : 'border-black focus:translate-x-1 focus:translate-y-1 focus:shadow-none neo-shadow focus:border-orange-500'}
        `}
        {...props}
      />
      {error && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
