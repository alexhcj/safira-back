import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateStorageInformationDto {
  @IsNotEmpty()
  @IsString()
  readonly instructions: string;

  @IsOptional()
  @IsNumber()
  @Min(-30)
  @Max(60)
  readonly maxTempCelsius?: number;
}
