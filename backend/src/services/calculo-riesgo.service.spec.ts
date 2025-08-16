import { Test, TestingModule } from '@nestjs/testing';
import { CalculoRiesgoService } from './calculo-riesgo.service';
import { NivelRiesgo } from '../entities/riesgo.entity';

describe('CalculoRiesgoService', () => {
  let service: CalculoRiesgoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculoRiesgoService],
    }).compile();

    service = module.get<CalculoRiesgoService>(CalculoRiesgoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calcular', () => {
    it('should calculate low risk correctly (1-4 range)', () => {
      const resultado = service.calcular(1, 2);
      expect(resultado.puntaje).toBe(2);
      expect(resultado.nivel).toBe(NivelRiesgo.BAJO);
      expect(resultado.colorHex).toBe('#16a34a');
    });

    it('should calculate medium risk correctly (5-9 range)', () => {
      const resultado = service.calcular(2, 3);
      expect(resultado.puntaje).toBe(6);
      expect(resultado.nivel).toBe(NivelRiesgo.MEDIO);
      expect(resultado.colorHex).toBe('#ca8a04');
    });

    it('should calculate high risk correctly (10-15 range)', () => {
      const resultado = service.calcular(3, 4);
      expect(resultado.puntaje).toBe(12);
      expect(resultado.nivel).toBe(NivelRiesgo.ALTO);
      expect(resultado.colorHex).toBe('#f97316');
    });

    it('should calculate critical risk correctly (16-25 range)', () => {
      const resultado = service.calcular(5, 5);
      expect(resultado.puntaje).toBe(25);
      expect(resultado.nivel).toBe(NivelRiesgo.CRITICO);
      expect(resultado.colorHex).toBe('#dc2626');
    });

    it('should throw error for invalid amenaza value', () => {
      expect(() => service.calcular(0, 3)).toThrow('Los valores deben estar entre 1 y 5');
      expect(() => service.calcular(6, 3)).toThrow('Los valores deben estar entre 1 y 5');
    });

    it('should throw error for invalid vulnerabilidad value', () => {
      expect(() => service.calcular(3, 0)).toThrow('Los valores deben estar entre 1 y 5');
      expect(() => service.calcular(3, 6)).toThrow('Los valores deben estar entre 1 y 5');
    });
  });

  describe('obtenerNivelMatriz', () => {
    it('should return correct level for matrix position', () => {
      expect(service.obtenerNivelMatriz(1, 1)).toBe(NivelRiesgo.BAJO);
      expect(service.obtenerNivelMatriz(3, 3)).toBe(NivelRiesgo.MEDIO);
      expect(service.obtenerNivelMatriz(5, 5)).toBe(NivelRiesgo.CRITICO);
    });

    it('should throw error for invalid matrix position', () => {
      expect(() => service.obtenerNivelMatriz(0, 1)).toThrow('Combinación inválida: 0-1');
      expect(() => service.obtenerNivelMatriz(1, 6)).toThrow('Combinación inválida: 1-6');
    });
  });

  describe('validarValor', () => {
    it('should return true for valid values', () => {
      expect(service.validarValor(1)).toBe(true);
      expect(service.validarValor(3)).toBe(true);
      expect(service.validarValor(5)).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(service.validarValor(0)).toBe(false);
      expect(service.validarValor(6)).toBe(false);
      expect(service.validarValor(1.5)).toBe(false);
      expect(service.validarValor(-1)).toBe(false);
    });
  });
});
