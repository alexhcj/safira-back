import { IsOptional, IsString, Matches } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  readonly avatarId?: Types.ObjectId;

  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateOfBirth must be in YYYY-MM-DD format',
  })
  @Transform(({ value }) => {
    if (!value) return value;

    // if it's a full ISO string, extract date part
    if (typeof value === 'string' && value.includes('T')) {
      return value.split('T')[0];
    }

    return value;
  })
  readonly dateOfBirth?: string;

  @IsString()
  @IsOptional()
  readonly location?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;
}
