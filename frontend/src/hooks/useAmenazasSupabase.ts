import { useState, useCallback } from 'react';
import { supabaseAmenazaService } from '@/services/api';
import type { Amenaza, CrearAmenazaDto, ActualizarAmenazaDto } from '@/types';

/**
 * Hook personalizado para gestionar amenazas usando Supabase
 *
 * Ejemplo de uso:
 * ```tsx
 * const { amenazas, isLoading, cargarAmenazas, crearAmenaza } = useAmenazasSupabase();
 *
 * useEffect(() => {
 *   cargarAmenazas(true); // Cargar solo amenazas activas
 * }, []);
 * ```
 */
export const useAmenazasSupabase = () => {
  const [amenazas, setAmenazas] = useState<Amenaza[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarAmenazas = useCallback(async (activo?: boolean, busqueda?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await supabaseAmenazaService.listar(activo, busqueda);
      setAmenazas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar amenazas');
      console.error('Error en cargarAmenazas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearAmenaza = useCallback(async (data: CrearAmenazaDto): Promise<Amenaza> => {
    try {
      const nuevaAmenaza = await supabaseAmenazaService.crear(data);
      setAmenazas(prev => [nuevaAmenaza, ...prev]);
      return nuevaAmenaza;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al crear amenaza');
    }
  }, []);

  const actualizarAmenaza = useCallback(async (id: string, data: ActualizarAmenazaDto): Promise<Amenaza> => {
    try {
      const amenazaActualizada = await supabaseAmenazaService.actualizar(id, data);
      setAmenazas(prev => prev.map(a => a.id === id ? amenazaActualizada : a));
      return amenazaActualizada;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al actualizar amenaza');
    }
  }, []);

  const cambiarEstadoAmenaza = useCallback(async (id: string, activo: boolean): Promise<Amenaza> => {
    try {
      const amenazaActualizada = await supabaseAmenazaService.cambiarEstado(id, activo);
      setAmenazas(prev => prev.map(a => a.id === id ? amenazaActualizada : a));
      return amenazaActualizada;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al cambiar estado');
    }
  }, []);

  return {
    amenazas,
    isLoading,
    error,
    cargarAmenazas,
    crearAmenaza,
    actualizarAmenaza,
    cambiarEstadoAmenaza,
  };
};
