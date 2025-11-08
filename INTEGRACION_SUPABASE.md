# 🛡️ Integración de Supabase - Sistema de Matriz de Riesgos

## 📋 Resumen

Se ha integrado Supabase como base de datos para tu sistema de gestión de riesgos. Esta guía te ayudará a configurar y usar la integración.

## 🔑 Información del Proyecto Supabase

- **URL del Proyecto**: https://ijwdflcqhimplhtxnwgq.supabase.co
- **Nombre**: Jardín Virtual Interactivo
- **Archivos Configurados**:
  - ✅ Cliente de Supabase creado
  - ✅ Tipos TypeScript generados
  - ✅ Servicios de API adaptados
  - ✅ Variables de entorno configuradas

## 🚀 Pasos de Instalación

### 1️⃣ Instalar Dependencias

```powershell
cd frontend
npm install @supabase/supabase-js
```

### 2️⃣ Configurar la Base de Datos

1. Ve al **SQL Editor** de tu proyecto Supabase:
   👉 https://supabase.com/dashboard/project/ijwdflcqhimplhtxnwgq/sql

2. Copia todo el contenido del archivo `supabase-setup.sql`

3. Pega y ejecuta el script completo

El script creará:
- ✅ Tabla `amenazas` (10 registros de ejemplo)
- ✅ Tabla `vulnerabilidades` (10 registros de ejemplo)
- ✅ Tabla `riesgos` (calculados automáticamente)
- ✅ Índices para optimizar consultas
- ✅ Row Level Security (RLS) habilitado
- ✅ Funciones auxiliares y vistas

### 3️⃣ Verificar la Instalación

Después de ejecutar el script SQL, verifica que las tablas se crearon:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('amenazas', 'vulnerabilidades', 'riesgos');
```

## 📁 Archivos Creados

### Frontend

```
frontend/
├── .env.local                          # ✅ Credenciales de Supabase
├── src/
│   ├── lib/
│   │   ├── supabaseClient.ts          # ✅ Cliente de Supabase
│   │   └── database.types.ts          # ✅ Tipos TypeScript
│   └── services/
│       ├── api.ts                      # 📌 API actual (mantener para backup)
│       └── supabase.ts                 # ✅ Nuevo servicio con Supabase
```

### Backend (Opcional)

```
backend/
└── .env.local                          # ✅ Credenciales de Supabase (service role)
```

## 🔄 Cómo Usar los Nuevos Servicios

### Opción 1: Actualizar Componentes Existentes

Reemplaza las importaciones en tus componentes:

```typescript
// ❌ Antes (API actual)
import { amenazaService, vulnerabilidadService, riesgoService } from '@/services/api';

// ✅ Ahora (Supabase)
import { 
  supabaseAmenazaService as amenazaService,
  supabaseVulnerabilidadService as vulnerabilidadService,
  supabaseRiesgoService as riesgoService
} from '@/services/supabase';
```

### Opción 2: Usar Directamente

```typescript
import { 
  supabaseAmenazaService,
  supabaseVulnerabilidadService,
  supabaseRiesgoService 
} from '@/services/supabase';

