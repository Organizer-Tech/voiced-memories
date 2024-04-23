import { ReactNode, useRef, useState, forwardRef } from 'react';
import clsx from 'clsx';
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import { ArrowDownOnSquareIcon } from '@heroicons/react/20/solid';

interface TooltipProps {
  label: string | ReactNode;
  children: ReactNode;
  dismissOnPress?: boolean;
  shouldOpen?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Tooltip = forwardRef(
  ({ label, children, dismissOnPress, shouldOpen = true, className, disabled, ...props }: TooltipProps, ref: any) => {
    const arrowRef = useRef(null);
    const [open, setOpen] = useState(false);

    const { x, y, strategy, context, placement, refs } = useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset(), flip(), shift(), arrow({ element: arrowRef })],
      whileElementsMounted: autoUpdate,
    });

    const { styles } = useTransitionStyles(context);

    const focus = useFocus(context);
    const hover = useHover(context, { move: false, delay: { open: 80, close: 400 } });
    const role = useRole(context, { role: 'tooltip' });
    const dismiss = useDismiss(context, {
      referencePress: dismissOnPress,
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

    if (!shouldOpen || disabled) return <>{children}</>;

    return (
      <section ref={ref}>
        <div ref={refs.setReference} {...getReferenceProps()}>
          {children}
        </div>

        {open && (
          <article
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
              ...styles,
            }}
            className={clsx(className, 'z-30')}
          >
            <ArrowDownOnSquareIcon 
              className={clsx(
                'relative left-[48%] top-2.5 w-2.5 rounded-lg fill-gray-300 shadow-xl ',
                placement === 'bottom' ? '' : 'hidden'
              )}
              ref={arrowRef}
            />
            <div
              className={clsx(
                'rounded-lg border bg-gray-100 p-3 text-sm font-medium normal-case text-gray-900 shadow-xl'
              )}
              {...props}
              {...getFloatingProps()}
            >
              {label}
            </div>

            <ArrowDownOnSquareIcon 
              ref={arrowRef}
              className={clsx(
                'relative bottom-2.5 left-[48%] w-2.5 rotate-180 rounded-lg fill-white',
                placement === 'top' ? '' : 'hidden'
              )}
            />
          </article>
        )}
      </section>
    );
  }
);

Tooltip.displayName = 'Tooltip';
