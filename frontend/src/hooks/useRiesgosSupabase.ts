import { useState, useEffect, useCallback } from 'react';
import { supabaseRiesgoService } from '@/services/supabase';
import type { Riesgo, CrearRiesgoDto, FiltrosRiesgo, ResultadoPaginado, EstadisticaNivel } from '@/types';

/**
 * Hook personalizado para gestionar riesgos usando Supabase
 *
 * Ejemplo de uso:
 * ```tsx
 * const { riesgos, isLoading, crearRiesgo } = useRiesgosSupabase();
 * ```
 */
export const useRiesgosSupabase = (filtros: FiltrosRiesgo = {}) => {
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
      const resultado = await supabaseRiesgoService.listar(filtros);
      setRiesgos(resultado.datos);
      setPaginacion({
        total: resultado.total,
        pagina: resultado.pagina,
        limite: resultado.limite,
        totalPaginas: resultado.totalPaginas,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar riesgos');
      console.error('Error en cargarRiesgos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filtros]);

  const cargarEstadisticas = useCallback(async () => {
    try {
      const data = await supabaseRiesgoService.obtenerEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  }, []);

  const cargarUltimosRiesgos = useCallback(async (limite: number = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await supabaseRiesgoService.obtenerUltimos(limite);
      setRiesgos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar últimos riesgos');
      console.error('Error en cargarUltimosRiesgos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearRiesgo = useCallback(async (data: CrearRiesgoDto): Promise<Riesgo> => {
    try {
      const nuevoRiesgo = await supabaseRiesgoService.crear(data);
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
  }, [filtros, cargarRiesgos]);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

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
