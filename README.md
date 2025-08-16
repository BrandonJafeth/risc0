# Calculadora de Riesgos de Seguridad Informática

Sistema full-stack para calcular y gestionar riesgos de seguridad informática basado en la fórmula: **Riesgo = Amenaza × Vulnerabilidad**.

## 🏗️ Arquitectura

- **Backend**: NestJS + TypeORM + SQLite
- **Frontend**: React + Vite + Tailwind CSS + TypeScript
- **Monorepo**: Estructura simple con carpetas separadas

## 📁 Estructura del Proyecto

```
risc0/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── entities/          # Entidades TypeORM
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── controllers/      # Controladores REST
│   │   ├── services/         # Lógica de negocio
│   │   ├── config/           # Configuraciones
│   │   └── main.ts           # Punto de entrada
│   ├── data.sqlite           # Base de datos SQLite
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

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Backend (API)

```bash
cd backend
npm install
npm run start:dev
```

El backend estará disponible en: http://localhost:3000

### Frontend (Aplicación Web)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## 📊 Funcionalidades

### Backend API

- **Gestión de Amenazas**: CRUD completo con valores 1-5
- **Gestión de Vulnerabilidades**: CRUD completo con valores 1-5  
- **Cálculo de Riesgos**: Automático basado en Amenaza × Vulnerabilidad
- **Matriz de Riesgos**: Clasificación automática (Bajo/Medio/Alto/Crítico)
- **Filtros y Paginación**: Para consultas de riesgos

### Frontend

- **Dashboard**: KPIs y gráficos de riesgos
- **Nueva Evaluación**: Formulario con cálculo en vivo
- **Matriz 5×5**: Visualización interactiva
- **Catálogos**: Gestión de amenazas y vulnerabilidades
- **Exportación**: CSV de riesgos

## 🔧 Configuración

### Variables de Entorno Backend (.env)

```env
DB_PATH=./data.sqlite
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
```

### Variables de Entorno Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## 🧪 Pruebas

### Backend

```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend

```bash
cd frontend
npm run test
```

## 📝 Scripts Disponibles

### Backend

- `npm run start:dev` - Desarrollo con hot reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar en producción
- `npm run seed` - Poblar base de datos inicial

### Frontend

- `npm run dev` - Desarrollo con Vite
- `npm run build` - Compilar para producción
- `npm run preview` - Vista previa de producción

## 🎯 Matriz de Riesgos

| Amenaza\Vulnerabilidad | 1 | 2 | 3 | 4 | 5 |
|----------------------|---|---|---|---|---|
| 1 | Bajo | Bajo | Bajo | Bajo | Medio |
| 2 | Bajo | Bajo | Bajo | Medio | Medio |
| 3 | Bajo | Bajo | Medio | Medio | Alto |
| 4 | Bajo | Medio | Medio | Alto | Alto |
| 5 | Medio | Medio | Alto | Alto | Crítico |

**Colores:**
- Bajo: #16a34a (Verde)
- Medio: #ca8a04 (Amarillo)
- Alto: #f97316 (Naranja)
- Crítico: #dc2626 (Rojo)
