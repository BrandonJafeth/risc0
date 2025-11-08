# Configuración de Supabase para el Proyecto de Matriz de Riesgos

## Información del Proyecto
- **URL**: https://ijwdflcqhimplhtxnwgq.supabase.co
- **Proyecto**: Jardín Virtual Interactivo

## Pasos de Configuración

### 1. Instalar dependencias de Supabase

```bash
# En el frontend
cd frontend
npm install @supabase/supabase-js
```

### 2. Crear las tablas en Supabase

Ve al SQL Editor de Supabase (https://supabase.com/dashboard/project/ijwdflcqhimplhtxnwgq/sql) y ejecuta los siguientes scripts:

#### Tabla de Amenazas
```sql
-- Crear tabla de amenazas
CREATE TABLE IF NOT EXISTS public.amenazas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  valor INTEGER NOT NULL CHECK (valor >= 1 AND valor <= 5),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_amenazas_activo ON public.amenazas(activo);
CREATE INDEX IF NOT EXISTS idx_amenazas_valor ON public.amenazas(valor);

-- Habilitar RLS
ALTER TABLE public.amenazas ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Permitir lectura pública" ON public.amenazas FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública" ON public.amenazas FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización pública" ON public.amenazas FOR UPDATE USING (true);
```

#### Tabla de Vulnerabilidades
```sql
-- Crear tabla de vulnerabilidades
CREATE TABLE IF NOT EXISTS public.vulnerabilidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  valor INTEGER NOT NULL CHECK (valor >= 1 AND valor <= 5),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_vulnerabilidades_activo ON public.vulnerabilidades(activo);
CREATE INDEX IF NOT EXISTS idx_vulnerabilidades_valor ON public.vulnerabilidades(valor);

-- Habilitar RLS
ALTER TABLE public.vulnerabilidades ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Permitir lectura pública" ON public.vulnerabilidades FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública" ON public.vulnerabilidades FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización pública" ON public.vulnerabilidades FOR UPDATE USING (true);
```

#### Tabla de Riesgos
```sql
-- Crear tabla de riesgos
CREATE TABLE IF NOT EXISTS public.riesgos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amenaza_id UUID NOT NULL REFERENCES public.amenazas(id) ON DELETE CASCADE,
  vulnerabilidad_id UUID NOT NULL REFERENCES public.vulnerabilidades(id) ON DELETE CASCADE,
  puntaje INTEGER NOT NULL,
  nivel VARCHAR(50) NOT NULL CHECK (nivel IN ('Bajo', 'Medio', 'Alto', 'Crítico')),
  color_hex VARCHAR(7) NOT NULL,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_riesgos_amenaza ON public.riesgos(amenaza_id);
CREATE INDEX IF NOT EXISTS idx_riesgos_vulnerabilidad ON public.riesgos(vulnerabilidad_id);
CREATE INDEX IF NOT EXISTS idx_riesgos_nivel ON public.riesgos(nivel);
CREATE INDEX IF NOT EXISTS idx_riesgos_puntaje ON public.riesgos(puntaje);
CREATE INDEX IF NOT EXISTS idx_riesgos_creado_en ON public.riesgos(creado_en DESC);

-- Habilitar RLS
ALTER TABLE public.riesgos ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Permitir lectura pública" ON public.riesgos FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública" ON public.riesgos FOR INSERT WITH CHECK (true);
```

### 3. Insertar datos de prueba (Opcional)

```sql
-- Amenazas de ejemplo
INSERT INTO public.amenazas (nombre, descripcion, valor) VALUES
  ('Malware', 'Software malicioso que puede dañar sistemas', 5),
  ('Phishing', 'Intento de obtener información confidencial', 4),
  ('DDoS', 'Ataque de denegación de servicio', 3),
  ('Acceso no autorizado', 'Intento de acceso sin permisos', 4),
  ('Fuga de datos', 'Exposición no autorizada de información', 5);

-- Vulnerabilidades de ejemplo
INSERT INTO public.vulnerabilidades (nombre, descripcion, valor) VALUES
  ('Sistema sin actualizar', 'Software desactualizado con vulnerabilidades conocidas', 5),
  ('Contraseñas débiles', 'Uso de contraseñas fáciles de adivinar', 4),
  ('Falta de cifrado', 'Datos transmitidos sin cifrado', 3),
  ('Sin firewall', 'Ausencia de protección perimetral', 4),
  ('Sin backup', 'Falta de copias de seguridad', 3);
```

### 4. Usar el servicio de Supabase en tu aplicación

Actualiza tus componentes para usar el nuevo servicio:

```typescript
// En lugar de:
import { amenazaService, vulnerabilidadService, riesgoService } from '@/services/api';

// Usa:
import { 
  supabaseAmenazaService, 
  supabaseVulnerabilidadService, 
  supabaseRiesgoService 
} from '@/services/supabase';
```

### 5. Variables de entorno

Asegúrate de que el archivo `.env.local` esté configurado con las credenciales correctas (ya creado).

## Ventajas de usar Supabase

1. **Base de datos PostgreSQL** - Potente y escalable
2. **APIs automáticas** - RESTful y realtime
3. **Row Level Security** - Seguridad a nivel de fila
4. **Almacenamiento** - Para archivos si los necesitas
5. **Autenticación** - Sistema de usuarios integrado (opcional)
6. **Realtime** - Actualizaciones en tiempo real (opcional)

## Próximos pasos

1. Ejecuta los scripts SQL en el editor de Supabase
2. Instala `@supabase/supabase-js` en el frontend
3. Actualiza tus componentes para usar los nuevos servicios
4. Prueba la aplicación

¡La integración está lista! 🚀
