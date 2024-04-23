import React, { ComponentProps, forwardRef, ForwardedRef } from 'react';
import clsx from 'clsx';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { colors } from '../../types';
import { toKabobCase } from '../../utils/toKabobCase';

interface InputProps extends ComponentProps<'input'> {
  label: string;
  color?: colors;
  className?: string;
  error?: any;
}

export const Input = forwardRef(
  ({ label, name, error, type = 'text', ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const [animatedRef] = useAutoAnimate<HTMLDivElement>();
    const id = name || toKabobCase(label);

    return (
      <div className={clsx('space-y-1')} ref={animatedRef}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        <input
          {...props}
          id={id}
          name={id}
          ref={ref}
          type={type}
          className={clsx(
            'block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:ring-gray-200 sm:text-sm'
          )}
        />

        {error && <div className="mt-2 text-sm text-red-500">{error.message}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';
