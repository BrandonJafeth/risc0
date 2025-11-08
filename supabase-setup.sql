-- ============================================
-- Script de Configuración de Base de Datos
-- Matriz de Riesgos - Supabase
-- ============================================

-- 1. CREAR TABLA DE AMENAZAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.amenazas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  valor INTEGER NOT NULL CHECK (valor >= 1 AND valor <= 5),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para amenazas
CREATE INDEX IF NOT EXISTS idx_amenazas_activo ON public.amenazas(activo);
CREATE INDEX IF NOT EXISTS idx_amenazas_valor ON public.amenazas(valor);
CREATE INDEX IF NOT EXISTS idx_amenazas_nombre ON public.amenazas(nombre);

-- RLS para amenazas
ALTER TABLE public.amenazas ENABLE ROW LEVEL SECURITY;

-- Políticas de amenazas
DROP POLICY IF EXISTS "Permitir lectura pública de amenazas" ON public.amenazas;
CREATE POLICY "Permitir lectura pública de amenazas"
  ON public.amenazas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserción pública de amenazas" ON public.amenazas;
CREATE POLICY "Permitir inserción pública de amenazas"
  ON public.amenazas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualización pública de amenazas" ON public.amenazas;
CREATE POLICY "Permitir actualización pública de amenazas"
  ON public.amenazas FOR UPDATE USING (true);

-- Comentarios
COMMENT ON TABLE public.amenazas IS 'Catálogo de amenazas para evaluación de riesgos';
COMMENT ON COLUMN public.amenazas.valor IS 'Valor de la amenaza en escala 1-5';


-- 2. CREAR TABLA DE VULNERABILIDADES
-- ============================================
CREATE TABLE IF NOT EXISTS public.vulnerabilidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  valor INTEGER NOT NULL CHECK (valor >= 1 AND valor <= 5),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para vulnerabilidades
CREATE INDEX IF NOT EXISTS idx_vulnerabilidades_activo ON public.vulnerabilidades(activo);
CREATE INDEX IF NOT EXISTS idx_vulnerabilidades_valor ON public.vulnerabilidades(valor);
CREATE INDEX IF NOT EXISTS idx_vulnerabilidades_nombre ON public.vulnerabilidades(nombre);

-- RLS para vulnerabilidades
ALTER TABLE public.vulnerabilidades ENABLE ROW LEVEL SECURITY;

-- Políticas de vulnerabilidades
DROP POLICY IF EXISTS "Permitir lectura pública de vulnerabilidades" ON public.vulnerabilidades;
CREATE POLICY "Permitir lectura pública de vulnerabilidades"
  ON public.vulnerabilidades FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserción pública de vulnerabilidades" ON public.vulnerabilidades;
CREATE POLICY "Permitir inserción pública de vulnerabilidades"
  ON public.vulnerabilidades FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualización pública de vulnerabilidades" ON public.vulnerabilidades;
CREATE POLICY "Permitir actualización pública de vulnerabilidades"
  ON public.vulnerabilidades FOR UPDATE USING (true);

-- Comentarios
COMMENT ON TABLE public.vulnerabilidades IS 'Catálogo de vulnerabilidades para evaluación de riesgos';
COMMENT ON COLUMN public.vulnerabilidades.valor IS 'Valor de la vulnerabilidad en escala 1-5';


-- 3. CREAR TABLA DE RIESGOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.riesgos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amenaza_id UUID NOT NULL REFERENCES public.amenazas(id) ON DELETE CASCADE,
  vulnerabilidad_id UUID NOT NULL REFERENCES public.vulnerabilidades(id) ON DELETE CASCADE,
  puntaje INTEGER NOT NULL,
  nivel VARCHAR(50) NOT NULL CHECK (nivel IN ('Bajo', 'Medio', 'Alto', 'Crítico')),
  color_hex VARCHAR(7) NOT NULL,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para riesgos
CREATE INDEX IF NOT EXISTS idx_riesgos_amenaza ON public.riesgos(amenaza_id);
CREATE INDEX IF NOT EXISTS idx_riesgos_vulnerabilidad ON public.riesgos(vulnerabilidad_id);
CREATE INDEX IF NOT EXISTS idx_riesgos_nivel ON public.riesgos(nivel);
CREATE INDEX IF NOT EXISTS idx_riesgos_puntaje ON public.riesgos(puntaje);
CREATE INDEX IF NOT EXISTS idx_riesgos_creado_en ON public.riesgos(creado_en DESC);

-- RLS para riesgos
ALTER TABLE public.riesgos ENABLE ROW LEVEL SECURITY;

-- Políticas de riesgos
DROP POLICY IF EXISTS "Permitir lectura pública de riesgos" ON public.riesgos;
CREATE POLICY "Permitir lectura pública de riesgos"
  ON public.riesgos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserción pública de riesgos" ON public.riesgos;
CREATE POLICY "Permitir inserción pública de riesgos"
  ON public.riesgos FOR INSERT WITH CHECK (true);

-- Comentarios
COMMENT ON TABLE public.riesgos IS 'Evaluaciones de riesgos calculadas a partir de amenazas y vulnerabilidades';
COMMENT ON COLUMN public.riesgos.puntaje IS 'Puntaje calculado (amenaza × vulnerabilidad)';
COMMENT ON COLUMN public.riesgos.nivel IS 'Nivel de riesgo: Bajo, Medio, Alto, Crítico';


