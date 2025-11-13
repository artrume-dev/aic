import { Award, TrendingUp, Star, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TalentTier } from '@/constants/aiTalent';

interface TalentTierBadgeProps {
  tier: TalentTier;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  verified?: boolean; // Shows if this is a verified tier
}

const tierConfig = {
  JUNIOR: {
    icon: TrendingUp,
    label: 'Junior',
    verifiedLabel: 'Verified Junior',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300',
    description: '0-2 years experience in AI/ML',
  },
  MID: {
    icon: Award,
    label: 'Mid-Level',
    verifiedLabel: 'Verified Mid-Level',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    description: '2-5 years experience in AI/ML',
  },
  SENIOR: {
    icon: Star,
    label: 'Senior',
    verifiedLabel: 'Verified Senior',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    description: '5-10 years experience in AI/ML',
  },
  EXPERT: {
    icon: Crown,
    label: 'Expert',
    verifiedLabel: 'Verified Expert',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    description: '10+ years experience in AI/ML',
  },
  PRINCIPAL: {
    icon: Sparkles,
    label: 'Principal',
    verifiedLabel: 'Verified Principal',
    bgColor: 'bg-gradient-to-r from-purple-100 to-pink-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-400',
    description: 'Industry leader in AI/ML',
  },
};

const sizeConfig = {
  sm: {
    iconSize: 'w-3 h-3',
    textSize: 'text-xs',
    padding: 'px-2 py-0.5',
    gap: 'gap-1',
  },
  md: {
    iconSize: 'w-4 h-4',
    textSize: 'text-sm',
    padding: 'px-3 py-1',
    gap: 'gap-1.5',
  },
  lg: {
    iconSize: 'w-5 h-5',
    textSize: 'text-base',
    padding: 'px-4 py-1.5',
    gap: 'gap-2',
  },
};

export function TalentTierBadge({
  tier,
  className,
  showLabel = true,
  size = 'md',
  verified = false,
}: TalentTierBadgeProps) {
  const config = tierConfig[tier];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  const label = verified ? config.verifiedLabel : config.label;
  const description = verified
    ? `${config.description} - AI Verified`
    : config.description;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeStyles.padding,
        sizeStyles.gap,
        sizeStyles.textSize,
        className
      )}
      title={description}
    >
      <Icon className={sizeStyles.iconSize} />
      {showLabel && <span>{label}</span>}
      {verified && <Sparkles className={cn(sizeStyles.iconSize, 'ml-0.5')} />}
    </div>
  );
}
