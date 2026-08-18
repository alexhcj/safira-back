import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { BrandStatusEnum } from '../enums/brand-status.enum';
import { BrandTypeEnum } from '../enums/brand-type.enum';

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  readonly displayName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly aliases?: string[];

  @IsOptional()
  @IsString()
  readonly logo?: string;

  @IsOptional()
  @IsString()
  readonly previewImage?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly website?: string;

  @IsOptional()
  @IsString()
  readonly location?: string;

  @IsOptional()
  @IsEnum(BrandTypeEnum)
  readonly type?: BrandTypeEnum;

  @IsOptional()
  @IsEnum(BrandStatusEnum)
  readonly status?: BrandStatusEnum;

  @IsOptional()
  @IsString()
  readonly source?: string; // 'migration' | 'self_registered' | 'admin_created'
}
