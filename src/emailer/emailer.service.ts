import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as brevo from '@getbrevo/brevo';
import { IEmailer } from './interfaces/emailer.interface';
import { VerifyEmailDto } from './dto/emailer.dto';

@Injectable()
export class EmailerService implements IEmailer {
  constructor(private readonly configService: ConfigService) {}

  public async sendVerifyEmail(data: VerifyEmailDto): Promise<void> {
    const apiInstance = this._createEmailApiInstance();

    try {
      const smtpEmail = new brevo.SendSmtpEmail();

      smtpEmail.sender = {
        name: this.configService.get<string>('emailer.senderName'),
        email: this.configService.get<string>('emailer.senderEmail'),
      };
      smtpEmail.to = [{ email: data.email }];
      smtpEmail.replyTo = {
        email: this.configService.get<string>('emailer.senderEmail'),
        name: this.configService.get<string>('emailer.senderName'),
      };
      smtpEmail.templateId = 7;
      smtpEmail.params = {
        CODE: data.code,
      };

      await apiInstance.sendTransacEmail(smtpEmail);
    } catch (error) {
      console.error(error);
    }
  }

  public async sendSuccessVerifyEmail(email: string): Promise<void> {
    const apiInstance = this._createEmailApiInstance();

    try {
      const smtpEmail = new brevo.SendSmtpEmail();

      smtpEmail.sender = {
        name: this.configService.get<string>('emailer.senderName'),
        email: this.configService.get<string>('emailer.senderEmail'),
      };
      smtpEmail.to = [{ email }];
      smtpEmail.replyTo = {
        email: this.configService.get<string>('emailer.senderEmail'),
        name: this.configService.get<string>('emailer.senderName'),
      };
      smtpEmail.templateId = 9;

      await apiInstance.sendTransacEmail(smtpEmail);
    } catch (error) {
      console.error(error);
    }
  }

  private _createEmailApiInstance() {
    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      this.configService.get<string>('emailer.brevoApiKey'),
    );

    return apiInstance;
  }
}
