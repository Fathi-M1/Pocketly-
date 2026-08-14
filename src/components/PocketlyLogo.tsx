import React from 'react';

interface PocketlyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const PocketlyLogo: React.FC<PocketlyLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  iconOnly = false,
}) => {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44,
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 font-heading select-none ${className}`}>
      {/* Pocketly Iconic Shield 'P' Icon */}
      <svg
        width={iconSizes}
        height={iconSizes}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform active:scale-95"
      >
        <path
          d="M20 22 C20 16, 25 12, 32 12 H72 C78 12, 82 17, 82 23 V48 C82 66, 68 84, 52 90 C50 90.8, 48 90.8, 46 90 L46 64 C46 59, 50 55, 55 55 H62 C67 55, 71 51, 71 46 V32 C71 27, 67 23, 62 23 H32 C26 23, 21 27, 21 33 V54 C21 68, 30 80, 42 86 L40 94 C26 87, 12 72, 12 52 V30 C12 25, 15 22, 20 22 Z"
          fill="#7047EB"
        />
        {/* Soft Inner Shadow Contour for crispness */}
        <path
          d="M32 23 H62 C67 23, 71 27, 71 32 V46 C71 51, 67 55, 62 55 H55 C50 55, 46 59, 46 64 V89 C32 83, 21 70, 21 54 V33 C21 27, 26 23, 32 23 Z"
          fill="#865BF5"
          fillOpacity="0.18"
        />
      </svg>

      {!iconOnly && showText && (
        <span
          className={`font-bold tracking-tight text-[#1E1B4B] ${
            size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
          }`}
        >
          Pocketly
        </span>
      )}
    </div>
  );
};