// Ejemplos de uso
const amenazas = await supabaseAmenazaService.listar(true);
const riesgo = await supabaseRiesgoService.crear({
  amenazaId: 'uuid-amenaza',
  vulnerabilidadId: 'uuid-vulnerabilidad'
});
```

## 📊 Estructura de la Base de Datos

### Tabla: `amenazas`

| Campo          | Tipo      | Descripción                    |
|----------------|-----------|--------------------------------|
| id             | UUID      | Identificador único            |
| nombre         | VARCHAR   | Nombre de la amenaza           |
| descripcion    | TEXT      | Descripción detallada          |
| valor          | INTEGER   | Valor de 1 a 5                 |
| activo         | BOOLEAN   | Si está activa                 |
| creado_en      | TIMESTAMP | Fecha de creación              |
| actualizado_en | TIMESTAMP | Fecha de última actualización  |

### Tabla: `vulnerabilidades`

| Campo          | Tipo      | Descripción                    |
|----------------|-----------|--------------------------------|
| id             | UUID      | Identificador único            |
| nombre         | VARCHAR   | Nombre de la vulnerabilidad    |
| descripcion    | TEXT      | Descripción detallada          |
| valor          | INTEGER   | Valor de 1 a 5                 |
| activo         | BOOLEAN   | Si está activa                 |
| creado_en      | TIMESTAMP | Fecha de creación              |
| actualizado_en | TIMESTAMP | Fecha de última actualización  |

### Tabla: `riesgos`

| Campo              | Tipo      | Descripción                       |
|--------------------|-----------|-----------------------------------|
| id                 | UUID      | Identificador único               |
| amenaza_id         | UUID      | Referencia a amenaza              |
| vulnerabilidad_id  | UUID      | Referencia a vulnerabilidad       |
| puntaje            | INTEGER   | Cálculo (amenaza × vulnerabilidad)|
| nivel              | VARCHAR   | Bajo/Medio/Alto/Crítico           |
| color_hex          | VARCHAR   | Color para visualización          |
| creado_en          | TIMESTAMP | Fecha de creación                 |

## 🎨 Matriz de Riesgos 5x5

Tu componente `MatrizRiesgo.tsx` ya está configurado con la siguiente matriz:

|   | V1   | V2   | V3   | V4   | V5    |
|---|------|------|------|------|-------|
| A1| Bajo | Bajo | Bajo | Bajo | Medio |
| A2| Bajo | Bajo | Bajo | Medio| Medio |
| A3| Bajo | Bajo | Medio| Medio| Alto  |
| A4| Bajo | Medio| Medio| Alto | Alto  |
| A5| Medio| Medio| Alto | Alto | Crítico|

**Colores:**
- 🟢 **Bajo**: #16a34a
- 🟡 **Medio**: #ca8a04
- 🟠 **Alto**: #f97316
- 🔴 **Crítico**: #dc2626

## 🔒 Seguridad (Row Level Security)

Las políticas RLS están configuradas para:
- ✅ Permitir lectura pública de todas las tablas
- ✅ Permitir inserción pública (puedes restringir esto más tarde)
- ✅ Permitir actualización pública de amenazas y vulnerabilidades

### Restringir Acceso (Opcional)

Si quieres agregar autenticación, puedes modificar las políticas:

```sql
-- Solo usuarios autenticados pueden insertar
DROP POLICY "Permitir inserción pública de riesgos" ON public.riesgos;
CREATE POLICY "Solo usuarios pueden insertar riesgos" 
  ON public.riesgos FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');
```

## 📈 Funciones Auxiliares

### Obtener Estadísticas

```sql
SELECT * FROM public.obtener_estadisticas_riesgos();
```

### Vista de Riesgos Completa

```sql
SELECT * FROM public.vista_riesgos_completa;
```

## 🧪 Probar la Integración

### 1. Listar Amenazas

```typescript
const amenazas = await supabaseAmenazaService.listar(true);
console.log('Amenazas activas:', amenazas);
```

### 2. Crear un Riesgo

```typescript
const nuevoRiesgo = await supabaseRiesgoService.crear({
  amenazaId: 'id-de-amenaza',
  vulnerabilidadId: 'id-de-vulnerabilidad'
});
console.log('Riesgo creado:', nuevoRiesgo);
```

### 3. Obtener Estadísticas

```typescript
const stats = await supabaseRiesgoService.obtenerEstadisticas();
console.log('Estadísticas:', stats);
```

## 🎯 Ventajas de Supabase

1. **PostgreSQL Completo** - Base de datos potente y confiable
2. **APIs Automáticas** - RESTful y GraphQL generadas automáticamente
3. **Realtime** - Actualizaciones en tiempo real (opcional)
4. **Seguridad RLS** - Control granular de acceso a nivel de fila
5. **Backup Automático** - Respaldos diarios incluidos
6. **Escalabilidad** - Crece con tu aplicación
7. **Dashboard Intuitivo** - Interfaz web para gestión
8. **Almacenamiento** - Para archivos si los necesitas

## 🚨 Solución de Problemas

### Error: "Cannot find module '@supabase/supabase-js'"

```powershell
cd frontend
npm install @supabase/supabase-js
```

### Error: "Faltan las variables de entorno"

Verifica que el archivo `.env.local` exista en `/frontend` con:

```env
VITE_SUPABASE_URL=https://ijwdflcqhimplhtxnwgq.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### Error: "Table 'amenazas' does not exist"

Ejecuta el script `supabase-setup.sql` en el SQL Editor de Supabase.

## 📚 Próximos Pasos

1. ✅ Ejecutar el script SQL (`supabase-setup.sql`)
2. ✅ Instalar dependencias (`npm install @supabase/supabase-js`)
3. ✅ Actualizar componentes para usar los nuevos servicios
4. ✅ Probar la aplicación
5. 🔜 (Opcional) Agregar autenticación de usuarios
6. 🔜 (Opcional) Implementar actualizaciones en tiempo real
7. 🔜 (Opcional) Configurar Edge Functions para lógica del servidor

## 🆘 Soporte

- **Documentación Supabase**: https://supabase.com/docs
- **Dashboard**: https://supabase.com/dashboard/project/ijwdflcqhimplhtxnwgq
- **API Reference**: https://supabase.com/docs/reference/javascript

---

¡Todo está listo para que uses Supabase con tu sistema de matriz de riesgos! 🎉
