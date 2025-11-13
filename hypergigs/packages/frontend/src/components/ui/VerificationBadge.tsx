import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
  status?: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  VERIFIED: {
    icon: CheckCircle2,
    label: 'Verified',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  VERIFIED_EXPERT: {
    icon: CheckCircle2,
    label: 'Expert Verified',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  VERIFIED_PREMIUM: {
    icon: CheckCircle2,
    label: 'Premium Verified',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
  PENDING: {
    icon: Clock,
    label: 'Pending',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
  },
  UNDER_REVIEW: {
    icon: Clock,
    label: 'Under Review',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
  REJECTED: {
    icon: XCircle,
    label: 'Not Verified',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
  UNVERIFIED: {
    icon: AlertCircle,
    label: 'Unverified',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
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

export function VerificationBadge({
  status = 'UNVERIFIED',
  className,
  showLabel = true,
  size = 'md',
}: VerificationBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.UNVERIFIED;
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  // Don't show unverified badge
  if (status === 'UNVERIFIED') {
    return null;
  }

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
    >
      <Icon className={sizeStyles.iconSize} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
