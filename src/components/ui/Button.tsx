import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { themeConfig } from '../../theme/theme.config';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', magnetic = true, className = '', children, ...props }, ref) => {
    const magneticRef = useMagnetic({ 
      strength: themeConfig.cursor.magneticStrength,
      radius: 80 
    });

    const combinedRef = (el: HTMLButtonElement | null) => {
      magneticRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    };

    const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg';
    
    const variantStyles = {
      primary: 'bg-glow text-white hover:brightness-110 active:brightness-95 focus-visible:ring-glow',
      secondary: 'bg-primary text-white hover:brightness-110 active:brightness-95 focus-visible:ring-primary',
      ghost: 'bg-transparent text-text hover:bg-surface border border-surfaceAlt focus-visible:ring-primary',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={combinedRef}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';