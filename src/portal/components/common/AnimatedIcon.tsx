import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  KeyRound, 
  AlertTriangle,
  Zap,
  Activity,
  Cookie,
  Eye,
  EyeOff
} from 'lucide-react';

export type AnimatedIconType = 
  | 'shield' 
  | 'lock' 
  | 'sparkle' 
  | 'check' 
  | 'key' 
  | 'alert' 
  | 'zap' 
  | 'activity' 
  | 'cookie'
  | 'eye'
  | 'eye-off';

export interface AnimatedIconProps {
  type: AnimatedIconType;
  className?: string;
  size?: number;
  animation?: 'pulse' | 'spin-slow' | 'bounce-subtle' | 'twinkle' | 'wobble' | 'ping-subtle' | 'none';
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  type,
  className = '',
  size = 18,
  animation = 'pulse'
}) => {
  const getAnimationClass = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]';
      case 'spin-slow':
        return 'animate-[spin_6s_linear_infinite]';
      case 'bounce-subtle':
        return 'animate-[bounce_2s_infinite]';
      case 'twinkle':
        return 'animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]';
      case 'wobble':
        return 'hover:rotate-12 transition-transform duration-300';
      case 'ping-subtle':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  const animClass = getAnimationClass();

  const renderIcon = () => {
    const props = { size, className: `${animClass} ${className}` };
    switch (type) {
      case 'shield':
        return <ShieldCheck {...props} />;
      case 'lock':
        return <Lock {...props} />;
      case 'sparkle':
        return <Sparkles {...props} />;
      case 'check':
        return <CheckCircle2 {...props} />;
      case 'key':
        return <KeyRound {...props} />;
      case 'alert':
        return <AlertTriangle {...props} />;
      case 'zap':
        return <Zap {...props} />;
      case 'activity':
        return <Activity {...props} />;
      case 'cookie':
        return <Cookie {...props} />;
      case 'eye':
        return <Eye {...props} />;
      case 'eye-off':
        return <EyeOff {...props} />;
      default:
        return <ShieldCheck {...props} />;
    }
  };

  return <span className="inline-flex items-center justify-center">{renderIcon()}</span>;
};

