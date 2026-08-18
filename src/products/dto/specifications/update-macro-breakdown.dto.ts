import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateMacroBreakdownDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly total?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly saturated?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly mono?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly poly?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly trans?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly sugars?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly fibre?: number;
}
