import React, { forwardRef, ForwardedRef, ComponentProps, ReactNode } from 'react';
import clsx from 'clsx';
import Ripple from 'material-ripple-effects';

import { colors, sizes, variants } from '../../types';

export interface ButtonProps extends ComponentProps<'button'> {
  /**
   * ReactElement for contents in button
   */
  children: ReactNode;
  /**
   * onClick handler
   */
  onClick?: () => void;
  /**
   * Type of button variant
   */
  variant?: variants;
  /**
   * How large should the button be?
   */
  size?: sizes | 'none';
  /**
   * Button contents
   */
  color?: colors;
  /**
   * Boolean for animated ripple
   */
  ripple?: boolean;
  /**
   * className style override
   */
  className?: string;
  /**
   * Boolean for disabled state of button
   */
  disabled?: boolean;
  /**
   * Background color for storybook demonstration
   */
  backgroundColor?: string;
}

export const Button = forwardRef(
  (
    {
      children,
      className,
      variant,
      onClick,
      disabled,
      size = 'md',
      color = 'blue',
      type = 'button',
      ripple = true,
      backgroundColor,
      ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    // const isXS = size === 'xs';
    const rippleAnimation = new Ripple();
    const isSpecialtyVariant = variant === 'circle' || variant === 'round' || variant === 'icon';

    const buttonBase = clsx(
      size === 'xs' ? `rounded` : `rounded-md`,
      size === 'sm' && `leading-4`,
      size === 'xs' && variant === 'icon' && `leading-4`,
      variant === 'circle' && `rounded-full`,
      variant === 'round' && `rounded-full`,
      variant !== 'outline' && `border-transparent`,
      `inline-flex items-center justify-center border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`
    );

    const buttonTextSize = clsx(
      size === 'xs' && `text-xs`,
      size === 'sm' && `text-sm`,
      size === 'md' && `text-sm`,
      size === 'lg' && `text-base`,
      size === 'xl' && ``
    );

    const buttonSpacing = clsx(
      size === 'xs' && `px-2.5 py-1.5`,
      size === 'sm' && `px-3 py-2`,
      size === 'md' && `px-4 py-2`,
      size === 'lg' && `px-4 py-2`,
      size === 'xl' && `px-6 py-3`
    );

    const specialButtonSpacing = clsx(
      size === 'xs' && variant === 'icon' && `px-3 py-2`,
      size === 'sm' && variant === 'icon' && `px-3 py-2`,
      size === 'md' && variant === 'icon' && `px-4 py-2`,
      size === 'lg' && variant === 'icon' && `px-4 py-2`,
      size === 'xl' && variant === 'icon' && `px-6 py-3`,
      size === 'xs' && variant === 'round' && `px-3 py-1.5`,
      size === 'sm' && variant === 'round' && `px-3.5 py-2`,
      size === 'md' && variant === 'round' && `px-4 py-2`,
      size === 'lg' && variant === 'round' && `px-5 py-2`,
      size === 'xl' && variant === 'round' && `px-6 py-3`,
      size === 'xs' && variant === 'circle' && `p-1`,
      size === 'sm' && variant === 'circle' && `p-1.5`,
      size === 'md' && variant === 'circle' && `p-2`,
      size === 'lg' && variant === 'circle' && `p-2`,
      size === 'xl' && variant === 'circle' && `p-3`
    );

    const amber = clsx(
      variant === 'secondary' && `bg-amber-100 text-amber-700 hover:bg-amber-200 focus:ring-amber-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-amber-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500`
    );

    const blue = clsx(
      variant === 'secondary' && `bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`
    );

    const cyan = clsx(
      variant === 'secondary' && `bg-cyan-100 text-cyan-700 hover:bg-cyan-200 focus:ring-cyan-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-cyan-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500`
    );

    const gray = clsx(
      variant === 'secondary' && `bg-gray-200 text-gray-600 hover:bg-gray-200 focus:ring-gray-200`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-gray-400 text-white hover:bg-gray-500 focus:ring-gray-400`
    );

    const green = clsx(
      variant === 'secondary' && `bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-green-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`
    );

    const indigo = clsx(
      variant === 'secondary' && `bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`
    );

    const lime = clsx(
      variant === 'secondary' && `bg-lime-100 text-lime-700 hover:bg-lime-200 focus:ring-lime-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-lime-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-lime-600 text-white hover:bg-lime-700 focus:ring-lime-500`
    );

    const orange = clsx(
      variant === 'secondary' && `bg-orange-100 text-orange-700 hover:bg-orange-200 focus:ring-orange-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500`
    );

    const pink = clsx(
      variant === 'secondary' && `bg-pink-100 text-pink-700 hover:bg-pink-200 focus:ring-pink-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-pink-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500`
    );

    const purple = clsx(
      variant === 'secondary' && `bg-purple-100 text-purple-700 hover:bg-purple-200 focus:ring-purple-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-purple-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500`
    );

    const red = clsx(
      variant === 'secondary' && `bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-red-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`
    );

    const teal = clsx(
      variant === 'secondary' && `bg-teal-100 text-teal-700 hover:bg-teal-200 focus:ring-teal-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-teal-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500`
    );

    const white = clsx(
      variant === 'secondary' && `border-gray-100 bg-white text-gray-700 hover:bg-gray-100 focus:ring-gray-100`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-teal-500`,
      variant !== 'secondary' && variant !== 'outline' && `border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:ring-gray-100`
    );

    const yellow = clsx(
      variant === 'secondary' && `bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-yellow-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-yellow-300 text-gray-700 hover:bg-yellow-400 focus:ring-yellow-300`
    );

    const black = clsx(
      variant === 'secondary' && `bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500`,
      variant === 'outline' && `border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-yellow-500`,
      variant !== 'secondary' && variant !== 'outline' && `bg-black text-white hover:bg-black focus:ring-gray-500`
    )

    const buttonColor = {
      amber,
      blue,
      cyan,
      gray,
      green,
      indigo,
      lime,
      orange,
      pink,
      purple,
      red,
      teal,
      white,
      yellow,
      black,
    };

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        style={{ backgroundColor }}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? () => null : onClick}
        // onMouseUp={(e) => (!disabled && ripple ? rippleAnimation.create(e, 'dark') : null)}
        className={clsx(
          disabled && `cursor-not-allowed opacity-50 focus:opacity-50 active:opacity-50 disabled:cursor-not-allowed disabled:outline-none disabled:ring-transparent`,
          color === 'none' ? '' : buttonColor[color],
          isSpecialtyVariant ? specialButtonSpacing : buttonSpacing,
          buttonTextSize,
          buttonBase,
          className
        )}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
