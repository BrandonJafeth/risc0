import { IsString, IsInt, IsOptional, IsBoolean, Min, Max, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { NivelVulnerabilidad } from '../entities/vulnerabilidad.entity';

export class CrearVulnerabilidadDto {
  @IsString()
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @Type(() => Number)
  @IsInt({ message: 'El valor debe ser un número entero' })
  @Min(1, { message: 'El valor mínimo es 1' })
  @Max(5, { message: 'El valor máximo es 5' })
  valor: NivelVulnerabilidad;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activo?: boolean;
}

export class ActualizarVulnerabilidadDto {
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El valor debe ser un número entero' })
  @Min(1, { message: 'El valor mínimo es 1' })
  @Max(5, { message: 'El valor máximo es 5' })
  valor?: NivelVulnerabilidad;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activo?: boolean;
}

export class CambiarEstadoVulnerabilidadDto {
  @Type(() => Boolean)
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  activo: boolean;
}
