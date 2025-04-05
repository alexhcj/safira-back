import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as brevo from '@getbrevo/brevo';
import { IEmailer } from './interfaces/emailer.interface';
import { SendChangePasswordErrorDto, VerifyEmailDto } from './dto/emailer.dto';
import {
  SubscriptionTemplateIdEnum,
  VerifyEmailTemplateIdEnum,
} from './enums/emailer.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueEnum } from './enums/queu.enum';
import { UsersService } from '../users/users.service';
import {
  SendSubscribedAuthorRO,
  SendSubscribedOnboardRO,
  SendSubscribedSuccessccRO,
  SendSubscribedSuccessDto,
  SendWeeklyProductsRO,
  SubscribeUserDto,
  SubscribeUserRO,
  UnsubscribeUserDto,
  UnsubscribeUserRO,
  UpdateSubscriptionDto,
  UpdateSubscriptionRO,
} from './dto/subscription.dto';
import {
  Subscription,
  SubscriptionDocument,
} from './scheme/subscription.scheme';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobEnum } from './enums/job.enum';
import { SubscribeEmailsChainTimingsEnum } from './enums/subscription.enum';
import * as fs from 'node:fs';
import Handlebars from 'handlebars';
import { ProductsService } from '../products/products.service';

const path = require('node:path');

@Injectable()
export class EmailerService implements IEmailer {
  constructor(
    @InjectModel(Subscription.name)
    private _subscriptionModel: Model<SubscriptionDocument>,
    private readonly configService: ConfigService,
    @InjectQueue(QueueEnum.EMAILER_QUEUE) private _emailerQueue: Queue,
    private readonly userService: UsersService,
    private readonly _productsService: ProductsService,
  ) {}

  // TRANSACTIONAL
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

  public async sendChangePasswordError({
    email,
    browser,
    os,
    name,
  }: SendChangePasswordErrorDto): Promise<void> {
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
      smtpEmail.params = {
        EMAIL: email,
        NAME: name,
        BROWSER: browser,
        OS: os,
      };

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

  // SUBSCRIPTIONS
  public async subscribeUser(data: SubscribeUserDto): Promise<SubscribeUserRO> {
    const email = await this._findSubscriptionByEmail(data.email);

    if (email)
      throw new HttpException(
        'Email already subscribed.',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.userService.findByEmailWithProfile(data.email);

    const subscriptionData = {
      email: data.email,
      userId: user.user._id,
    };

    const entity = await new this._subscriptionModel(subscriptionData).save();

    if (entity) {
      const profileLink = `${this.configService.get<string>(
        'client.clientUrl',
      )}/profile`;

      const subscribedSuccessData = {
        name: user.profile.firstName ?? 'Customer',
        profileLink,
        email: entity.email,
      };

      await this._emailerQueue.add(
        JobEnum.SUBSCRIBE_SUCCESS,
        subscribedSuccessData,
      );
      await this._emailerQueue.add(
        JobEnum.SUBSCRIBE_ONBOARD,
        { email: entity.email },
        { delay: SubscribeEmailsChainTimingsEnum.SUBSCRIBED_ONBOARD },
      );
      await this._emailerQueue.add(
        JobEnum.SUBSCRIBE_AUTHOR,
        { email: entity.email },
        { delay: SubscribeEmailsChainTimingsEnum.SUBSCRIBED_AUTHOR },
      );
      await this._emailerQueue.add(
        JobEnum.MOST_POPULAR_PRODUCTS,
        { email: entity.email },
        { delay: SubscribeEmailsChainTimingsEnum.MOST_POPULAR_PRODUCTS },
      );

      return {
        message: HttpStatus.CREATED,
      };
    } else {
      return {
        message: HttpStatus.CONFLICT,
      };
    }
  }

  public async updateSubscription(
    email: string,
    data: UpdateSubscriptionDto,
  ): Promise<UpdateSubscriptionRO> {
    const entity = await this._findSubscriptionByEmail(email);

    if (!entity)
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);

    const updatedData: UpdateSubscriptionDto = Object.assign(entity, data);

    const updatedEntity = await new this._subscriptionModel(updatedData).save();

    if (updatedEntity) {
      return {
        message: HttpStatus.CREATED,
      };
    } else {
      return {
        message: HttpStatus.CONFLICT,
      };
    }
  }

  public async unsubscribeUser(
    userId: string,
    data: UnsubscribeUserDto,
  ): Promise<UnsubscribeUserRO> {
    const user = await this.userService.findById(userId);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (data.email !== user.email)
      throw new HttpException('Emails not equal', HttpStatus.BAD_REQUEST);

    const deletedEntity = await this._findSubscriptionByEmailAndDelete(
      data.email,
    );

    if (!deletedEntity)
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);

    return {
      message: HttpStatus.OK,
    };
  }

