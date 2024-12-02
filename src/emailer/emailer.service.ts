import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as brevo from '@getbrevo/brevo';
import { IEmailer } from './interfaces/emailer.interface';
import { VerifyEmailDto } from './dto/emailer.dto';
import { VerifyEmailTemplateIdEnum } from './enum/emailer.enum';

@Injectable()
export class EmailerService implements IEmailer {
  constructor(private readonly configService: ConfigService) {}

  // sends verify code for one of template types: signup | change-email | change-passowrd
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
      smtpEmail.templateId = data.type;
      smtpEmail.params = {
        CODE: data.code,
        EMAIL: data.email,
      };

      await apiInstance.sendTransacEmail(smtpEmail);
    } catch (error) {
      console.error(error);
    }
  }

  public async sendVerifyEmailSuccess(email: string): Promise<void> {
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
      smtpEmail.templateId = VerifyEmailTemplateIdEnum.SIGN_UP_SUCCESS;

      await apiInstance.sendTransacEmail(smtpEmail);
    } catch (error) {
      console.error(error);
    }
  }

  public async sendChangeEmailSuccess(email: string): Promise<void> {
    const apiInstance = this._createEmailApiInstance();

    try {
      const smtpEmail = new brevo.SendSmtpEmail();

      smtpEmail.sender = {
        name: this.configService.get<string>('emailer.senderName'),
        email: this.configService.get<string>('emailer.senderEmail'),
      };
      smtpEmail.to = [{ email: email }];
      smtpEmail.replyTo = {
        email: this.configService.get<string>('emailer.senderEmail'),
        name: this.configService.get<string>('emailer.senderName'),
      };
      smtpEmail.templateId = VerifyEmailTemplateIdEnum.CHANGE_EMAIL_SUCCESS;

      await apiInstance.sendTransacEmail(smtpEmail);
    } catch (error) {
      console.error(error);
    }
  }

  public async sendChangePasswordError(email: string): Promise<void> {
    const apiInstance = this._createEmailApiInstance();

    try {
      const smtpEmail = new brevo.SendSmtpEmail();

      smtpEmail.sender = {
        name: this.configService.get<string>('emailer.senderName'),
        email: this.configService.get<string>('emailer.senderEmail'),
      };
      smtpEmail.to = [{ email: email }];
      smtpEmail.replyTo = {
        email: this.configService.get<string>('emailer.senderEmail'),
        name: this.configService.get<string>('emailer.senderName'),
      };
      smtpEmail.templateId = VerifyEmailTemplateIdEnum.CHANGE_PASSWORD_ERROR;

      await apiInstance.sendTransacEmail(smtpEmail);
    } catch (error) {
      console.error(error);
    }
  }

  public async sendChangePasswordLink(
    email: string,
    name: string,
    link: string,
  ): Promise<void> {
    const apiInstance = this._createEmailApiInstance();

    try {
      const smtpEmail = new brevo.SendSmtpEmail();

      smtpEmail.sender = {
        name: this.configService.get<string>('emailer.senderName'),
        email: this.configService.get<string>('emailer.senderEmail'),
      };
      smtpEmail.to = [{ email: email }];
      smtpEmail.replyTo = {
        email: this.configService.get<string>('emailer.senderEmail'),
        name: this.configService.get<string>('emailer.senderName'),
      };
      smtpEmail.params = {
        LINK: link,
        NAME: name,
      };
      smtpEmail.templateId = VerifyEmailTemplateIdEnum.CHANGE_PASSWORD_LINK;

      await apiInstance.sendTransacEmail(smtpEmail);
    } catch (error) {
      console.error(error);
    }
  }

  public async sendChangePasswordSuccess(email: string): Promise<void> {
    const apiInstance = this._createEmailApiInstance();

    try {
      const smtpEmail = new brevo.SendSmtpEmail();

      smtpEmail.sender = {
        name: this.configService.get<string>('emailer.senderName'),
        email: this.configService.get<string>('emailer.senderEmail'),
      };
      smtpEmail.to = [{ email: email }];
      smtpEmail.replyTo = {
        email: this.configService.get<string>('emailer.senderEmail'),
        name: this.configService.get<string>('emailer.senderName'),
      };
      smtpEmail.templateId = VerifyEmailTemplateIdEnum.CHANGE_PASSWORD_SUCCESS;

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
