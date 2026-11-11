import React from 'react';

interface LogoProps {
  variant?: 'icon' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

const SIZE_MAP = {
  sm: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
  md: { icon: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]' },
  lg: { icon: 'w-12 h-12', text: 'text-xl', sub: 'text-[11px]' },
  xl: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs' },
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  const dimensions = SIZE_MAP[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Símbolo / Ícone do Logo */}
      <div className={`relative shrink-0 ${dimensions.icon}`}>
        <img
          src="/logo-icon.svg"
          alt="Q.I. Match Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(250,204,21,0.25)] transition-transform hover:scale-105 duration-200"
        />
      </div>

      {/* Tipografia da Marca (Quando variant = 'full') */}
      {variant === 'full' && (
        <div className="flex flex-col min-w-0">
          <div className={`font-heading font-extrabold tracking-tight leading-tight ${dimensions.text} flex items-center gap-1.5`}>
            <span className="text-foreground dark:text-white">Q.I.</span>
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              MATCH
            </span>
          </div>

          {showSubtitle && (
            <span className={`font-mono font-bold uppercase tracking-wider text-amber-500/90 dark:text-amber-400/90 truncate mt-0.5 ${dimensions.sub}`}>
              Protocolo Soberano
            </span>
          )}
        </div>
      )}
    </div>
  );
};
