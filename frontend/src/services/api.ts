import { supabase } from '@/lib/supabaseClient';
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

// Funciones auxiliares para manejar conversiones de null a undefined
const mapAmenaza = (item: any): Amenaza => ({
  id: item.id,
  nombre: item.nombre,
  descripcion: item.descripcion || undefined,
  valor: item.valor,
  activo: item.activo ?? true,
  creadoEn: item.creado_en || new Date().toISOString(),
  actualizadoEn: item.actualizado_en || new Date().toISOString(),
});

const mapVulnerabilidad = (item: any): Vulnerabilidad => ({
  id: item.id,
  nombre: item.nombre,
  descripcion: item.descripcion || undefined,
  valor: item.valor,
  activo: item.activo ?? true,
  creadoEn: item.creado_en || new Date().toISOString(),
  actualizadoEn: item.actualizado_en || new Date().toISOString(),
});

// Función auxiliar para calcular el riesgo
const calcularRiesgo = (amenazaValor: number, vulnerabilidadValor: number) => {
  const puntaje = amenazaValor * vulnerabilidadValor;

  const MATRIZ_5X5: { [key: string]: 'Bajo' | 'Medio' | 'Alto' | 'Crítico' } = {
    '1-1': 'Bajo', '1-2': 'Bajo', '1-3': 'Bajo', '1-4': 'Bajo', '1-5': 'Medio',
    '2-1': 'Bajo', '2-2': 'Bajo', '2-3': 'Bajo', '2-4': 'Medio', '2-5': 'Medio',
    '3-1': 'Bajo', '3-2': 'Bajo', '3-3': 'Medio', '3-4': 'Medio', '3-5': 'Alto',
    '4-1': 'Bajo', '4-2': 'Medio', '4-3': 'Medio', '4-4': 'Alto', '4-5': 'Alto',
    '5-1': 'Medio', '5-2': 'Medio', '5-3': 'Alto', '5-4': 'Alto', '5-5': 'Crítico',
  };

  const COLORES: { [key: string]: string } = {
    'Bajo': '#16a34a',
    'Medio': '#ca8a04',
    'Alto': '#f97316',
    'Crítico': '#dc2626',
  };

  const clave = `${amenazaValor}-${vulnerabilidadValor}`;
  const nivel = MATRIZ_5X5[clave] || 'Bajo';
  const colorHex = COLORES[nivel];

  return { puntaje, nivel, colorHex };
};

