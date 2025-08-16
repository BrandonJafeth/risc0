import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Amenaza } from './amenaza.entity';
import { Vulnerabilidad } from './vulnerabilidad.entity';

export enum NivelRiesgo {
  BAJO = 'Bajo',
  MEDIO = 'Medio',
  ALTO = 'Alto',
  CRITICO = 'Crítico',
}

@Entity('riesgos')
export class Riesgo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'amenaza_id' })
  amenazaId: string;

  @Column({ type: 'uuid', name: 'vulnerabilidad_id' })
  vulnerabilidadId: string;

  @Column({ type: 'int', comment: 'Puntaje calculado: amenaza.valor * vulnerabilidad.valor' })
  puntaje: number;

  @Column({
    type: 'varchar',
    length: 20,
    enum: NivelRiesgo,
    comment: 'Nivel de riesgo calculado según matriz',
  })
  nivel: NivelRiesgo;

  @Column({ type: 'varchar', length: 7, name: 'color_hex', comment: 'Color hexadecimal del nivel' })
  colorHex: string;

  @CreateDateColumn({ type: 'datetime', name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Amenaza, (amenaza) => amenaza.riesgos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'amenaza_id' })
  amenaza: Amenaza;

  @ManyToOne(() => Vulnerabilidad, (vulnerabilidad) => vulnerabilidad.riesgos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vulnerabilidad_id' })
  vulnerabilidad: Vulnerabilidad;
}
