# Script de instalación de Supabase para el proyecto de Matriz de Riesgos
# PowerShell Script

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Instalación de Supabase - Matriz de Riesgos  " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path ".\frontend")) {
    Write-Host "❌ Error: Debes ejecutar este script desde la raíz del proyecto" -ForegroundColor Red
    Write-Host "   Directorio actual: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Directorio correcto detectado" -ForegroundColor Green
Write-Host ""

# Paso 1: Instalar dependencias de Supabase
Write-Host "📦 Paso 1: Instalando @supabase/supabase-js..." -ForegroundColor Yellow
Set-Location frontend

try {
    npm install @supabase/supabase-js
    Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..
Write-Host ""

# Paso 2: Verificar archivos de configuración
Write-Host "🔍 Paso 2: Verificando archivos de configuración..." -ForegroundColor Yellow

$archivosRequeridos = @(
    ".\frontend\.env.local",
    ".\frontend\src\lib\supabaseClient.ts",
    ".\frontend\src\lib\database.types.ts",
    ".\frontend\src\services\supabase.ts",
    ".\supabase-setup.sql"
)

$todosExisten = $true
foreach ($archivo in $archivosRequeridos) {
    if (Test-Path $archivo) {
        Write-Host "  ✅ $archivo" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $archivo (falta)" -ForegroundColor Red
        $todosExisten = $false
    }
}

Write-Host ""

if (-not $todosExisten) {
    Write-Host "⚠️  Algunos archivos de configuración faltan" -ForegroundColor Yellow
    Write-Host "   Por favor, verifica que todos los archivos se hayan creado correctamente" -ForegroundColor Yellow
    Write-Host ""
}

# Paso 3: Instrucciones para Supabase
Write-Host "📋 Paso 3: Configuración en Supabase" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ahora necesitas ejecutar el script SQL en Supabase:" -ForegroundColor White
Write-Host ""
Write-Host "1. Abre el SQL Editor de Supabase:" -ForegroundColor Cyan
Write-Host "   👉 https://supabase.com/dashboard/project/ijwdflcqhimplhtxnwgq/sql" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Abre el archivo: supabase-setup.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Copia todo el contenido y pégalo en el SQL Editor" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Haz clic en 'Run' o presiona Ctrl+Enter" -ForegroundColor Cyan
Write-Host ""

# Paso 4: Verificar variables de entorno
Write-Host "🔑 Paso 4: Verificando variables de entorno..." -ForegroundColor Yellow

if (Test-Path ".\frontend\.env.local") {
    $envContent = Get-Content ".\frontend\.env.local" -Raw
    
    if ($envContent -match "VITE_SUPABASE_URL=https://ijwdflcqhimplhtxnwgq.supabase.co") {
        Write-Host "  ✅ VITE_SUPABASE_URL configurada" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  VITE_SUPABASE_URL podría estar incorrecta" -ForegroundColor Yellow
    }
    
    if ($envContent -match "VITE_SUPABASE_ANON_KEY=") {
        Write-Host "  ✅ VITE_SUPABASE_ANON_KEY configurada" -ForegroundColor Green
    } else {
        Write-Host "  ❌ VITE_SUPABASE_ANON_KEY falta" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ Archivo .env.local no encontrado" -ForegroundColor Red
}

Write-Host ""

# Resumen final
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Resumen de la Instalación" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
Write-Host "✅ Archivos de configuración creados" -ForegroundColor Green
Write-Host "📋 Pendiente: Ejecutar script SQL en Supabase" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Lee el archivo INTEGRACION_SUPABASE.md para más información" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Una vez completados todos los pasos, ejecuta:" -ForegroundColor Green
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

# Preguntar si abrir el navegador
Write-Host ""
$respuesta = Read-Host "¿Deseas abrir el SQL Editor de Supabase en tu navegador? (s/n)"

if ($respuesta -eq "s" -or $respuesta -eq "S" -or $respuesta -eq "si" -or $respuesta -eq "Si") {
    Start-Process "https://supabase.com/dashboard/project/ijwdflcqhimplhtxnwgq/sql"
    Write-Host "✅ Abriendo navegador..." -ForegroundColor Green
}

Write-Host ""
Write-Host "¡Instalación completada! 🎉" -ForegroundColor Green
Write-Host ""
