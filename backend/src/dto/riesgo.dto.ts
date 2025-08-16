import { IsUUID, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearRiesgoDto {
  @IsUUID('4', { message: 'El ID de amenaza debe ser un UUID válido' })
  amenazaId: string;

  @IsUUID('4', { message: 'El ID de vulnerabilidad debe ser un UUID válido' })
  vulnerabilidadId: string;
}

export class FiltrosRiesgoDto {
  @IsOptional()
  @IsString()
  nivel?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(25)
  max?: number;

  @IsOptional()
  @IsString()
  desde?: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  hasta?: string; // YYYY-MM-DD

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
