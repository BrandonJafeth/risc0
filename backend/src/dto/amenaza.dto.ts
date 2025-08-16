import { IsString, IsInt, IsOptional, IsBoolean, Min, Max, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { NivelAmenaza } from '../entities/amenaza.entity';

export class CrearAmenazaDto {
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
  valor: NivelAmenaza;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activo?: boolean;
}

export class ActualizarAmenazaDto {
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
  valor?: NivelAmenaza;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activo?: boolean;
}

export class CambiarEstadoAmenazaDto {
  @Type(() => Boolean)
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  activo: boolean;
}
