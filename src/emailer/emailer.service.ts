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
  CreateFeedbackDto,
  CreateFeedbackRO,
  CreateSubscriptionDto,
  SendSubscribedAuthorRO,
  SendSubscribedOnboardDto,
  SendSubscribedOnboardRO,
  SendSubscribedSuccessDto,
  SendSubscribedSuccessRO,
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
import * as fs from 'node:fs';
import Handlebars from 'handlebars';
import { ProductsService } from '../products/products.service';
import {
  UnsubscribeCategoryEnum,
  UnsubscribeExpirationEnum,
} from './enums/unsubscribe.enum';
import * as bcrypt from 'bcrypt';

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

  // return existed subscription || create a new document with default values (unsubscribed)
  public async findSubscription(userId: string): Promise<SubscriptionDocument> {
    const existedSubscription = await this._subscriptionModel.findOne({
      userId,
    });

    if (!existedSubscription) {
      const user = await this.userService.findById(userId);

      const subscriptionDto: CreateSubscriptionDto = {
        userId: userId,
        email: user.email,
      };

      if (user) {
        return await this._create(subscriptionDto);
      }
    }

    return existedSubscription;
  }

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
  public async subscribeUser(
    userId: string,
    data: SubscribeUserDto,
  ): Promise<SubscribeUserRO> {
    const existedUser = await this.userService.findById(userId);

    if (!existedUser)
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    let subscription = await this._findSubscriptionByEmail(data.email);

    if (subscription) {
      const updateData = {
        devNews: true,
        blogNews: true,
        marketingNews: true,
      };

      await this.updateSubscription(data.email, updateData);
    }

    if (!subscription) {
      const subscriptionDto: CreateSubscriptionDto = {
        userId: userId,
        email: data.email,
        devNews: true,
        blogNews: true,
        marketingNews: true,
      };

      subscription = await this._create(subscriptionDto);
    }

    const user = await this.userService.findByEmailWithProfile(
      existedUser.email,
    );

    if (subscription) {
      const unsubLinks = await this._generateUnsubscribeLinks(
        userId,
        subscription.email,
      );

      const profileLink = `${this.configService.get<string>(
        'client.clientUrl',
      )}/profile`;

      const subscribedSuccessData = {
        name: user.profile.firstName ?? 'Customer',
        profileLink,
        email: subscription.email,
        unsubLink: unsubLinks.ALL,
      };
      await this._emailerQueue.add(
        JobEnum.SUBSCRIBE_SUCCESS,
        subscribedSuccessData,
      );

      const subscribedOnboardData = {
        email: subscription.email,
        unsubLink: unsubLinks.BLOG_NEWS,
      };
      await this._emailerQueue.add(
        JobEnum.SUBSCRIBE_ONBOARD,
        subscribedOnboardData,
        {
          delay: this.configService.get<number>(
            'emailer.timings.subscribedOnboard',
          ),
        },
      );

      const subscribedAuthorData = {
        email: subscription.email,
      };
      await this._emailerQueue.add(
        JobEnum.SUBSCRIBE_AUTHOR,
        subscribedAuthorData,
        {
          delay: this.configService.get<number>(
            'emailer.timings.subscribedAuthor',
          ),
        },
      );

      const subscribedMarketingData = {
        email: subscription.email,
        unsubLink: unsubLinks.MARKETING,
      };
      await this._emailerQueue.add(
        JobEnum.MOST_POPULAR_PRODUCTS,
        subscribedMarketingData,
        {
          delay: this.configService.get<number>(
            'emailer.timings.mostPopularProducts',
          ),
        },
      );

      return {
        message: 'Subscription created successfully.',
        statusCode: HttpStatus.CREATED,
      };
    } else {
      return {
        message: 'Subscription not created.',
        statusCode: HttpStatus.CONFLICT,
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
        message: 'Subscription has been updated.',
        statusCode: HttpStatus.CREATED,
      };
    } else {
      return {
        message: "Subscription hasn't been updated.",
        statusCode: HttpStatus.CONFLICT,
      };
    }
  }

  public async unsubscribeUser(
    userId: string,
    data: UnsubscribeUserDto,
  ): Promise<UnsubscribeUserRO> {
    const user = await this.userService.findById(userId);

    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    if (data.email !== user.email)
      throw new HttpException('Wrong email.', HttpStatus.CONFLICT);

    const res = await this.updateSubscription(data.email, data.campaigns);

    return res.statusCode === HttpStatus.CREATED
      ? {
          message: 'Subscription has been unsubscribed.',
          statusCode: HttpStatus.OK,
        }
      : {
          message: 'Subscription has not been unsubscribed.',
          statusCode: HttpStatus.CONFLICT,
        };
  }

  public async sendSubscribedSuccess({
    email,
    profileLink,
    name,
    unsubLink,
  }: SendSubscribedSuccessDto): Promise<SendSubscribedSuccessRO> {
    const apiInstance = this._createEmailApiInstance();
    const timingUnit =
      process.env.NODE_ENV === 'development' ? ' seconds' : ' minutes';
    const firstEmailTiming =
      (
        this.configService.get<number>('emailer.timings.subscribedOnboard') /
        1000
      ).toString() + timingUnit;
    const secondEmailTiming =
      (
        this.configService.get<number>('emailer.timings.subscribedAuthor') /
        1000
      ).toString() + timingUnit;

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
        FIRST_EMAIL_TIMING: firstEmailTiming,
        SECOND_EMAIL_TIMING: secondEmailTiming,
        UNSUB_LINK: unsubLink,
      };
      smtpEmail.templateId = SubscriptionTemplateIdEnum.SUBSCRIBED_SUCCESS;

      await apiInstance.sendTransacEmail(smtpEmail);

      return {
        message: 'Subscription has been sent.',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.error(error);
    }
  }

  public async sendSubscribedOnboard({
    email,
    unsubLink,
  }: SendSubscribedOnboardDto): Promise<SendSubscribedOnboardRO> {
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
        UNSUB_LINK: unsubLink,
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
    const products = await this._productsService.findTopPopular();
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
          src: `${apiBaseUrl}/public/images/emails/vk.svg`,
          link: 'https://vk.com/alex_hcj',
          name: 'vk',
        },
        {
          src: `${apiBaseUrl}/public/images/emails/github.svg`,
          link: 'https://github.com/alexhcj',
          name: 'github',
        },
        {
          src: `${apiBaseUrl}/public/images/emails/figma.svg`,
          link: 'https://www.figma.com/design/i0PEldds46MbUNR5avusy3/safira?node-id=1494-199&t=U6ofgb37pEb4sqSM-1',
          name: 'figma',
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

  public async sendFeedback(
    userId: string,
    data: CreateFeedbackDto,
  ): Promise<CreateFeedbackRO> {
    const subscription = await this._findSubscriptionByUserId(userId);

    if (!subscription)
      throw new HttpException('Subscription not found.', HttpStatus.NOT_FOUND);

    const feedback: CreateFeedbackDto = {
      unsubReason: data.unsubReason,
      unsubFeedback: data.unsubFeedback,
    };

    const updatedSubscription = await this.updateSubscription(
      subscription.email,
      feedback,
    );

    if (updatedSubscription) {
      return {
        message: 'Feedback has been sent.',
        statusCode: HttpStatus.CREATED,
      };
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

  private async _generateUnsubscribeLinks(
    userId: string,
    email: string,
  ): Promise<Record<UnsubscribeCategoryEnum, string>> {
    const links: Record<UnsubscribeCategoryEnum, string> = {} as Record<
      UnsubscribeCategoryEnum,
      string
    >;

    for (const category of Object.values(UnsubscribeCategoryEnum)) {
      links[category] = await this._generateUnsubscribeLink(
        userId,
        email,
        category,
      );
    }

    return links;
  }

  private async _generateUnsubscribeLink(
    userId: string,
    email: string,
    category: UnsubscribeCategoryEnum,
  ): Promise<string> {
    const token = await this._generateUnsubToken(userId, email, category);
    const clientUrl = this.configService.get<string>('client.clientUrl');

    return `${clientUrl}/unsubscribe?token=${token}&category=${category}&email=${email}`;
  }

  private async _generateUnsubToken(
    userId: string,
    email: string,
    category: UnsubscribeCategoryEnum,
  ) {
    const timestamp = Date.now();
    const expiresIn = UnsubscribeExpirationEnum.UNSUBSCRIBE_EXPIRATION;
    const salt = await bcrypt.genSalt(15);

    return await bcrypt.hash(
      `${userId}${email}${category}${timestamp}${expiresIn}`,
      salt,
    );
  }

  // BASIC METHODS
  private async _create(
    data: CreateSubscriptionDto,
  ): Promise<SubscriptionDocument> {
    const subscriptionDto: CreateSubscriptionDto = {
      userId: data.userId,
      email: data.email,
    };

    return await new this._subscriptionModel(subscriptionDto).save();
  }

  private async _findSubscriptionByUserId(
    userId: string,
  ): Promise<SubscriptionDocument> {
    return await this._subscriptionModel.findOne({ userId }).exec();
  }

  private async _findSubscriptionByEmail(
    email: string,
  ): Promise<SubscriptionDocument> {
    return await this._subscriptionModel.findOne({ email }).exec();
  }

  private async _findSubscriptionByEmailAndDelete(email: string): Promise<any> {
    return this._subscriptionModel.findOneAndDelete({ email }).exec();
  }
}
