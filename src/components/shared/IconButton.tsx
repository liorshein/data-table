import { forwardRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

type IconButtonProps = ButtonProps & {
  /** Icon element to be displayed in the button */
  icon: React.ReactNode;
};

/**
 * Icon Button Component
 *
 * A button component specifically designed for displaying icons.
 *
 * Extends the base Button component with icon support.
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'icon', ...props }, ref) => {
    return (
      <Button {...props} size={size} ref={ref}>
        {icon}
      </Button>
    );
  },
);

IconButton.displayName = 'IconButton';

export { IconButton };
