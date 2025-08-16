import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AmenazaService } from '../services/amenaza.service';
import { VulnerabilidadService } from '../services/vulnerabilidad.service';
import { NivelAmenaza } from '../entities/amenaza.entity';
import { NivelVulnerabilidad } from '../entities/vulnerabilidad.entity';

const datosAmenazas = [
  {
    nombre: 'Malware',
    descripcion: 'Software malicioso diseñado para dañar sistemas o robar información',
    valor: NivelAmenaza.MUY_ALTO,
  },
  {
    nombre: 'Phishing',
    descripcion: 'Técnica de ingeniería social para obtener información sensible',
    valor: NivelAmenaza.ALTO,
  },
  {
    nombre: 'Ransomware',
    descripcion: 'Malware que cifra archivos y exige rescate por su liberación',
    valor: NivelAmenaza.MUY_ALTO,
  },
  {
    nombre: 'DDoS',
    descripcion: 'Ataque de denegación de servicio distribuido',
    valor: NivelAmenaza.MEDIO,
  },
  {
    nombre: 'Ingeniería Social',
    descripcion: 'Manipulación psicológica para obtener acceso no autorizado',
    valor: NivelAmenaza.ALTO,
  },
];

const datosVulnerabilidades = [
  {
    nombre: 'Contraseñas débiles',
    descripcion: 'Uso de contraseñas fáciles de adivinar o crackear',
    valor: NivelVulnerabilidad.ALTO,
  },
  {
    nombre: 'Falta de parches',
    descripcion: 'Sistemas sin actualizaciones de seguridad recientes',
    valor: NivelVulnerabilidad.MUY_ALTO,
  },
  {
    nombre: 'Puertos expuestos',
    descripcion: 'Puertos de red abiertos innecesariamente',
    valor: NivelVulnerabilidad.MEDIO,
  },
  {
    nombre: 'Configuración insegura',
    descripcion: 'Configuraciones por defecto o inseguras en sistemas',
    valor: NivelVulnerabilidad.ALTO,
  },
  {
    nombre: 'Falta de capacitación',
    descripcion: 'Personal sin formación en seguridad informática',
    valor: NivelVulnerabilidad.MEDIO,
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const amenazaService = app.get(AmenazaService);
    const vulnerabilidadService = app.get(VulnerabilidadService);

    console.log('🌱 Iniciando seed de datos...');

    // Crear amenazas
    console.log('📋 Creando amenazas...');
    for (const amenazaData of datosAmenazas) {
      try {
        await amenazaService.crear(amenazaData);
        console.log(`✅ Amenaza creada: ${amenazaData.nombre}`);
      } catch (error) {
        if (error.message.includes('Ya existe')) {
          console.log(`⚠️  Amenaza ya existe: ${amenazaData.nombre}`);
        } else {
          console.error(`❌ Error creando amenaza ${amenazaData.nombre}:`, error.message);
        }
      }
    }

    // Crear vulnerabilidades
    console.log('🔓 Creando vulnerabilidades...');
    for (const vulnerabilidadData of datosVulnerabilidades) {
      try {
        await vulnerabilidadService.crear(vulnerabilidadData);
        console.log(`✅ Vulnerabilidad creada: ${vulnerabilidadData.nombre}`);
      } catch (error) {
        if (error.message.includes('Ya existe')) {
          console.log(`⚠️  Vulnerabilidad ya existe: ${vulnerabilidadData.nombre}`);
        } else {
          console.error(`❌ Error creando vulnerabilidad ${vulnerabilidadData.nombre}:`, error.message);
        }
      }
    }

    console.log('🎉 Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await app.close();
  }
}

seed();
