import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import type { OverridableComponent } from '../../types/OverridableComponent';
import utilityClasses from '../../utilities/utility.module.css';

import classes from './Card.module.css';

export type CardProps = {
  /**
   * Changes background & border color
   * @default neutral
   */
  color?: 'neutral' | 'subtle' | 'first' | 'second' | 'third';

  /** Instances of `Card.Header`, `Card.Content`, `Card.Footer` or other React nodes like `Divider` */
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Card: OverridableComponent<CardProps, HTMLDivElement> = forwardRef(
  ({ color = 'neutral', children, as: Component = 'div', ...rest }, ref) => {
    const isLink = rest?.href != null;
    return (
      <Component
        {...rest}
        ref={ref}
        className={cn(
          classes.card,
          classes[color],
          isLink && classes.linkCard,
          isLink && utilityClasses.focusable,
          rest.className,
        )}
      >
        {children}
      </Component>
    );
  },
);