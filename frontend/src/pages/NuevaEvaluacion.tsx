import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BadgeNivel } from '@/components/BadgeNivel';
import { MatrizRiesgo } from '@/components/MatrizRiesgo';
import { useAmenazas } from '@/hooks/useAmenazas';
import { useVulnerabilidades } from '@/hooks/useVulnerabilidades';
import { useRiesgos } from '@/hooks/useRiesgos';
import type { CalculoRiesgo } from '@/types';

interface FormData {
  amenazaId: string;
  vulnerabilidadId: string;
}

export const NuevaEvaluacion = () => {
  const [calculoActual, setCalculoActual] = useState<CalculoRiesgo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { amenazas, isLoading: isLoadingAmenazas } = useAmenazas(true);
  const { vulnerabilidades, isLoading: isLoadingVulnerabilidades } = useVulnerabilidades(true);
  const { crearRiesgo } = useRiesgos();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const amenazaId = watch('amenazaId');
  const vulnerabilidadId = watch('vulnerabilidadId');

  // Calcular riesgo en vivo
  useEffect(() => {
    if (amenazaId && vulnerabilidadId) {
      const amenaza = amenazas.find(a => a.id === amenazaId);
      const vulnerabilidad = vulnerabilidades.find(v => v.id === vulnerabilidadId);

      if (amenaza && vulnerabilidad) {
        const puntaje = amenaza.valor * vulnerabilidad.valor;
        let nivel: CalculoRiesgo['nivel'] = 'Bajo';
        let colorHex = '#16a34a';

        if (puntaje >= 16) {
          nivel = 'Crítico';
          colorHex = '#dc2626';
        } else if (puntaje >= 10) {
          nivel = 'Alto';
          colorHex = '#f97316';
        } else if (puntaje >= 5) {
          nivel = 'Medio';
          colorHex = '#ca8a04';
        }

        setCalculoActual({
          puntaje,
          nivel,
          colorHex,
        });
      }
    } else {
      setCalculoActual(null);
    }
  }, [amenazaId, vulnerabilidadId, amenazas, vulnerabilidades]);

  const onSubmit = async (data: FormData) => {
    if (!calculoActual) {
      toast.error('Por favor selecciona una amenaza y vulnerabilidad');
      return;
    }

    setIsSubmitting(true);
    try {
      await crearRiesgo(data);
      toast.success('Evaluación de riesgo guardada exitosamente');
      // Reset form
      window.location.reload();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la evaluación';
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const amenazaSeleccionada = amenazas.find(a => a.id === amenazaId);
  const vulnerabilidadSeleccionada = vulnerabilidades.find(v => v.id === vulnerabilidadId);

  if (isLoadingAmenazas || isLoadingVulnerabilidades) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Evaluación de Riesgo</h1>
        <p className="text-gray-600 mt-2">
          Selecciona una amenaza y vulnerabilidad para calcular el nivel de riesgo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Evaluación</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Selección de Amenaza */}
            <div>
              <label htmlFor="amenazaId" className="block text-sm font-medium text-gray-700 mb-2">
                Amenaza *
              </label>
              <select
                id="amenazaId"
                {...register('amenazaId', { required: 'Selecciona una amenaza' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una amenaza</option>
                {amenazas.map((amenaza) => (
                  <option key={amenaza.id} value={amenaza.id}>
                    {amenaza.nombre} (Valor: {amenaza.valor})
                  </option>
                ))}
              </select>
              {errors.amenazaId && (
                <p className="mt-1 text-sm text-red-600">{errors.amenazaId.message}</p>
              )}
            </div>

            {/* Selección de Vulnerabilidad */}
            <div>
              <label htmlFor="vulnerabilidadId" className="block text-sm font-medium text-gray-700 mb-2">
                Vulnerabilidad *
              </label>
              <select
                id="vulnerabilidadId"
                {...register('vulnerabilidadId', { required: 'Selecciona una vulnerabilidad' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una vulnerabilidad</option>
                {vulnerabilidades.map((vulnerabilidad) => (
                  <option key={vulnerabilidad.id} value={vulnerabilidad.id}>
                    {vulnerabilidad.nombre} (Valor: {vulnerabilidad.valor})
                  </option>
                ))}
              </select>
              {errors.vulnerabilidadId && (
                <p className="mt-1 text-sm text-red-600">{errors.vulnerabilidadId.message}</p>
              )}
            </div>

            {/* Resultado del cálculo */}
            {calculoActual && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Resultado del Cálculo</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Puntaje</p>
                    <p className="text-2xl font-bold text-gray-900">{calculoActual.puntaje}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nivel de Riesgo</p>
                    <BadgeNivel
                      nivel={calculoActual.nivel}
                      colorHex={calculoActual.colorHex}
                      className="mt-1"
                    />
                  </div>
                </div>

                {amenazaSeleccionada && vulnerabilidadSeleccionada && (
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Fórmula:</strong> {amenazaSeleccionada.valor} × {vulnerabilidadSeleccionada.valor} = {calculoActual.puntaje}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Botón de guardar */}
            <button
              type="submit"
              disabled={!calculoActual || isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Evaluación'}
            </button>
          </form>
        </div>

        {/* Matriz de Riesgos */}
        <div>
          <MatrizRiesgo
            amenazaValor={amenazaSeleccionada?.valor}
            vulnerabilidadValor={vulnerabilidadSeleccionada?.valor}
          />
        </div>
      </div>
    </div>
  );
};
