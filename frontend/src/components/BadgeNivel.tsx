import type { CalculoRiesgo } from '@/types';

interface BadgeNivelProps {
  nivel: CalculoRiesgo['nivel'];
  colorHex?: string;
  className?: string;
}

export const BadgeNivel = ({ nivel, colorHex, className = '' }: BadgeNivelProps) => {
  const getColorClasses = () => {
    if (colorHex) {
      return '';
    }

    switch (nivel) {
      case 'Bajo':
        return 'bg-riesgo-bajo text-white';
      case 'Medio':
        return 'bg-riesgo-medio text-white';
      case 'Alto':
        return 'bg-riesgo-alto text-white';
      case 'Crítico':
        return 'bg-riesgo-critico text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const style = colorHex ? { backgroundColor: colorHex } : {};

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses()} ${className}`}
      style={style}
    >
      {nivel}
    </span>
  );
};
