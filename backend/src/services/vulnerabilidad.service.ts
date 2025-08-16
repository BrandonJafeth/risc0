import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Vulnerabilidad } from '../entities/vulnerabilidad.entity';
import { CrearVulnerabilidadDto, ActualizarVulnerabilidadDto } from '../dto/vulnerabilidad.dto';

@Injectable()
export class VulnerabilidadService {
  constructor(
    @InjectRepository(Vulnerabilidad)
    private vulnerabilidadRepository: Repository<Vulnerabilidad>,
  ) {}

  async crear(crearVulnerabilidadDto: CrearVulnerabilidadDto): Promise<Vulnerabilidad> {
    const vulnerabilidadExistente = await this.vulnerabilidadRepository.findOne({
      where: { nombre: crearVulnerabilidadDto.nombre },
    });

    if (vulnerabilidadExistente) {
      throw new ConflictException('Ya existe una vulnerabilidad con ese nombre');
    }

    const vulnerabilidad = this.vulnerabilidadRepository.create(crearVulnerabilidadDto);
    return this.vulnerabilidadRepository.save(vulnerabilidad);
  }

  async listar(activo?: boolean, q?: string): Promise<Vulnerabilidad[]> {
    const whereConditions: any = {};

    if (activo !== undefined) {
      whereConditions.activo = activo;
    }

    if (q) {
      whereConditions.nombre = Like(`%${q}%`);
    }

    return this.vulnerabilidadRepository.find({
      where: whereConditions,
      order: { nombre: 'ASC' },
    });
  }

  async obtenerPorId(id: string): Promise<Vulnerabilidad> {
    const vulnerabilidad = await this.vulnerabilidadRepository.findOne({ where: { id } });
    if (!vulnerabilidad) {
      throw new NotFoundException(`Vulnerabilidad con ID ${id} no encontrada`);
    }
    return vulnerabilidad;
  }

  async actualizar(id: string, actualizarVulnerabilidadDto: ActualizarVulnerabilidadDto): Promise<Vulnerabilidad> {
    const vulnerabilidad = await this.obtenerPorId(id);

    if (actualizarVulnerabilidadDto.nombre && actualizarVulnerabilidadDto.nombre !== vulnerabilidad.nombre) {
      const vulnerabilidadExistente = await this.vulnerabilidadRepository.findOne({
        where: { nombre: actualizarVulnerabilidadDto.nombre },
      });

      if (vulnerabilidadExistente) {
        throw new ConflictException('Ya existe una vulnerabilidad con ese nombre');
      }
    }

    Object.assign(vulnerabilidad, actualizarVulnerabilidadDto);
    return this.vulnerabilidadRepository.save(vulnerabilidad);
  }

  async cambiarEstado(id: string, activo: boolean): Promise<Vulnerabilidad> {
    const vulnerabilidad = await this.obtenerPorId(id);
    vulnerabilidad.activo = activo;
    return this.vulnerabilidadRepository.save(vulnerabilidad);
  }

  async eliminar(id: string): Promise<void> {
    const vulnerabilidad = await this.obtenerPorId(id);
    await this.vulnerabilidadRepository.remove(vulnerabilidad);
  }
}
