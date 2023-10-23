import { IsISO8601, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateProfileDto {
  @IsOptional()
  readonly avatarId?: Types.ObjectId;

  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsISO8601()
  @IsOptional()
  readonly dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  readonly location?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;
}
