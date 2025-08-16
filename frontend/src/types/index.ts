export interface Amenaza {
  id: string;
  nombre: string;
  descripcion?: string;
  valor: number;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Vulnerabilidad {
  id: string;
  nombre: string;
  descripcion?: string;
  valor: number;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Riesgo {
  id: string;
  amenazaId: string;
  vulnerabilidadId: string;
  puntaje: number;
  nivel: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  colorHex: string;
  creadoEn: string;
  amenaza?: Amenaza;
  vulnerabilidad?: Vulnerabilidad;
}

export interface CrearAmenazaDto {
  nombre: string;
  descripcion?: string;
  valor: number;
  activo?: boolean;
}

export interface ActualizarAmenazaDto {
  nombre?: string;
  descripcion?: string;
  valor?: number;
  activo?: boolean;
}

export interface CrearVulnerabilidadDto {
  nombre: string;
  descripcion?: string;
  valor: number;
  activo?: boolean;
}

export interface ActualizarVulnerabilidadDto {
  nombre?: string;
  descripcion?: string;
  valor?: number;
  activo?: boolean;
}

export interface CrearRiesgoDto {
  amenazaId: string;
  vulnerabilidadId: string;
}

export interface FiltrosRiesgo {
  nivel?: string;
  min?: number;
  max?: number;
  desde?: string;
  hasta?: string;
  page?: number;
  limit?: number;
}

export interface ResultadoPaginado<T> {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface EstadisticaNivel {
  nivel: string;
  total: number;
  colorHex: string;
}

export interface CalculoRiesgo {
  puntaje: number;
  nivel: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  colorHex: string;
}
