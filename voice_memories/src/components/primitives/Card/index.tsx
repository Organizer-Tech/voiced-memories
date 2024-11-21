import clsx from 'clsx';
import React, { ReactNode, forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className, ...props }: CardProps, ref: any) => {
  return (
    <div
      className={clsx(
        'rounded-md border-2 border-b border-gray-200 px-4 py-5 shadow-lg transition-all duration-500 hover:shadow-xl sm:px-6',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
