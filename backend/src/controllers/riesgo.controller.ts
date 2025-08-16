import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RiesgoService } from '../services/riesgo.service';
import { CrearRiesgoDto, FiltrosRiesgoDto } from '../dto/riesgo.dto';
import { Riesgo } from '../entities/riesgo.entity';

@Controller('riesgos')
export class RiesgoController {
  constructor(private readonly riesgoService: RiesgoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() crearRiesgoDto: CrearRiesgoDto): Promise<Riesgo> {
    return this.riesgoService.crear(crearRiesgoDto);
  }

  @Get()
  async listar(@Query() filtros: FiltrosRiesgoDto) {
    return this.riesgoService.listar(filtros);
  }

  @Get('ultimos')
  async obtenerUltimos(@Query('limite') limite?: string) {
    const limiteNum = limite ? parseInt(limite) : 10;
    return this.riesgoService.obtenerUltimos(limiteNum);
  }

  @Get('estadisticas')
  async obtenerEstadisticas() {
    return this.riesgoService.obtenerEstadisticasPorNivel();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string): Promise<Riesgo> {
    return this.riesgoService.obtenerPorId(id);
  }
}
