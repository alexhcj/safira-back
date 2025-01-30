import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UserHashedDto {
  readonly email: string;
  readonly passwordHash: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  passwordHash?: string;
}

export class FindProfileRO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsISO8601()
  dateOfBirth: Date;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  avatarId: string;
}
