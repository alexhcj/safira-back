import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ShelfLifeUnitEnum } from '../enums/shelf-life-unit.enum';
import { ICompanyData } from '../interfaces/specifications/company.interface';

export class CreateSpecificationsDto {
  @IsNotEmpty()
  @IsString()
  readonly company: string;

  @IsOptional()
  @IsString()
  readonly producingCountry?: string;

  @IsNotEmpty()
  @IsObject()
  readonly shelfLife: {
    value: number;
    unit: ShelfLifeUnitEnum;
  };

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
  @IsObject()
  readonly shelfLife?: {
    value: number;
    unit: ShelfLifeUnitEnum;
  };

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;
}
