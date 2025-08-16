import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amenaza } from './entities/amenaza.entity';
import { Vulnerabilidad } from './entities/vulnerabilidad.entity';
import { Riesgo } from './entities/riesgo.entity';
import { AmenazaController } from './controllers/amenaza.controller';
import { VulnerabilidadController } from './controllers/vulnerabilidad.controller';
import { RiesgoController } from './controllers/riesgo.controller';
import { AmenazaService } from './services/amenaza.service';
import { VulnerabilidadService } from './services/vulnerabilidad.service';
import { RiesgoService } from './services/riesgo.service';
import { CalculoRiesgoService } from './services/calculo-riesgo.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || './data.sqlite',
      entities: [Amenaza, Vulnerabilidad, Riesgo],
      synchronize: true, // Solo para desarrollo
      logging: false,
    }),
    TypeOrmModule.forFeature([Amenaza, Vulnerabilidad, Riesgo]),
  ],
  controllers: [AmenazaController, VulnerabilidadController, RiesgoController],
  providers: [AmenazaService, VulnerabilidadService, RiesgoService, CalculoRiesgoService],
})
export class AppModule {}
