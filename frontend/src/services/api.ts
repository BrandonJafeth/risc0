import axios from 'axios';
import type {
  Amenaza,
  Vulnerabilidad,
  Riesgo,
  CrearAmenazaDto,
  ActualizarAmenazaDto,
  CrearVulnerabilidadDto,
  ActualizarVulnerabilidadDto,
  CrearRiesgoDto,
  FiltrosRiesgo,
  ResultadoPaginado,
  EstadisticaNivel,
} from '@/types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://risc0.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de API: No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
    } else {
      console.error('Error de API:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Servicios de Amenazas
export const amenazaService = {
  listar: async (activo?: boolean, q?: string): Promise<Amenaza[]> => {
    const params = new URLSearchParams();
    if (activo !== undefined) params.append('activo', activo.toString());
    if (q) params.append('q', q);

    const response = await api.get(`/amenazas?${params.toString()}`);
    return response.data;
  },

  crear: async (data: CrearAmenazaDto): Promise<Amenaza> => {
    const response = await api.post('/amenazas', data);
    return response.data;
  },

  actualizar: async (id: string, data: ActualizarAmenazaDto): Promise<Amenaza> => {
    const response = await api.patch(`/amenazas/${id}`, data);
    return response.data;
  },

  cambiarEstado: async (id: string, activo: boolean): Promise<Amenaza> => {
    const response = await api.patch(`/amenazas/${id}/estado`, { activo });
    return response.data;
  },

  obtenerPorId: async (id: string): Promise<Amenaza> => {
    const response = await api.get(`/amenazas/${id}`);
    return response.data;
  },
};

// Servicios de Vulnerabilidades
export const vulnerabilidadService = {
  listar: async (activo?: boolean, q?: string): Promise<Vulnerabilidad[]> => {
    const params = new URLSearchParams();
    if (activo !== undefined) params.append('activo', activo.toString());
    if (q) params.append('q', q);

    const response = await api.get(`/vulnerabilidades?${params.toString()}`);
    return response.data;
  },

  crear: async (data: CrearVulnerabilidadDto): Promise<Vulnerabilidad> => {
    const response = await api.post('/vulnerabilidades', data);
    return response.data;
  },

  actualizar: async (id: string, data: ActualizarVulnerabilidadDto): Promise<Vulnerabilidad> => {
    const response = await api.patch(`/vulnerabilidades/${id}`, data);
    return response.data;
  },

  cambiarEstado: async (id: string, activo: boolean): Promise<Vulnerabilidad> => {
    const response = await api.patch(`/vulnerabilidades/${id}/estado`, { activo });
    return response.data;
  },

  obtenerPorId: async (id: string): Promise<Vulnerabilidad> => {
    const response = await api.get(`/vulnerabilidades/${id}`);
    return response.data;
  },
};

// Servicios de Riesgos
export const riesgoService = {
  crear: async (data: CrearRiesgoDto): Promise<Riesgo> => {
    const response = await api.post('/riesgos', data);
    return response.data;
  },

  listar: async (filtros: FiltrosRiesgo): Promise<ResultadoPaginado<Riesgo>> => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/riesgos?${params.toString()}`);
    return response.data;
  },

  obtenerUltimos: async (limite: number = 10): Promise<Riesgo[]> => {
    const response = await api.get(`/riesgos/ultimos?limite=${limite}`);
    return response.data;
  },

  obtenerEstadisticas: async (): Promise<EstadisticaNivel[]> => {
    const response = await api.get('/riesgos/estadisticas');
    return response.data;
  },

  obtenerPorId: async (id: string): Promise<Riesgo> => {
    const response = await api.get(`/riesgos/${id}`);
    return response.data;
  },
};

export default api;
