import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Riesgo } from '../entities/riesgo.entity';
import { Amenaza } from '../entities/amenaza.entity';
import { Vulnerabilidad } from '../entities/vulnerabilidad.entity';
import { CalculoRiesgoService } from './calculo-riesgo.service';
import { CrearRiesgoDto, FiltrosRiesgoDto } from '../dto/riesgo.dto';

export interface ResultadoPaginado<T> {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

@Injectable()
export class RiesgoService {
  constructor(
    @InjectRepository(Riesgo)
    private riesgoRepository: Repository<Riesgo>,
    @InjectRepository(Amenaza)
    private amenazaRepository: Repository<Amenaza>,
    @InjectRepository(Vulnerabilidad)
    private vulnerabilidadRepository: Repository<Vulnerabilidad>,
    private calculoRiesgoService: CalculoRiesgoService,
  ) {}

  async crear(crearRiesgoDto: CrearRiesgoDto): Promise<Riesgo> {
    const amenaza = await this.amenazaRepository.findOne({
      where: { id: crearRiesgoDto.amenazaId },
    });

    if (!amenaza) {
      throw new NotFoundException(`Amenaza con ID ${crearRiesgoDto.amenazaId} no encontrada`);
    }

    const vulnerabilidad = await this.vulnerabilidadRepository.findOne({
      where: { id: crearRiesgoDto.vulnerabilidadId },
    });

    if (!vulnerabilidad) {
      throw new NotFoundException(`Vulnerabilidad con ID ${crearRiesgoDto.vulnerabilidadId} no encontrada`);
    }

    const resultadoCalculo = this.calculoRiesgoService.calcular(amenaza.valor, vulnerabilidad.valor);

    const riesgo = this.riesgoRepository.create({
      amenazaId: crearRiesgoDto.amenazaId,
      vulnerabilidadId: crearRiesgoDto.vulnerabilidadId,
      puntaje: resultadoCalculo.puntaje,
      nivel: resultadoCalculo.nivel,
      colorHex: resultadoCalculo.colorHex,
    });

    return this.riesgoRepository.save(riesgo);
  }

  async listar(filtros: FiltrosRiesgoDto): Promise<ResultadoPaginado<Riesgo>> {
    const {
      nivel,
      min,
      max,
      desde,
      hasta,
      page = 1,
      limit = 10,
    } = filtros;

    const queryBuilder = this.riesgoRepository
      .createQueryBuilder('riesgo')
      .leftJoinAndSelect('riesgo.amenaza', 'amenaza')
      .leftJoinAndSelect('riesgo.vulnerabilidad', 'vulnerabilidad')
      .orderBy('riesgo.creadoEn', 'DESC');

    if (nivel) {
      queryBuilder.andWhere('riesgo.nivel = :nivel', { nivel });
    }

    if (min !== undefined) {
      queryBuilder.andWhere('riesgo.puntaje >= :min', { min });
    }

    if (max !== undefined) {
      queryBuilder.andWhere('riesgo.puntaje <= :max', { max });
    }

    if (desde) {
      const fechaDesde = new Date(desde);
      queryBuilder.andWhere('riesgo.creadoEn >= :desde', { desde: fechaDesde });
    }

    if (hasta) {
      const fechaHasta = new Date(hasta);
      fechaHasta.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('riesgo.creadoEn <= :hasta', { hasta: fechaHasta });
    }

    const total = await queryBuilder.getCount();
    const totalPaginas = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const datos = await queryBuilder
      .skip(offset)
      .take(limit)
      .getMany();

    return {
      datos,
      total,
      pagina: page,
      limite: limit,
      totalPaginas,
    };
  }

  async obtenerPorId(id: string): Promise<Riesgo> {
    const riesgo = await this.riesgoRepository.findOne({
      where: { id },
      relations: ['amenaza', 'vulnerabilidad'],
    });

    if (!riesgo) {
      throw new NotFoundException(`Riesgo con ID ${id} no encontrado`);
    }

    return riesgo;
  }

  async obtenerUltimos(limite: number = 10): Promise<Riesgo[]> {
    return this.riesgoRepository.find({
      relations: ['amenaza', 'vulnerabilidad'],
      order: { creadoEn: 'DESC' },
      take: limite,
    });
  }

  async obtenerEstadisticasPorNivel(): Promise<{ nivel: string; total: number; colorHex: string }[]> {
    const estadisticas = await this.riesgoRepository
      .createQueryBuilder('riesgo')
      .select('riesgo.nivel', 'nivel')
      .addSelect('riesgo.colorHex', 'colorHex')
      .addSelect('COUNT(*)', 'total')
      .groupBy('riesgo.nivel')
      .addGroupBy('riesgo.colorHex')
      .getRawMany();

    return estadisticas.map((stat) => ({
      nivel: stat.nivel,
      total: parseInt(stat.total),
      colorHex: stat.colorHex,
    }));
  }
}
