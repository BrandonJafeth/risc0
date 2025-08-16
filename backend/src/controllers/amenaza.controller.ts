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
import { AmenazaService } from '../services/amenaza.service';
import { CrearAmenazaDto, ActualizarAmenazaDto, CambiarEstadoAmenazaDto } from '../dto/amenaza.dto';
import { Amenaza } from '../entities/amenaza.entity';

@Controller('amenazas')
export class AmenazaController {
  constructor(private readonly amenazaService: AmenazaService) {}

  @Get()
  async listar(
    @Query('activo') activo?: string,
    @Query('q') q?: string,
  ): Promise<Amenaza[]> {
    const activoBoolean = activo === 'true' ? true : activo === 'false' ? false : undefined;
    return this.amenazaService.listar(activoBoolean, q);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() crearAmenazaDto: CrearAmenazaDto): Promise<Amenaza> {
    return this.amenazaService.crear(crearAmenazaDto);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarAmenazaDto: ActualizarAmenazaDto,
  ): Promise<Amenaza> {
    return this.amenazaService.actualizar(id, actualizarAmenazaDto);
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body() cambiarEstadoDto: CambiarEstadoAmenazaDto,
  ): Promise<Amenaza> {
    return this.amenazaService.cambiarEstado(id, cambiarEstadoDto.activo);
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string): Promise<Amenaza> {
    return this.amenazaService.obtenerPorId(id);
  }
}
