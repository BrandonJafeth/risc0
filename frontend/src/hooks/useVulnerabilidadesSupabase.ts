import { useState, useCallback } from 'react';
import { supabaseVulnerabilidadService } from '@/services/supabase';
import type { Vulnerabilidad, CrearVulnerabilidadDto, ActualizarVulnerabilidadDto } from '@/types';

/**
 * Hook personalizado para gestionar vulnerabilidades usando Supabase
 *
 * Ejemplo de uso:
 * ```tsx
 * const { vulnerabilidades, isLoading, cargarVulnerabilidades } = useVulnerabilidadesSupabase();
 *
 * useEffect(() => {
 *   cargarVulnerabilidades(true); // Cargar solo vulnerabilidades activas
 * }, []);
 * ```
 */
export const useVulnerabilidadesSupabase = () => {
  const [vulnerabilidades, setVulnerabilidades] = useState<Vulnerabilidad[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarVulnerabilidades = useCallback(async (activo?: boolean, busqueda?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await supabaseVulnerabilidadService.listar(activo, busqueda);
      setVulnerabilidades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vulnerabilidades');
      console.error('Error en cargarVulnerabilidades:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearVulnerabilidad = useCallback(async (data: CrearVulnerabilidadDto): Promise<Vulnerabilidad> => {
    try {
      const nuevaVulnerabilidad = await supabaseVulnerabilidadService.crear(data);
      setVulnerabilidades(prev => [nuevaVulnerabilidad, ...prev]);
      return nuevaVulnerabilidad;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al crear vulnerabilidad');
    }
  }, []);

  const actualizarVulnerabilidad = useCallback(async (id: string, data: ActualizarVulnerabilidadDto): Promise<Vulnerabilidad> => {
    try {
      const vulnerabilidadActualizada = await supabaseVulnerabilidadService.actualizar(id, data);
      setVulnerabilidades(prev => prev.map(v => v.id === id ? vulnerabilidadActualizada : v));
      return vulnerabilidadActualizada;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al actualizar vulnerabilidad');
    }
  }, []);

  const cambiarEstadoVulnerabilidad = useCallback(async (id: string, activo: boolean): Promise<Vulnerabilidad> => {
    try {
      const vulnerabilidadActualizada = await supabaseVulnerabilidadService.cambiarEstado(id, activo);
      setVulnerabilidades(prev => prev.map(v => v.id === id ? vulnerabilidadActualizada : v));
      return vulnerabilidadActualizada;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al cambiar estado');
    }
  }, []);

  return {
    vulnerabilidades,
    isLoading,
    error,
    cargarVulnerabilidades,
    crearVulnerabilidad,
    actualizarVulnerabilidad,
    cambiarEstadoVulnerabilidad,
  };
};
