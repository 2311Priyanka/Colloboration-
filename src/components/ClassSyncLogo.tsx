import { motion } from 'framer-motion';

interface ClassSyncLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function ClassSyncLogo({ size = 'md', showText = true }: ClassSyncLogoProps) {
  const dims = { sm: 32, md: 40, lg: 56 }[size];
  const textSize = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' }[size];

  return (
    <div className="flex items-center gap-2.5">
      <motion.svg
        width={dims}
        height={dims}
        viewBox="0 0 56 56"
        fill="none"
        initial={{ rotate: -10, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {/* Background circle */}
        <circle cx="28" cy="28" r="26" fill="url(#logoGrad)" />
        
        {/* Grid lines - timetable */}
        <line x1="16" y1="18" x2="40" y2="18" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="16" y1="24" x2="40" y2="24" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="16" y1="30" x2="40" y2="30" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="16" y1="36" x2="40" y2="36" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="24" y1="14" x2="24" y2="40" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="32" y1="14" x2="32" y2="40" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
        
        {/* AI brain node center */}
        <circle cx="28" cy="27" r="5" fill="white" fillOpacity="0.95" />
        <circle cx="28" cy="27" r="3" fill="url(#nodeGrad)" />
        
        {/* Connecting arrows / cycle */}
        <path d="M20 42 C20 46, 36 46, 36 42" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <polygon points="37,41 36,44 34,41" fill="white" />
        <path d="M36 12 C36 8, 20 8, 20 12" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <polygon points="19,13 20,10 22,13" fill="white" />

        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="56" y2="56">
            <stop stopColor="#1E3A8A" />
            <stop offset="1" stopColor="#0D9488" />
          </linearGradient>
          <linearGradient id="nodeGrad" x1="25" y1="24" x2="31" y2="30">
            <stop stopColor="#1E3A8A" />
            <stop offset="1" stopColor="#0D9488" />
          </linearGradient>
        </defs>
      </motion.svg>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${textSize} font-bold text-foreground`}>
            Class<span className="text-secondary">Sync</span>
          </span>
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">AI</span>
        </div>
      )}
    </div>
  );
}
