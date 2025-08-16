import { Injectable } from '@nestjs/common';
import { MATRIZ_RIESGOS, MATRIZ_5X5 } from '../config/riesgo.config';
import { NivelRiesgo } from '../entities/riesgo.entity';

export interface ResultadoCalculo {
  puntaje: number;
  nivel: NivelRiesgo;
  colorHex: string;
}

@Injectable()
export class CalculoRiesgoService {
  /**
   * Calcula el riesgo basado en los valores de amenaza y vulnerabilidad
   * @param amenazaValor - Valor de la amenaza (1-5)
   * @param vulnerabilidadValor - Valor de la vulnerabilidad (1-5)
   * @returns Resultado del cálculo con puntaje, nivel y color
   */
  calcular(amenazaValor: number, vulnerabilidadValor: number): ResultadoCalculo {
    if (amenazaValor < 1 || amenazaValor > 5 || vulnerabilidadValor < 1 || vulnerabilidadValor > 5) {
      throw new Error('Los valores deben estar entre 1 y 5');
    }

    const puntaje = amenazaValor * vulnerabilidadValor;
    const nivel = this.determinarNivel(puntaje);
    const colorHex = this.obtenerColorHex(nivel);

    return {
      puntaje,
      nivel,
      colorHex,
    };
  }

  /**
   * Determina el nivel de riesgo basado en el puntaje
   * @param puntaje - Puntaje calculado
   * @returns Nivel de riesgo
   */
  private determinarNivel(puntaje: number): NivelRiesgo {
    const umbral = MATRIZ_RIESGOS.find(
      (u) => puntaje >= u.min && puntaje <= u.max,
    );

    if (!umbral) {
      throw new Error(`Puntaje ${puntaje} fuera del rango válido`);
    }

    return umbral.nivel;
  }

  /**
   * Obtiene el color hexadecimal para un nivel de riesgo
   * @param nivel - Nivel de riesgo
   * @returns Color hexadecimal
   */
  private obtenerColorHex(nivel: NivelRiesgo): string {
    const umbral = MATRIZ_RIESGOS.find((u) => u.nivel === nivel);
    return umbral ? umbral.colorHex : '#000000';
  }

  /**
   * Obtiene el nivel de riesgo para una combinación específica de amenaza y vulnerabilidad
   * @param amenazaValor - Valor de la amenaza (1-5)
   * @param vulnerabilidadValor - Valor de la vulnerabilidad (1-5)
   * @returns Nivel de riesgo
   */
  obtenerNivelMatriz(amenazaValor: number, vulnerabilidadValor: number): NivelRiesgo {
    const clave = `${amenazaValor}-${vulnerabilidadValor}`;
    const nivel = MATRIZ_5X5[clave];

    if (!nivel) {
      throw new Error(`Combinación inválida: ${clave}`);
    }

    return nivel;
  }

  /**
   * Valida que los valores estén en el rango correcto
   * @param valor - Valor a validar
   * @returns true si es válido
   */
  validarValor(valor: number): boolean {
    return Number.isInteger(valor) && valor >= 1 && valor <= 5;
  }
}
