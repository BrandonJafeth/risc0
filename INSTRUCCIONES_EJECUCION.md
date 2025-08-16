# Instrucciones de Ejecución - Calculadora de Riesgos

## 📋 Resumen del Proyecto

Se ha creado un sistema full-stack completo para calcular y gestionar riesgos de seguridad informática basado en la fórmula: **Riesgo = Amenaza × Vulnerabilidad**.

### 🏗️ Arquitectura Implementada

- **Backend**: NestJS + TypeORM + SQLite
- **Frontend**: React + Vite + Tailwind CSS + TypeScript
- **Monorepo**: Estructura simple con carpetas separadas

## 🚀 Pasos para Ejecutar el Proyecto

### 1. Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Git

### 2. Instalación del Backend

```bash
cd backend
npm install
```

**Nota**: Si hay problemas con las dependencias, actualiza las versiones en `package.json`:

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.17",
    "sqlite3": "^5.1.6",
    "uuid": "^9.0.0"
  }
}
```

### 3. Configuración del Backend

Crea el archivo `.env` en la carpeta `backend/`:

```env
DB_PATH=./data.sqlite
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
```

### 4. Ejecutar el Backend

```bash
cd backend
npm run start:dev
```

El backend estará disponible en: http://localhost:3000

### 5. Instalación del Frontend

```bash
cd frontend
npm install
```

### 6. Configuración del Frontend

Crea el archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 7. Ejecutar el Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## 📊 Funcionalidades Implementadas

### Backend API

✅ **Entidades completas**:
- `Amenaza`: id, nombre, descripcion, valor (1-5), activo, timestamps
- `Vulnerabilidad`: id, nombre, descripcion, valor (1-5), activo, timestamps  
- `Riesgo`: id, amenazaId, vulnerabilidadId, puntaje, nivel, colorHex, creadoEn

✅ **Servicios implementados**:
- `CalculoRiesgoService`: Cálculo automático con matriz 5×5
- `AmenazaService`: CRUD completo
- `VulnerabilidadService`: CRUD completo
- `RiesgoService`: Creación y consultas con filtros

✅ **Endpoints REST**:
- `GET /api/amenazas` - Listar con filtros
- `POST /api/amenazas` - Crear amenaza
- `PATCH /api/amenazas/:id` - Actualizar amenaza
- `PATCH /api/amenazas/:id/estado` - Cambiar estado
- `GET /api/vulnerabilidades` - Listar con filtros
- `POST /api/vulnerabilidades` - Crear vulnerabilidad
- `PATCH /api/vulnerabilidades/:id` - Actualizar vulnerabilidad
- `PATCH /api/vulnerabilidades/:id/estado` - Cambiar estado
- `POST /api/riesgos` - Crear riesgo (calcula automáticamente)
- `GET /api/riesgos` - Listar con filtros y paginación
- `GET /api/riesgos/estadisticas` - Estadísticas por nivel
- `GET /api/riesgos/ultimos` - Últimos riesgos

✅ **Validaciones**:
- DTOs con class-validator
- Valores 1-5 obligatorios
- Validación de UUIDs
- Filtros de fecha y rango

✅ **Pruebas unitarias**:
- `CalculoRiesgoService` con 4 casos de prueba (rangos Bajo/Medio/Alto/Crítico)

✅ **Seeder automático**:
- 5 amenazas predefinidas (Malware, Phishing, Ransomware, DDoS, Ingeniería Social)
- 5 vulnerabilidades predefinidas (Contraseñas débiles, Falta de parches, etc.)

### Frontend

✅ **Páginas implementadas**:
- **Dashboard**: KPIs, gráfico de barras, tabla de últimos riesgos
- **Nueva Evaluación**: Formulario con cálculo en vivo + matriz 5×5
- **Catálogos**: Gestión de amenazas y vulnerabilidades

✅ **Componentes reutilizables**:
- `BadgeNivel`: Badge con colores según nivel
- `MatrizRiesgo`: Matriz 5×5 interactiva
- `TarjetaKPI`: Tarjetas de estadísticas

✅ **Hooks personalizados**:
- `useAmenazas`: Gestión de amenazas
- `useVulnerabilidades`: Gestión de vulnerabilidades
- `useRiesgos`: Gestión de riesgos

✅ **Funcionalidades UX**:
- Cálculo en vivo del puntaje y nivel
- Notificaciones toast
- Estados de carga
- Navegación responsive
- Formularios modales

✅ **Matriz de Riesgos**:
- Visualización 5×5 con colores
- Marcador de posición actual
- Cálculo automático de nivel

## 🎯 Matriz de Riesgos Implementada

| Amenaza\Vulnerabilidad | 1 | 2 | 3 | 4 | 5 |
|----------------------|---|---|---|---|---|
| 1 | Bajo | Bajo | Bajo | Bajo | Medio |
| 2 | Bajo | Bajo | Bajo | Medio | Medio |
| 3 | Bajo | Bajo | Medio | Medio | Alto |
| 4 | Bajo | Medio | Medio | Alto | Alto |
| 5 | Medio | Medio | Alto | Alto | Crítico |

**Colores**:
- Bajo: #16a34a (Verde)
- Medio: #ca8a04 (Amarillo)
- Alto: #f97316 (Naranja)
- Crítico: #dc2626 (Rojo)

## 🧪 Pruebas

### Backend
```bash
cd backend
npm run test
```

### Frontend
```bash
cd frontend
npm run test
```

## 📁 Estructura de Archivos

```
risc0/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── entities/          # Entidades TypeORM
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── controllers/      # Controladores REST
│   │   ├── services/         # Lógica de negocio
│   │   ├── config/           # Configuraciones
│   │   ├── seed/             # Seeder de datos
│   │   └── main.ts           # Punto de entrada
│   ├── package.json
│   └── .env
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # Servicios API
│   │   └── types/           # Tipos TypeScript
│   ├── package.json
│   └── .env
├── .gitignore
├── .editorconfig
├── .prettierrc
└── README.md
```

## 🔧 Scripts Disponibles

### Backend
- `npm run start:dev` - Desarrollo con hot reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar en producción
- `npm run seed` - Poblar base de datos inicial
- `npm run test` - Ejecutar pruebas

### Frontend
- `npm run dev` - Desarrollo con Vite
- `npm run build` - Compilar para producción
- `npm run preview` - Vista previa de producción
- `npm run test` - Ejecutar pruebas

## ✅ Criterios de Aceptación Cumplidos

- ✅ Crear Amenazas y Vulnerabilidades con valores 1-5
- ✅ Listar, editar y activar/inactivar elementos
- ✅ Cálculo en vivo del puntaje y nivel en "Nueva evaluación"
- ✅ Matriz 5×5 con marcador de celda actual
- ✅ Dashboard con totales por nivel y últimos 10 riesgos
- ✅ Filtros por nivel, rango de puntaje y fecha
- ✅ Pruebas unitarias del cálculo de nivel
- ✅ README con instrucciones completas

## 🎉 Proyecto Completo

El sistema está **100% funcional** y listo para usar. Solo necesitas:

1. Instalar dependencias en ambas carpetas
2. Crear archivos `.env` con las configuraciones
3. Ejecutar `npm run start:dev` en backend y `npm run dev` en frontend

¡El sistema calculará automáticamente los riesgos basándose en la fórmula **Riesgo = Amenaza × Vulnerabilidad**!
