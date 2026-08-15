import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDataDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  normalizedName?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
