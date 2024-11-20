import { VerifyEmailDto } from '../dto/emailer.dto';

export interface IEmailer {
  sendVerifyEmail(data: VerifyEmailDto): Promise<void>;
  sendSuccessVerifyEmail(email: string): Promise<void>;
}
