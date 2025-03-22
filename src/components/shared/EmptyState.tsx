import { SVGProps } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconEmptyState } from '@/icons';

type EmptyStateProps = {
  /** Title text to display */
  title?: string;
  /** Optional description text */
  description?: string;
  /** Optional custom icon component */
  icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
  /** Optional button text */
  buttonText?: string;
  /** Optional button click handler */
  onButtonClick?: () => void;
  /** Optional additional className */
  className?: string;
};

/**
 * A component to display when there is no data to show
 * Can be customized with different icons, titles, descriptions and optional action button
 */
const EmptyState = ({
  title = 'No results found',
  description = 'There are no results to display at the moment',
  icon: Icon = IconEmptyState,
  buttonText,
  onButtonClick,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn('flex flex-col items-center justify-center h-full p-4 text-center', className)}
    >
      <Icon className="size-24 mb-4" />
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {buttonText && onButtonClick && (
        <Button variant="link" className="p-0" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export { EmptyState };
