import { useState, useEffect } from 'react';
import { amenazaService } from '@/services/api';
import type { Amenaza, CrearAmenazaDto, ActualizarAmenazaDto } from '@/types';

export const useAmenazas = (activo?: boolean, q?: string) => {
  const [amenazas, setAmenazas] = useState<Amenaza[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarAmenazas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await amenazaService.listar(activo, q);
      setAmenazas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar amenazas');
    } finally {
      setIsLoading(false);
    }
  };

  const crearAmenaza = async (data: CrearAmenazaDto): Promise<Amenaza> => {
    try {
      const nuevaAmenaza = await amenazaService.crear(data);
      setAmenazas(prev => [...prev, nuevaAmenaza]);
      return nuevaAmenaza;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al crear amenaza');
    }
  };

  const actualizarAmenaza = async (id: string, data: ActualizarAmenazaDto): Promise<Amenaza> => {
    try {
      const amenazaActualizada = await amenazaService.actualizar(id, data);
      setAmenazas(prev => prev.map(amenaza =>
        amenaza.id === id ? amenazaActualizada : amenaza
      ));
      return amenazaActualizada;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al actualizar amenaza');
    }
  };

  const cambiarEstadoAmenaza = async (id: string, activo: boolean): Promise<Amenaza> => {
    try {
      const amenazaActualizada = await amenazaService.cambiarEstado(id, activo);
      setAmenazas(prev => prev.map(amenaza =>
        amenaza.id === id ? amenazaActualizada : amenaza
      ));
      return amenazaActualizada;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al cambiar estado de amenaza');
    }
  };

  useEffect(() => {
    cargarAmenazas();
  }, [activo, q]);

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
