import { NivelRiesgo } from '../entities/riesgo.entity';

export interface UmbralRiesgo {
  min: number;
  max: number;
  nivel: NivelRiesgo;
  colorHex: string;
}

export const MATRIZ_RIESGOS: UmbralRiesgo[] = [
  {
    min: 1,
    max: 4,
    nivel: NivelRiesgo.BAJO,
    colorHex: '#16a34a',
  },
  {
    min: 5,
    max: 9,
    nivel: NivelRiesgo.MEDIO,
    colorHex: '#ca8a04',
  },
  {
    min: 10,
    max: 15,
    nivel: NivelRiesgo.ALTO,
    colorHex: '#f97316',
  },
  {
    min: 16,
    max: 25,
    nivel: NivelRiesgo.CRITICO,
    colorHex: '#dc2626',
  },
];

export const MATRIZ_5X5: { [key: string]: NivelRiesgo } = {
  '1-1': NivelRiesgo.BAJO,
  '1-2': NivelRiesgo.BAJO,
  '1-3': NivelRiesgo.BAJO,
  '1-4': NivelRiesgo.BAJO,
  '1-5': NivelRiesgo.MEDIO,
  '2-1': NivelRiesgo.BAJO,
  '2-2': NivelRiesgo.BAJO,
  '2-3': NivelRiesgo.BAJO,
  '2-4': NivelRiesgo.MEDIO,
  '2-5': NivelRiesgo.MEDIO,
  '3-1': NivelRiesgo.BAJO,
  '3-2': NivelRiesgo.BAJO,
  '3-3': NivelRiesgo.MEDIO,
  '3-4': NivelRiesgo.MEDIO,
  '3-5': NivelRiesgo.ALTO,
  '4-1': NivelRiesgo.BAJO,
  '4-2': NivelRiesgo.MEDIO,
  '4-3': NivelRiesgo.MEDIO,
  '4-4': NivelRiesgo.ALTO,
  '4-5': NivelRiesgo.ALTO,
  '5-1': NivelRiesgo.MEDIO,
  '5-2': NivelRiesgo.MEDIO,
  '5-3': NivelRiesgo.ALTO,
  '5-4': NivelRiesgo.ALTO,
  '5-5': NivelRiesgo.CRITICO,
};