-- 4. INSERTAR DATOS DE EJEMPLO
-- ============================================

-- Amenazas de ejemplo
INSERT INTO public.amenazas (nombre, descripcion, valor) VALUES
  ('Malware', 'Software malicioso que puede dañar sistemas y robar información', 5),
  ('Phishing', 'Intentos de obtener información confidencial mediante engaños', 4),
  ('Ataque DDoS', 'Ataque de denegación de servicio distribuido', 3),
  ('Acceso no autorizado', 'Intento de acceso sin los permisos adecuados', 4),
  ('Fuga de datos', 'Exposición no autorizada de información sensible', 5),
  ('Ingeniería social', 'Manipulación psicológica para obtener información', 3),
  ('Ransomware', 'Malware que cifra datos y exige rescate', 5),
  ('SQL Injection', 'Inyección de código SQL malicioso', 4),
  ('XSS', 'Cross-Site Scripting para ejecutar scripts maliciosos', 3),
  ('Man-in-the-Middle', 'Interceptación de comunicaciones', 4)
ON CONFLICT DO NOTHING;

-- Vulnerabilidades de ejemplo
INSERT INTO public.vulnerabilidades (nombre, descripcion, valor) VALUES
  ('Sistema sin actualizar', 'Software desactualizado con vulnerabilidades conocidas', 5),
  ('Contraseñas débiles', 'Uso de contraseñas fáciles de adivinar o predecir', 4),
  ('Falta de cifrado', 'Datos transmitidos o almacenados sin cifrado', 4),
  ('Sin firewall', 'Ausencia de protección perimetral en la red', 4),
  ('Sin respaldos', 'Falta de copias de seguridad de datos críticos', 3),
  ('Permisos excesivos', 'Usuarios con más permisos de los necesarios', 3),
  ('Logs deshabilitados', 'Falta de registro de eventos de seguridad', 2),
  ('Autenticación débil', 'Mecanismos de autenticación insuficientes', 4),
  ('Red WiFi abierta', 'Red inalámbrica sin protección', 5),
  ('Falta de capacitación', 'Personal sin entrenamiento en seguridad', 3)
ON CONFLICT DO NOTHING;


-- 5. CREAR FUNCIONES AUXILIARES
-- ============================================

-- Función para calcular estadísticas de riesgos
CREATE OR REPLACE FUNCTION public.obtener_estadisticas_riesgos()
RETURNS TABLE (
  nivel TEXT,
  total BIGINT,
  color_hex TEXT,
  porcentaje NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH totales AS (
    SELECT COUNT(*) as total_general FROM public.riesgos
  )
  SELECT
    r.nivel::TEXT,
    COUNT(r.id) as total,
    r.color_hex::TEXT,
    ROUND((COUNT(r.id)::NUMERIC / NULLIF(t.total_general, 0)) * 100, 2) as porcentaje
  FROM public.riesgos r
  CROSS JOIN totales t
  GROUP BY r.nivel, r.color_hex, t.total_general
  ORDER BY
    CASE r.nivel
      WHEN 'Crítico' THEN 1
      WHEN 'Alto' THEN 2
      WHEN 'Medio' THEN 3
      WHEN 'Bajo' THEN 4
    END;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar timestamp de actualización
CREATE OR REPLACE FUNCTION public.actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamps
DROP TRIGGER IF EXISTS trigger_actualizar_amenazas ON public.amenazas;
CREATE TRIGGER trigger_actualizar_amenazas
  BEFORE UPDATE ON public.amenazas
  FOR EACH ROW
  EXECUTE FUNCTION public.actualizar_timestamp();

DROP TRIGGER IF EXISTS trigger_actualizar_vulnerabilidades ON public.vulnerabilidades;
CREATE TRIGGER trigger_actualizar_vulnerabilidades
  BEFORE UPDATE ON public.vulnerabilidades
  FOR EACH ROW
  EXECUTE FUNCTION public.actualizar_timestamp();


-- 6. CREAR VISTAS ÚTILES
-- ============================================

-- Vista de riesgos con información completa
CREATE OR REPLACE VIEW public.vista_riesgos_completa AS
SELECT
  r.id,
  r.puntaje,
  r.nivel,
  r.color_hex,
  r.creado_en,
  a.id as amenaza_id,
  a.nombre as amenaza_nombre,
  a.descripcion as amenaza_descripcion,
  a.valor as amenaza_valor,
  v.id as vulnerabilidad_id,
  v.nombre as vulnerabilidad_nombre,
  v.descripcion as vulnerabilidad_descripcion,
  v.valor as vulnerabilidad_valor
FROM public.riesgos r
INNER JOIN public.amenazas a ON r.amenaza_id = a.id
INNER JOIN public.vulnerabilidades v ON r.vulnerabilidad_id = v.id
ORDER BY r.creado_en DESC;


-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Verificar la instalación
SELECT 'Tablas creadas:' as info;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('amenazas', 'vulnerabilidades', 'riesgos');

SELECT 'Total de amenazas:' as info, COUNT(*) as total FROM public.amenazas;
SELECT 'Total de vulnerabilidades:' as info, COUNT(*) as total FROM public.vulnerabilidades;
SELECT 'Total de riesgos:' as info, COUNT(*) as total FROM public.riesgos;