// Servicios de Amenazas con Supabase
export const supabaseAmenazaService = {
  listar: async (activo?: boolean, q?: string): Promise<Amenaza[]> => {
    let query = supabase.from('amenazas').select('*').order('creado_en', { ascending: false });

    if (activo !== undefined) {
      query = query.eq('activo', activo);
    }

    if (q) {
      query = query.ilike('nombre', `%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al listar amenazas:', error);
      throw error;
    }

    return (data || []).map(mapAmenaza);
  },

  crear: async (data: CrearAmenazaDto): Promise<Amenaza> => {
    const { data: result, error } = await supabase
      .from('amenazas')
      .insert({
        nombre: data.nombre,
        descripcion: data.descripcion,
        valor: data.valor,
        activo: data.activo ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear amenaza:', error);
      throw error;
    }

    return mapAmenaza(result);
  },

  actualizar: async (id: string, data: ActualizarAmenazaDto): Promise<Amenaza> => {
    const { data: result, error } = await supabase
      .from('amenazas')
      .update({
        ...data,
        actualizado_en: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar amenaza:', error);
      throw error;
    }

    return mapAmenaza(result);
  },

  cambiarEstado: async (id: string, activo: boolean): Promise<Amenaza> => {
    return supabaseAmenazaService.actualizar(id, { activo });
  },

  obtenerPorId: async (id: string): Promise<Amenaza> => {
    const { data, error } = await supabase
      .from('amenazas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener amenaza:', error);
      throw error;
    }

    return mapAmenaza(data);
  },
};

// Servicios de Vulnerabilidades con Supabase
export const supabaseVulnerabilidadService = {
  listar: async (activo?: boolean, q?: string): Promise<Vulnerabilidad[]> => {
    let query = supabase.from('vulnerabilidades').select('*').order('creado_en', { ascending: false });

    if (activo !== undefined) {
      query = query.eq('activo', activo);
    }

    if (q) {
      query = query.ilike('nombre', `%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al listar vulnerabilidades:', error);
      throw error;
    }

    return (data || []).map(mapVulnerabilidad);
  },

  crear: async (data: CrearVulnerabilidadDto): Promise<Vulnerabilidad> => {
    const { data: result, error } = await supabase
      .from('vulnerabilidades')
      .insert({
        nombre: data.nombre,
        descripcion: data.descripcion,
        valor: data.valor,
        activo: data.activo ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear vulnerabilidad:', error);
      throw error;
    }

    return mapVulnerabilidad(result);
  },

  actualizar: async (id: string, data: ActualizarVulnerabilidadDto): Promise<Vulnerabilidad> => {
    const { data: result, error } = await supabase
      .from('vulnerabilidades')
      .update({
        ...data,
        actualizado_en: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar vulnerabilidad:', error);
      throw error;
    }

    return mapVulnerabilidad(result);
  },

  cambiarEstado: async (id: string, activo: boolean): Promise<Vulnerabilidad> => {
    return supabaseVulnerabilidadService.actualizar(id, { activo });
  },

  obtenerPorId: async (id: string): Promise<Vulnerabilidad> => {
    const { data, error } = await supabase
      .from('vulnerabilidades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener vulnerabilidad:', error);
      throw error;
    }

    return mapVulnerabilidad(data);
  },
};

// Servicios de Riesgos con Supabase
export const supabaseRiesgoService = {
  crear: async (data: CrearRiesgoDto): Promise<Riesgo> => {
    // Obtener amenaza y vulnerabilidad
    const [amenaza, vulnerabilidad] = await Promise.all([
      supabaseAmenazaService.obtenerPorId(data.amenazaId),
      supabaseVulnerabilidadService.obtenerPorId(data.vulnerabilidadId),
    ]);

    // Verificar que ambos estén activos
    if (!amenaza.activo) {
      throw new Error(`La amenaza "${amenaza.nombre}" está desactivada. Por favor, actívala antes de crear la evaluación.`);
    }

    if (!vulnerabilidad.activo) {
      throw new Error(`La vulnerabilidad "${vulnerabilidad.nombre}" está desactivada. Por favor, actívala antes de crear la evaluación.`);
    }

    // Calcular el riesgo
    const { puntaje, nivel, colorHex } = calcularRiesgo(amenaza.valor, vulnerabilidad.valor);

    // Insertar el riesgo
    const { data: result, error } = await supabase
      .from('riesgos')
      .insert({
        amenaza_id: data.amenazaId,
        vulnerabilidad_id: data.vulnerabilidadId,
        puntaje,
        nivel,
        color_hex: colorHex,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear riesgo:', error);
      throw error;
    }

    return {
      id: result.id,
      amenazaId: result.amenaza_id,
      vulnerabilidadId: result.vulnerabilidad_id,
      puntaje: result.puntaje,
      nivel: result.nivel as 'Bajo' | 'Medio' | 'Alto' | 'Crítico',
      colorHex: result.color_hex,
      creadoEn: result.creado_en || new Date().toISOString(),
      amenaza,
      vulnerabilidad,
    };
  },

  listar: async (filtros: FiltrosRiesgo): Promise<ResultadoPaginado<Riesgo>> => {
    const { nivel, min, max, desde, hasta, page = 1, limit = 10 } = filtros;

    let query = supabase
      .from('riesgos')
      .select('*, amenazas!riesgos_amenaza_id_fkey(*), vulnerabilidades!riesgos_vulnerabilidad_id_fkey(*)', { count: 'exact' });

    if (nivel) {
      query = query.eq('nivel', nivel);
    }

    if (min !== undefined) {
      query = query.gte('puntaje', min);
    }

    if (max !== undefined) {
      query = query.lte('puntaje', max);
    }

    if (desde) {
      query = query.gte('creado_en', new Date(desde).toISOString());
    }

    if (hasta) {
      const fechaHasta = new Date(hasta);
      fechaHasta.setHours(23, 59, 59, 999);
      query = query.lte('creado_en', fechaHasta.toISOString());
    }

    const offset = (page - 1) * limit;
    query = query.order('creado_en', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error('Error al listar riesgos:', error);
      throw error;
    }

    const total = count || 0;
    const totalPaginas = Math.ceil(total / limit);

    const datos: Riesgo[] = (data || []).map((item: any) => ({
      id: item.id,
      amenazaId: item.amenaza_id,
      vulnerabilidadId: item.vulnerabilidad_id,
      puntaje: item.puntaje,
      nivel: item.nivel as 'Bajo' | 'Medio' | 'Alto' | 'Crítico',
      colorHex: item.color_hex,
      creadoEn: item.creado_en || new Date().toISOString(),
      amenaza: item.amenazas ? mapAmenaza(item.amenazas) : undefined,
      vulnerabilidad: item.vulnerabilidades ? mapVulnerabilidad(item.vulnerabilidades) : undefined,
    }));

    return {
      datos,
      total,
      pagina: page,
      limite: limit,
      totalPaginas,
    };
  },

  obtenerUltimos: async (limite: number = 10): Promise<Riesgo[]> => {
    const { data, error } = await supabase
      .from('riesgos')
      .select('*, amenazas!riesgos_amenaza_id_fkey(*), vulnerabilidades!riesgos_vulnerabilidad_id_fkey(*)')
      .order('creado_en', { ascending: false })
      .limit(limite);

    if (error) {
      console.error('Error al obtener últimos riesgos:', error);
      throw error;
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      amenazaId: item.amenaza_id,
      vulnerabilidadId: item.vulnerabilidad_id,
      puntaje: item.puntaje,
      nivel: item.nivel as 'Bajo' | 'Medio' | 'Alto' | 'Crítico',
      colorHex: item.color_hex,
      creadoEn: item.creado_en || new Date().toISOString(),
      amenaza: item.amenazas ? mapAmenaza(item.amenazas) : undefined,
      vulnerabilidad: item.vulnerabilidades ? mapVulnerabilidad(item.vulnerabilidades) : undefined,
    }));
  },

  obtenerEstadisticas: async (): Promise<EstadisticaNivel[]> => {
    const { data, error } = await supabase
      .from('riesgos')
      .select('nivel, color_hex');

    if (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }

    const estadisticas = (data || []).reduce((acc: { [key: string]: { nivel: string; total: number; colorHex: string } }, item: any) => {
      const nivel = item.nivel;
      if (!acc[nivel]) {
        acc[nivel] = {
          nivel,
          total: 0,
          colorHex: item.color_hex,
        };
      }
      acc[nivel].total++;
      return acc;
    }, {});

    return Object.values(estadisticas);
  },

  obtenerPorId: async (id: string): Promise<Riesgo> => {
    const { data, error } = await supabase
      .from('riesgos')
      .select('*, amenazas!riesgos_amenaza_id_fkey(*), vulnerabilidades!riesgos_vulnerabilidad_id_fkey(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener riesgo:', error);
      throw error;
    }

    return {
      id: data.id,
      amenazaId: data.amenaza_id,
      vulnerabilidadId: data.vulnerabilidad_id,
      puntaje: data.puntaje,
      nivel: data.nivel as 'Bajo' | 'Medio' | 'Alto' | 'Crítico',
      colorHex: data.color_hex,
      creadoEn: data.creado_en || new Date().toISOString(),
      amenaza: data.amenazas ? mapAmenaza(data.amenazas) : undefined,
      vulnerabilidad: data.vulnerabilidades ? mapVulnerabilidad(data.vulnerabilidades) : undefined,
    };
  },
};

// Exportaciones compatibles con la API anterior
export const amenazaService = supabaseAmenazaService;
export const vulnerabilidadService = supabaseVulnerabilidadService;
export { supabaseRiesgoService as riesgoService };

export default supabase;
