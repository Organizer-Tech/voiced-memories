import clsx from 'clsx';
import { PuffLoader } from 'react-spinners';

interface TileSpinnerProps {
  isLoading?: boolean;
  className?: string;
}

export const TileSpinner = ({ isLoading = true, className, ...props }: TileSpinnerProps) => {
  return (
    <section className={clsx(className, 'm-4 flex h-1/2 w-full items-center justify-center')}>
      <PuffLoader color="#0064ff" loading={isLoading} size={150} {...props} />
    </section>
  );
};
