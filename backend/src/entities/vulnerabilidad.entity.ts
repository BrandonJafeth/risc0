import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Riesgo } from './riesgo.entity';

export enum NivelVulnerabilidad {
  MUY_BAJO = 1,
  BAJO = 2,
  MEDIO = 3,
  ALTO = 4,
  MUY_ALTO = 5,
}

@Entity('vulnerabilidades')
export class Vulnerabilidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'int',
    enum: NivelVulnerabilidad,
    comment: 'Valor del 1 al 5 representando el nivel de vulnerabilidad',
  })
  valor: NivelVulnerabilidad;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => Riesgo, (riesgo) => riesgo.vulnerabilidad)
  riesgos: Riesgo[];
}
