import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class VerificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  isPrivacyConfirmed: boolean;
}
