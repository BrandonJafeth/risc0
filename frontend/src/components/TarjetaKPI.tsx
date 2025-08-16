import { BadgeNivel } from './BadgeNivel';
import type { EstadisticaNivel } from '@/types';

interface TarjetaKPIProps {
  estadistica: EstadisticaNivel;
  className?: string;
}

export const TarjetaKPI = ({ estadistica, className = '' }: TarjetaKPIProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total {estadistica.nivel}</p>
          <p className="text-3xl font-bold text-gray-900">{estadistica.total}</p>
        </div>
        <BadgeNivel
          nivel={estadistica.nivel as any}
          colorHex={estadistica.colorHex}
          className="text-sm"
        />
      </div>
    </div>
  );
};
