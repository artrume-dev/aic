import { Award, TrendingUp, Star, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PartnerTier } from '@/types/team';

interface PartnerTierBadgeProps {
  tier: PartnerTier;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const tierConfig = {
  EMERGING: {
    icon: TrendingUp,
    label: 'Emerging Partner',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300',
    description: 'Growing AI consultancy with proven track record',
  },
  ESTABLISHED: {
    icon: Award,
    label: 'Established Partner',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    description: 'Established firm with extensive AI expertise',
  },
  PREMIER: {
    icon: Star,
    label: 'Premier Partner',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    description: 'Top-tier AI consultancy with exceptional results',
  },
  ENTERPRISE: {
    icon: Crown,
    label: 'Enterprise Partner',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    description: 'Elite partner for large-scale AI transformations',
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

export function PartnerTierBadge({
  tier,
  className,
  showLabel = true,
  size = 'md',
}: PartnerTierBadgeProps) {
  const config = tierConfig[tier];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

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
      title={config.description}
    >
      <Icon className={sizeStyles.iconSize} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
