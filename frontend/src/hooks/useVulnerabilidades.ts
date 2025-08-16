import { useState, useEffect } from 'react';
import { vulnerabilidadService } from '@/services/api';
import type { Vulnerabilidad, CrearVulnerabilidadDto, ActualizarVulnerabilidadDto } from '@/types';

export const useVulnerabilidades = (activo?: boolean, q?: string) => {
  const [vulnerabilidades, setVulnerabilidades] = useState<Vulnerabilidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarVulnerabilidades = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vulnerabilidadService.listar(activo, q);
      setVulnerabilidades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vulnerabilidades');
    } finally {
      setIsLoading(false);
    }
  };

  const crearVulnerabilidad = async (data: CrearVulnerabilidadDto): Promise<Vulnerabilidad> => {
    try {
      const nuevaVulnerabilidad = await vulnerabilidadService.crear(data);
      setVulnerabilidades(prev => [...prev, nuevaVulnerabilidad]);
      return nuevaVulnerabilidad;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al crear vulnerabilidad');
    }
  };

  const actualizarVulnerabilidad = async (id: string, data: ActualizarVulnerabilidadDto): Promise<Vulnerabilidad> => {
    try {
      const vulnerabilidadActualizada = await vulnerabilidadService.actualizar(id, data);
      setVulnerabilidades(prev => prev.map(vulnerabilidad =>
        vulnerabilidad.id === id ? vulnerabilidadActualizada : vulnerabilidad
      ));
      return vulnerabilidadActualizada;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al actualizar vulnerabilidad');
    }
  };

  const cambiarEstadoVulnerabilidad = async (id: string, activo: boolean): Promise<Vulnerabilidad> => {
    try {
      const vulnerabilidadActualizada = await vulnerabilidadService.cambiarEstado(id, activo);
      setVulnerabilidades(prev => prev.map(vulnerabilidad =>
        vulnerabilidad.id === id ? vulnerabilidadActualizada : vulnerabilidad
      ));
      return vulnerabilidadActualizada;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al cambiar estado de vulnerabilidad');
    }
  };

  useEffect(() => {
    cargarVulnerabilidades();
  }, [activo, q]);

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
