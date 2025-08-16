import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAmenazas } from '@/hooks/useAmenazas';
import { useVulnerabilidades } from '@/hooks/useVulnerabilidades';

interface FormAmenazaData {
  nombre: string;
  descripcion: string;
  valor: number;
}

interface FormVulnerabilidadData {
  nombre: string;
  descripcion: string;
  valor: number;
}

export const Catalogos = () => {
  const [activeTab, setActiveTab] = useState<'amenazas' | 'vulnerabilidades'>('amenazas');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { amenazas, crearAmenaza, actualizarAmenaza, cambiarEstadoAmenaza } = useAmenazas();
  const { vulnerabilidades, crearVulnerabilidad, actualizarVulnerabilidad, cambiarEstadoVulnerabilidad } = useVulnerabilidades();

  const amenazaForm = useForm<FormAmenazaData>();
  const vulnerabilidadForm = useForm<FormVulnerabilidadData>();

  const handleAmenazaSubmit = async (data: FormAmenazaData) => {
    try {
      if (editingId) {
        await actualizarAmenaza(editingId, data);
        toast.success('Amenaza actualizada exitosamente');
      } else {
        await crearAmenaza(data);
        toast.success('Amenaza creada exitosamente');
      }
      setShowForm(false);
      setEditingId(null);
      amenazaForm.reset();
    } catch (error) {
      toast.error('Error al guardar amenaza');
    }
  };

  const handleVulnerabilidadSubmit = async (data: FormVulnerabilidadData) => {
    try {
      if (editingId) {
        await actualizarVulnerabilidad(editingId, data);
        toast.success('Vulnerabilidad actualizada exitosamente');
      } else {
        await crearVulnerabilidad(data);
        toast.success('Vulnerabilidad creada exitosamente');
      }
      setShowForm(false);
      setEditingId(null);
      vulnerabilidadForm.reset();
    } catch (error) {
      toast.error('Error al guardar vulnerabilidad');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setShowForm(true);
    if (activeTab === 'amenazas') {
      amenazaForm.reset({
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        valor: item.valor,
      });
    } else {
      vulnerabilidadForm.reset({
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        valor: item.valor,
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    amenazaForm.reset();
    vulnerabilidadForm.reset();
  };

  const handleToggleEstado = async (id: string, activo: boolean, tipo: 'amenaza' | 'vulnerabilidad') => {
    try {
      if (tipo === 'amenaza') {
        await cambiarEstadoAmenaza(id, !activo);
        toast.success(`Amenaza ${!activo ? 'activada' : 'desactivada'} exitosamente`);
      } else {
        await cambiarEstadoVulnerabilidad(id, !activo);
        toast.success(`Vulnerabilidad ${!activo ? 'activada' : 'desactivada'} exitosamente`);
      }
    } catch (error) {
      toast.error('Error al cambiar estado');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Catálogos</h1>
        <p className="text-gray-600 mt-2">Gestiona amenazas y vulnerabilidades del sistema</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('amenazas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'amenazas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Amenazas ({amenazas.length})
          </button>
          <button
            onClick={() => setActiveTab('vulnerabilidades')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vulnerabilidades'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vulnerabilidades ({vulnerabilidades.length})
          </button>
        </nav>
      </div>

      {/* Botón de agregar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {activeTab === 'amenazas' ? 'Amenazas' : 'Vulnerabilidades'}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Agregar {activeTab === 'amenazas' ? 'Amenaza' : 'Vulnerabilidad'}
        </button>
      </div>

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar' : 'Crear'} {activeTab === 'amenazas' ? 'Amenaza' : 'Vulnerabilidad'}
            </h3>

            {activeTab === 'amenazas' ? (
              <form onSubmit={amenazaForm.handleSubmit(handleAmenazaSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                  <input
                    type="text"
                    {...amenazaForm.register('nombre', { required: 'Nombre es requerido' })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {amenazaForm.formState.errors.nombre && (
                    <p className="text-red-600 text-sm">{amenazaForm.formState.errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    {...amenazaForm.register('descripcion')}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor (1-5) *</label>
                  <select
                    {...amenazaForm.register('valor', { required: 'Valor es requerido' })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecciona un valor</option>
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <option key={valor} value={valor}>
                        {valor}
                      </option>
                    ))}
                  </select>
                  {amenazaForm.formState.errors.valor && (
                    <p className="text-red-600 text-sm">{amenazaForm.formState.errors.valor.message}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    {editingId ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={vulnerabilidadForm.handleSubmit(handleVulnerabilidadSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                  <input
                    type="text"
                    {...vulnerabilidadForm.register('nombre', { required: 'Nombre es requerido' })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {vulnerabilidadForm.formState.errors.nombre && (
                    <p className="text-red-600 text-sm">{vulnerabilidadForm.formState.errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    {...vulnerabilidadForm.register('descripcion')}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor (1-5) *</label>
                  <select
                    {...vulnerabilidadForm.register('valor', { required: 'Valor es requerido' })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecciona un valor</option>
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <option key={valor} value={valor}>
                        {valor}
                      </option>
                    ))}
                  </select>
                  {vulnerabilidadForm.formState.errors.valor && (
                    <p className="text-red-600 text-sm">{vulnerabilidadForm.formState.errors.valor.message}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    {editingId ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(activeTab === 'amenazas' ? amenazas : vulnerabilidades).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.descripcion || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.valor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleEstado(item.id, item.activo, activeTab as 'amenaza' | 'vulnerabilidad')}
                      className={`${
                        item.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {item.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(activeTab === 'amenazas' ? amenazas : vulnerabilidades).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay {activeTab === 'amenazas' ? 'amenazas' : 'vulnerabilidades'} registradas
          </div>
        )}
      </div>
    </div>
  );
};