  public async sendSubscribedSuccess({
    email,
    profileLink,
    name,
  }: SendSubscribedSuccessDto): Promise<SendSubscribedSuccessccRO> {
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
        PROFILE_LINK: profileLink,
        NAME: name,
      };
      smtpEmail.templateId = SubscriptionTemplateIdEnum.SUBSCRIBED_SUCCESS;

      await apiInstance.sendTransacEmail(smtpEmail);

      return {
        message: HttpStatus.OK,
      };
    } catch (error) {
      console.error(error);
    }
  }

  public async sendSubscribedOnboard(
    email: string,
  ): Promise<SendSubscribedOnboardRO> {
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
      smtpEmail.templateId = SubscriptionTemplateIdEnum.SUBSCRIBED_ONBOARD;

      await apiInstance.sendTransacEmail(smtpEmail);

      return {
        message: HttpStatus.OK,
      };
    } catch (error) {
      console.error(error);
    }
  }

  public async sendSubscribedAuthor(
    email: string,
  ): Promise<SendSubscribedAuthorRO> {
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
      smtpEmail.templateId = SubscriptionTemplateIdEnum.SUBSCRIBED_AUTHOR;

      await apiInstance.sendTransacEmail(smtpEmail);

      return {
        message: HttpStatus.OK,
      };
    } catch (error) {
      console.error(error);
    }
  }

  // CAMPAIGNS (temporary transaction)
  public async sendMostPopularProducts({
    email,
  }): Promise<SendWeeklyProductsRO> {
    const products = await this._productsService.findTopTenPopular();
    const clientBaseUrl = `${this.configService.get<string>(
      'client.clientUrl',
    )}`;
    const apiBaseUrl = `${this.configService.get<string>('api.apiUrl')}`;
    const apiBaseWithPrefixUrl = `${this.configService.get<string>(
      'api.apiUrl',
    )}/${this.configService.get<string>('api.globalPrefix')}`;
    const templateData = {
      logoLink: `${apiBaseUrl}/public/images/emails/logo.png`,
      products: products.map((product) => {
        return {
          ...product,
          slug: product.slug,
          name: product.name,
          link: `${clientBaseUrl}/products/${product.slug}`,
          image: `${apiBaseUrl}/public/images/products/${product.slug}/225x225.jpg`,
        };
      }),
      storeLink: `${clientBaseUrl}/shop`,
      socials: [
        {
          src: `${apiBaseUrl}/public/images/emails/telegram.svg`,
          link: 'https://t.me/alex_hcj',
          name: 'telegram',
        },
        {
          src: `${apiBaseUrl}/public/images/emails/github.svg`,
          link: 'https://github.com/alexhcj',
          name: 'github',
        },
        {
          src: `${apiBaseUrl}/public/images/emails/vk.svg`,
          link: 'https://vk.com/alex_hcj',
          name: 'vk',
        },
      ],
      unsubscribeLink: `${apiBaseWithPrefixUrl}}/unsubscribe-user`,
    };
    const templateName = path.resolve(
      __dirname,
      '..',
      '..',
      'src',
      'emailer',
      'templates/most-popular-products-html.html',
    );
    const templateHtml = fs.readFileSync(templateName, 'utf8');
    const template = Handlebars.compile(templateHtml);
    const htmlContent = template(templateData);

    const apiInstance = this._createEmailApiInstance();

    try {
      const smtpEmail = new brevo.SendSmtpEmail();

      smtpEmail.subject = 'Top 10 most popular products';
      smtpEmail.htmlContent = htmlContent;
      smtpEmail.sender = {
        name: this.configService.get<string>('emailer.senderName'),
        email: this.configService.get<string>('emailer.senderEmail'),
      };
      smtpEmail.to = [{ email: email }];
      smtpEmail.replyTo = {
        email: this.configService.get<string>('emailer.senderEmail'),
        name: this.configService.get<string>('emailer.senderName'),
      };

      await apiInstance.sendTransacEmail(smtpEmail);

      return {
        message: HttpStatus.OK,
      };
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

  // BASIC METHODS
  private async _findSubscriptionByEmail(
    email: string,
  ): Promise<SubscriptionDocument> {
    return await this._subscriptionModel.findOne({ email }).exec();
  }

  // TODO: fix return type
  private async _findSubscriptionByEmailAndDelete(email: string): Promise<any> {
    return this._subscriptionModel.findOneAndDelete({ email }).exec();
  }
}
