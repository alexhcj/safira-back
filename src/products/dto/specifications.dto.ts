import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ICompanyData } from '../interfaces/company.interface';

export class CreateSpecificationsDto {
  @IsNotEmpty()
  @IsString()
  readonly company: string;

  @IsOptional()
  @IsString()
  readonly producingCountry: string;

  @IsNotEmpty()
  @IsDateString()
  readonly shelfLife: Date;

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;
}

export class UpdateSpecificationsDto {
  @IsOptional()
  @IsString()
  readonly company?: ICompanyData;

  @IsOptional()
  @IsString()
  readonly producingCountry?: string;

  @IsOptional()
  @IsDateString()
  readonly shelfLife?: Date;

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;
}
