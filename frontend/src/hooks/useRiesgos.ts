import { useState, useEffect, useCallback } from 'react';
import { riesgoService } from '@/services/api';
import type { Riesgo, CrearRiesgoDto, FiltrosRiesgo, ResultadoPaginado, EstadisticaNivel } from '@/types';

export const useRiesgos = (filtros: FiltrosRiesgo = {}) => {
  const [riesgos, setRiesgos] = useState<Riesgo[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticaNivel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginacion, setPaginacion] = useState<Omit<ResultadoPaginado<Riesgo>, 'datos'>>({
    total: 0,
    pagina: 1,
    limite: 10,
    totalPaginas: 0,
  });

  const cargarRiesgos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const resultado = await riesgoService.listar(filtros);
      setRiesgos(resultado.datos);
      setPaginacion({
        total: resultado.total,
        pagina: resultado.pagina,
        limite: resultado.limite,
        totalPaginas: resultado.totalPaginas,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar riesgos');
    } finally {
      setIsLoading(false);
    }
  }, [filtros]);

  const cargarEstadisticas = useCallback(async () => {
    try {
      const data = await riesgoService.obtenerEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  }, []);

  const cargarUltimosRiesgos = useCallback(async (limite: number = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await riesgoService.obtenerUltimos(limite);
      setRiesgos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar últimos riesgos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearRiesgo = useCallback(async (data: CrearRiesgoDto): Promise<Riesgo> => {
    try {
      const nuevoRiesgo = await riesgoService.crear(data);
      setRiesgos(prev => [nuevoRiesgo, ...prev]);
      await cargarEstadisticas(); // Recargar estadísticas
      return nuevoRiesgo;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al crear riesgo');
    }
  }, [cargarEstadisticas]);

  useEffect(() => {
    if (Object.keys(filtros).length > 0) {
      cargarRiesgos();
    }
  }, [filtros]);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  return {
    riesgos,
    estadisticas,
    isLoading,
    error,
    paginacion,
    cargarRiesgos,
    cargarEstadisticas,
    cargarUltimosRiesgos,
    crearRiesgo,
  };
};
