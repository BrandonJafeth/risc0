# 🚀 Guía Rápida: Integración de Supabase

## ⚡ Instalación Rápida (3 pasos)

### 1️⃣ Ejecutar el script de instalación

```powershell
.\install-supabase.ps1
```

Este script automáticamente:
- ✅ Instala `@supabase/supabase-js`
- ✅ Verifica los archivos de configuración
- ✅ Te guía al SQL Editor de Supabase

### 2️⃣ Configurar la base de datos

1. Abre el **SQL Editor** (el script te abrirá el enlace)
2. Copia el contenido de `supabase-setup.sql`
3. Pega y ejecuta en Supabase
4. Verifica que se crearon 3 tablas y datos de prueba

### 3️⃣ Actualizar tu código

**Opción A: Reemplazar servicios existentes**

En tus componentes, cambia:
```typescript
import { amenazaService, vulnerabilidadService, riesgoService } from '@/services/api';
```

Por:
```typescript
import { 
  supabaseAmenazaService as amenazaService,
  supabaseVulnerabilidadService as vulnerabilidadService,
  supabaseRiesgoService as riesgoService
} from '@/services/supabase';
```

**Opción B: Usar los hooks de Supabase**

```typescript
// En lugar de useRiesgos()
import { useRiesgosSupabase } from '@/hooks/useRiesgosSupabase';

// En tu componente
const { riesgos, isLoading, crearRiesgo } = useRiesgosSupabase();
```

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `install-supabase.ps1` | Script de instalación automática |
| `supabase-setup.sql` | Script SQL para crear tablas |
| `INTEGRACION_SUPABASE.md` | Documentación completa |
| `frontend/.env.local` | Variables de entorno de Supabase |
| `frontend/src/lib/supabaseClient.ts` | Cliente de Supabase |
| `frontend/src/services/supabase.ts` | Servicios de API con Supabase |
| `frontend/src/hooks/useRiesgosSupabase.ts` | Hook para riesgos |
| `frontend/src/hooks/useAmenazasSupabase.ts` | Hook para amenazas |
| `frontend/src/hooks/useVulnerabilidadesSupabase.ts` | Hook para vulnerabilidades |

## 🔑 Credenciales

**URL del Proyecto**: https://ijwdflcqhimplhtxnwgq.supabase.co

Las claves ya están configuradas en `.env.local`

## 🧪 Probar la Integración

```powershell
cd frontend
npm run dev
```

Visita http://localhost:5173 y verifica:
- ✅ Dashboard carga estadísticas
- ✅ Catálogos muestran amenazas/vulnerabilidades
- ✅ Nueva evaluación permite crear riesgos

## 📊 Datos de Ejemplo Incluidos

El script SQL incluye:
- 10 amenazas de ejemplo (Malware, Phishing, etc.)
- 10 vulnerabilidades de ejemplo (Contraseñas débiles, etc.)
- Listas para crear evaluaciones de riesgo

## 🆘 Problemas Comunes

**Error: Cannot find module '@supabase/supabase-js'**
```powershell
cd frontend
npm install @supabase/supabase-js
```

**Error: Table does not exist**
- Ejecuta `supabase-setup.sql` en el SQL Editor de Supabase

**Error: Faltan variables de entorno**
- Verifica que existe `frontend/.env.local`
- Debe contener `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

## 📖 Documentación Completa

Lee `INTEGRACION_SUPABASE.md` para:
- Estructura completa de la base de datos
- Ejemplos de uso detallados
- Configuración de seguridad (RLS)
- Funciones auxiliares y vistas
- Próximos pasos opcionales

## ✨ Ventajas de Supabase

- 🚀 **PostgreSQL completo** - Más potente que cualquier API
- 🔄 **Realtime** - Actualizaciones en tiempo real (opcional)
- 🔒 **RLS** - Seguridad a nivel de fila
- 📦 **Respaldos automáticos** - Datos seguros
- 🌐 **Escalable** - Crece con tu app
- 🎯 **Dashboard web** - Gestión visual fácil

## 🎉 ¡Todo Listo!

Tu sistema de matriz de riesgos ahora está conectado a Supabase. 

**Siguiente paso**: Ejecuta `.\install-supabase.ps1` para comenzar 🚀
