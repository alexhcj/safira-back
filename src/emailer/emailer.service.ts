import { Injectable } from '@nestjs/common';
import { GeneratorsService } from '../utils/generators/generators.service';
import { MailerService } from '@nestjs-modules/mailer';

import { TestEmailDto } from './dto/emailer.dto';
import { IEmailer } from './interfaces/emailer.interface';

@Injectable()
export class EmailerService implements IEmailer {
  constructor(
    private readonly emailerService: MailerService,
    private readonly generatorsService: GeneratorsService,
  ) {}

  public example(data: TestEmailDto): void {
    console.log(data);
    // const code = this.generatorsService.generateRandomNumbers(6);

    this.emailerService
      .sendMail({
        from: 'alexhcj@yandex.ru',
        to: 'yameda9833@gianes.com',
        subject: 'Verify email',
        text: '<b>welcome</b>',
        // context: {
        //   code: code,
        // },
        html: '<p>this is html text</p>',
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // public example2(data: TestEmailDto): void {
  //   const code = this.generatorsService.generateRandomNumbers(6);
  //
  //   this.emailerService
  //     .sendMail({
  //       to: data.email,
  //       from: 'alexeykorolyov19@gmail.com',
  //       subject: 'Verify email',
  //       template: './verify-email',
  //       attachments: [
  //         {
  //           filename: 'verify-email.png',
  //           path: process.cwd() + '/public/images/emails/verify-email.png',
  //           cid: 'verify-email',
  //         },
  //         {
  //           filename: 'logo.png',
  //           path: process.cwd() + '/public/images/logo/logo.png',
  //           cid: 'logo',
  //         },
  //       ],
  //       context: {
  //         code,
  //         email: 'john@gmail.com',
  //       },
  //     })
  //     .then(() => {})
  //     .catch((error) => {
  //       console.log(error);
  //
  //       throw new InternalServerErrorException(error);
  //     });
  // }

  // async sendMail(datamailer): Promise<void> {
  //   const render = this._bodytemplete(
  //     datamailer.templete,
  //     datamailer.dataTemplete,
  //   );
  //   await this._processSendEmail(
  //     datamailer.to,
  //     datamailer.subject,
  //     datamailer.text,
  //     render,
  //   );
  // }

  // sendMailSandBox
  // async test(email: TestEmailDto): Promise<void> {
  //   const templateFile = path.join(
  //     __dirname,
  //     '../../src/email-server/templete/notification.pug',
  //   );
  //   const fileImg = path.join(
  //     __dirname,
  //     '../../src/email-server/public/img/amico.png',
  //   );
  //   const socialMediaImg = path.join(
  //     __dirname,
  //     '../../src/email-server/public/img/social-media.png',
  //   );
  //   const imageData = readFileSync(fileImg).toString('base64');
  //   const imageDataSocialMedia =
  //     readFileSync(socialMediaImg).toString('base64');
  //
  //   const data = {
  //     title: 'My title',
  //     img: imageData,
  //     myDescription: 'description',
  //     imgSocial: imageDataSocialMedia,
  //   };
  //
  //   const render = this._bodytemplete(templateFile, data);
  //   await this._processSendEmail(email.to, email.subject, email.text, render);
  // }
  //
  // _bodytemplete(templete, data) {
  //   return pug.renderFile(templete, { data });
  // }
  //
  // async _processSendEmail(to, subject, text, body): Promise<void> {
  //   await this.emailerService
  //     .sendMail({
  //       to: to,
  //       subject: subject,
  //       text: text,
  //       html: body,
  //     })
  //     .then(() => {
  //       console.log('Email sent');
  //     })
  //     .catch((e) => {
  //       console.log('Error sending email', e);
  //     });
  // }

  //     SEND VERIFY EMAIL
  //     SEND CONFIRM EMAIL
}
