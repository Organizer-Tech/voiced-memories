import React from 'react';
import clsx from 'clsx';
import { CheckCircleIcon, XMarkIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';

// Defines the types for the variants of this component
type variants = 'error' | 'success' | 'warning';

export interface AlertProps {
  /**
   * Label for the alert (is bolded)
   */
  label: string;
  /**
   * Content of Alert message
   */
  content: string;
  /**
   * For setting override styles
   */
  className?: string;
  /**
   * variants for alert set in type variants
   */
  variant?: variants;
  /**
   * Function to run when alert is closed
   */
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ label, content, className, variant = 'error', onClose }) => {
  const base = clsx(
    'flex',
    'items-center',
    'rounded-md',
    'p-4',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2'
  );

  const alertVariant = clsx(
    variant === 'warning' && 'bg-yellow-50 text-yellow-700 focus:ring-yellow-500',
    variant === 'success' && 'bg-green-50 text-green-700 focus:ring-green-500',
    variant === 'error' && 'bg-red-50 text-red-700 focus:ring-red-500'
  );

  return (
    <div className={clsx(base, alertVariant, className)} role="alert">
      {variant === 'success' ? (
        <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
      ) : variant === 'warning' ? (
        <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <XCircleIcon className="h-5 w-5" aria-hidden="true" />
      )}
      <span className="ml-2">
        <strong>{label}: </strong> {content}
      </span>
      {onClose && (
        <div className="ml-auto inline-flex pl-3">
          <button onClick={onClose}>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';
