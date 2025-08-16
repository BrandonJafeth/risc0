import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Amenaza } from '../entities/amenaza.entity';
import { CrearAmenazaDto, ActualizarAmenazaDto } from '../dto/amenaza.dto';

@Injectable()
export class AmenazaService {
  constructor(
    @InjectRepository(Amenaza)
    private amenazaRepository: Repository<Amenaza>,
  ) {}

  async crear(crearAmenazaDto: CrearAmenazaDto): Promise<Amenaza> {
    const amenazaExistente = await this.amenazaRepository.findOne({
      where: { nombre: crearAmenazaDto.nombre },
    });

    if (amenazaExistente) {
      throw new ConflictException('Ya existe una amenaza con ese nombre');
    }

    const amenaza = this.amenazaRepository.create(crearAmenazaDto);
    return this.amenazaRepository.save(amenaza);
  }

  async listar(activo?: boolean, q?: string): Promise<Amenaza[]> {
    const whereConditions: any = {};

    if (activo !== undefined) {
      whereConditions.activo = activo;
    }

    if (q) {
      whereConditions.nombre = Like(`%${q}%`);
    }

    return this.amenazaRepository.find({
      where: whereConditions,
      order: { nombre: 'ASC' },
    });
  }

  async obtenerPorId(id: string): Promise<Amenaza> {
    const amenaza = await this.amenazaRepository.findOne({ where: { id } });
    if (!amenaza) {
      throw new NotFoundException(`Amenaza con ID ${id} no encontrada`);
    }
    return amenaza;
  }

  async actualizar(id: string, actualizarAmenazaDto: ActualizarAmenazaDto): Promise<Amenaza> {
    const amenaza = await this.obtenerPorId(id);

    if (actualizarAmenazaDto.nombre && actualizarAmenazaDto.nombre !== amenaza.nombre) {
      const amenazaExistente = await this.amenazaRepository.findOne({
        where: { nombre: actualizarAmenazaDto.nombre },
      });

      if (amenazaExistente) {
        throw new ConflictException('Ya existe una amenaza con ese nombre');
      }
    }

    Object.assign(amenaza, actualizarAmenazaDto);
    return this.amenazaRepository.save(amenaza);
  }

  async cambiarEstado(id: string, activo: boolean): Promise<Amenaza> {
    const amenaza = await this.obtenerPorId(id);
    amenaza.activo = activo;
    return this.amenazaRepository.save(amenaza);
  }

  async eliminar(id: string): Promise<void> {
    const amenaza = await this.obtenerPorId(id);
    await this.amenazaRepository.remove(amenaza);
  }
}
