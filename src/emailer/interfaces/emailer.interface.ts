import { VerifyEmailDto } from '../dto/emailer.dto';

export interface IEmailer {
  sendVerifyEmail(data: VerifyEmailDto): Promise<void>;
  sendVerifyEmailSuccess(email: string): Promise<void>;
}
