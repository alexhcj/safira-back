import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { EmailerController } from './emailer.controller';
import { GeneratorsModule } from '../utils/generators/generators.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('emailer.host'),
          port: +configService.get<number>('emailer.port'),
          secure: true,
          auth: {
            user: configService.get<string>('emailer.user'),
            pass: configService.get<string>('emailer.pass'),
          },
          // tls: {
          //   rejectUnauthorized: true,
          // },
        },
        // defaults: {
        //   from: '"No Reply" <no-reply@localhost>',
        // },
        // preview: true,
        // template: {
        //   dir: process.cwd() + '/src/emailer/templates',
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // new HandlebarsAdapter(/* helpers */ undefined, {
        //   inlineCssEnabled: true,
        //   /** See https://www.npmjs.com/package/inline-css#api */
        //   inlineCssOptions: {
        //     url: ' ',
        //     preserveMediaQueries: true,
        //   },
        // });
        // },
        // options: {
        //   partials: {
        //     dir: process.cwd() + '/src/emailer/templates/partials',
        //     options: {
        //       strict: true,
        //     },
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
    GeneratorsModule,
  ],
  controllers: [EmailerController],
  providers: [EmailerService],
  exports: [EmailerService],
})
export class EmailerModule {}
