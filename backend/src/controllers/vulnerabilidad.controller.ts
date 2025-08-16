import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VulnerabilidadService } from '../services/vulnerabilidad.service';
import { CrearVulnerabilidadDto, ActualizarVulnerabilidadDto, CambiarEstadoVulnerabilidadDto } from '../dto/vulnerabilidad.dto';
import { Vulnerabilidad } from '../entities/vulnerabilidad.entity';

@Controller('vulnerabilidades')
export class VulnerabilidadController {
  constructor(private readonly vulnerabilidadService: VulnerabilidadService) {}

  @Get()
  async listar(
    @Query('activo') activo?: string,
    @Query('q') q?: string,
  ): Promise<Vulnerabilidad[]> {
    const activoBoolean = activo === 'true' ? true : activo === 'false' ? false : undefined;
    return this.vulnerabilidadService.listar(activoBoolean, q);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() crearVulnerabilidadDto: CrearVulnerabilidadDto): Promise<Vulnerabilidad> {
    return this.vulnerabilidadService.crear(crearVulnerabilidadDto);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarVulnerabilidadDto: ActualizarVulnerabilidadDto,
  ): Promise<Vulnerabilidad> {
    return this.vulnerabilidadService.actualizar(id, actualizarVulnerabilidadDto);
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body() cambiarEstadoDto: CambiarEstadoVulnerabilidadDto,
  ): Promise<Vulnerabilidad> {
    return this.vulnerabilidadService.cambiarEstado(id, cambiarEstadoDto.activo);
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string): Promise<Vulnerabilidad> {
    return this.vulnerabilidadService.obtenerPorId(id);
  }
}
