import { BadgeNivel } from './BadgeNivel';
import type { CalculoRiesgo } from '@/types';

interface MatrizRiesgoProps {
  amenazaValor?: number;
  vulnerabilidadValor?: number;
  className?: string;
}

const MATRIZ_5X5: { [key: string]: CalculoRiesgo['nivel'] } = {
  '1-1': 'Bajo', '1-2': 'Bajo', '1-3': 'Bajo', '1-4': 'Bajo', '1-5': 'Medio',
  '2-1': 'Bajo', '2-2': 'Bajo', '2-3': 'Bajo', '2-4': 'Medio', '2-5': 'Medio',
  '3-1': 'Bajo', '3-2': 'Bajo', '3-3': 'Medio', '3-4': 'Medio', '3-5': 'Alto',
  '4-1': 'Bajo', '4-2': 'Medio', '4-3': 'Medio', '4-4': 'Alto', '4-5': 'Alto',
  '5-1': 'Medio', '5-2': 'Medio', '5-3': 'Alto', '5-4': 'Alto', '5-5': 'Crítico',
};

const COLORES_MATRIZ: { [key in CalculoRiesgo['nivel']]: string } = {
  'Bajo': '#16a34a',
  'Medio': '#ca8a04',
  'Alto': '#f97316',
  'Crítico': '#dc2626',
};

export const MatrizRiesgo = ({ amenazaValor, vulnerabilidadValor, className = '' }: MatrizRiesgoProps) => {
  const obtenerNivel = (a: number, v: number): CalculoRiesgo['nivel'] => {
    const clave = `${a}-${v}`;
    return MATRIZ_5X5[clave] || 'Bajo';
  };

  const esCeldaActual = (a: number, v: number) => {
    return amenazaValor === a && vulnerabilidadValor === v;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-center">Matriz de Riesgos</h3>
      <div className="grid grid-cols-6 gap-1 text-xs">
        {/* Header de vulnerabilidades */}
        <div className="text-center font-medium text-gray-600">A\V</div>
        {[1, 2, 3, 4, 5].map((v) => (
          <div key={v} className="text-center font-medium text-gray-600">
            {v}
          </div>
        ))}

        {/* Filas de amenazas */}
        {[1, 2, 3, 4, 5].map((a) => (
          <div key={a} className="contents">
            <div className="text-center font-medium text-gray-600 flex items-center justify-center">
              {a}
            </div>
            {[1, 2, 3, 4, 5].map((v) => {
              const nivel = obtenerNivel(a, v);
              const esActual = esCeldaActual(a, v);

              return (
                <div
                  key={`${a}-${v}`}
                  className={`
                    p-1 rounded border-2 transition-all duration-200
                    ${esActual
                      ? 'border-black shadow-lg scale-110 z-10'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <BadgeNivel
                    nivel={nivel}
                    colorHex={COLORES_MATRIZ[nivel]}
                    className="w-full justify-center text-xs"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>A = Amenaza, V = Vulnerabilidad</p>
        {amenazaValor && vulnerabilidadValor && (
          <p className="mt-1">
            Posición actual: Amenaza {amenazaValor} × Vulnerabilidad {vulnerabilidadValor} = {amenazaValor * vulnerabilidadValor}
          </p>
        )}
      </div>
    </div>
  );
};
