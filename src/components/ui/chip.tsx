import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const ChipVariants = cva('inline-flex items-center justify-center rounded-full font-medium', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      outline: 'border border-border',
    },
    size: {
      default: 'size-8 text-sm',
      sm: 'size-6 text-xs',
      lg: 'size-10 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface NumberChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof ChipVariants> {}

const Chip = React.forwardRef<HTMLSpanElement, NumberChipProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span className={cn(ChipVariants({ variant, size, className }))} ref={ref} {...props}>
        {props.children}
      </span>
    );
  },
);
Chip.displayName = 'Chip';

export { Chip, ChipVariants };
