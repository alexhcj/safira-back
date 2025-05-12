import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Verification,
  VerificationDocument,
} from './schemes/verification.scheme';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  ChangeEmailRO,
  ChangePasswordRO,
  CreateVerificationRO,
  ResetPasswordDto,
  ResetPasswordRO,
  ValidatePasswordRO,
  VerificationDto,
  VerifyCodeRO,
  VerifyEmailDto,
  VerifyEmailRO,
  VerifyNewEmailRO,
} from './dto/verification.dto';
import { EmailerService } from '../emailer/emailer.service';
import { UsersService } from '../users/users.service';
import { VerificationCodeEnum } from './enums/verification.enum';
import { AuthService } from '../auth/auth.service';
import { VerifyEmailTemplateIdEnum } from '../emailer/enums/emailer.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>,
    private readonly emailerService: EmailerService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  public async createVerification(
    userId: string,
    email: string,
    isPrivacyConfirmed: boolean,
  ): Promise<CreateVerificationRO> {
    const user = this.usersService.findById(userId);

    if (!user)
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

    if (!isPrivacyConfirmed)
      throw new HttpException(
        'Privacy & policies not confirmed',
        HttpStatus.BAD_REQUEST,
      );

    const code = this._generateCode();

    const verificationDto: VerificationDto = {
      userId,
      isPrivacyConfirmed,
      code,
      codeCreatedAt: new Date(),
    };

    await new this.verificationModel(verificationDto).save();
    await this.emailerService.sendVerifyEmail({
      email,
      code,
      type: VerifyEmailTemplateIdEnum.SIGN_UP,
    });

    return {
      message: HttpStatus.OK,
    };
  }

  public async resendVerifyEmail(
    type: VerifyEmailTemplateIdEnum,
    userId: string,
  ) {
    const verification = await this._findByUserId(userId);

    if (!verification)
      throw new HttpException('Verification not found.', HttpStatus.NOT_FOUND);

    if (
      +new Date(verification.codeCreatedAt) +
        +VerificationCodeEnum.VERIFY_EMAIL_CODE_RESEND_TIMEOUT >
      +new Date()
    )
      throw new HttpException(
        `${HttpStatus.BAD_REQUEST}. Try later`,
        HttpStatus.BAD_REQUEST,
      );

    if (
      new Date().getTime() <
      +new Date(verification.codeCreatedAt) +
        +VerificationCodeEnum.VERIFY_EMAIL_CODE_RESEND_TIMEOUT
    )
      throw new HttpException(
        'Could not create new code now.',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.usersService.findById(userId);

    if (!user)
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);

    const code = this._generateCode();

    verification.code = code;
    verification.codeCreatedAt = new Date();

    await verification.save();

    await this.emailerService.sendVerifyEmail({
      email: user.email,
      code,
      type,
    });

    return {
      statusCode: HttpStatus.CREATED,
      createdAt: verification.codeCreatedAt,
    };
  }

  public async verifyEmail({
    userId,
    email,
    code,
  }: VerifyEmailDto): Promise<VerifyEmailRO> {
    const verification = await this._findByUserId(userId);

    if (!verification)
      throw new HttpException('Verification not found.', HttpStatus.NOT_FOUND);

    if (code !== verification.code)
      throw new HttpException(
        "Code isn't valid. Try another.",
        HttpStatus.BAD_REQUEST,
      );

    if (
      +new Date(verification.codeCreatedAt) +
        +VerificationCodeEnum.VERIFY_EMAIL_CODE_EXPIRATION <
      +new Date()
    )
      throw new HttpException(
        'Code expired. Try new code.',
        HttpStatus.BAD_REQUEST,
      );

    verification.isEmailVerified = true;
    verification.code = undefined;
    verification.codeCreatedAt = undefined;

    await verification.save();
    await this.emailerService.sendVerifyEmailSuccess(email);

    return {
      statusCode: HttpStatus.OK,
    };
  }

  // checks email and user existence => generate code & send to new email
  public async changeEmail(
    userId: string,
    email: string,
  ): Promise<ChangeEmailRO> {
    const user = await this.usersService.findById(userId);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isEmailExists = await this.usersService.findByEmail(email);

    if (isEmailExists)
      throw new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const verification = await this._findByUserId(userId);

    if (!verification)
      throw new HttpException('Verification not found.', HttpStatus.NOT_FOUND);

    const code = this._generateCode();

    verification.code = code;
    verification.codeCreatedAt = new Date();
    verification.isNewEmailVerified = false;
    verification.newEmail = email;

    await verification.save();

    await this.emailerService.sendVerifyEmail({
      email,
      code,
      type: VerifyEmailTemplateIdEnum.CHANGE_EMAIL,
    });

    return {
      message: 'Code has been send.',
      statusCode: HttpStatus.OK,
    };
  }

  public async verifyNewEmail(
    userId: string,
    code: number,
  ): Promise<VerifyNewEmailRO> {
    const verification = await this._findByUserId(userId);

    if (code !== verification.code)
      throw new HttpException(
        "Code isn't valid. Try another.",
        HttpStatus.BAD_REQUEST,
      );

    verification.isNewEmailVerified = true;
    verification.code = undefined;
    verification.codeCreatedAt = undefined;

    await verification.save();

    return {
      message: 'Email has been verified.',
      statusCode: HttpStatus.OK,
    };
  }

  public async validatePassword(
    email: string,
    password: string,
  ): Promise<ValidatePasswordRO> {
    const user = await this.authService.validateUser(email, password);

    if (!user)
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const verification = await this._findByUserId(user._id);

    if (!verification)
      throw new HttpException('Verification not found.', HttpStatus.NOT_FOUND);

    await this.usersService.findByIdAndUpdate(user._id, {
      email: verification.newEmail,
    });

    await user.save();

    await this.emailerService.sendChangeEmailSuccess(user.email);

    const creds = await this.authService.login({
      email: verification.newEmail,
      password,
    });

    verification.code = undefined;
    verification.codeCreatedAt = undefined;
    verification.isNewEmailVerified = undefined;
    verification.newEmail = undefined;

    await verification.save();

    return {
      message: 'Email has been changed.',
      statusCode: HttpStatus.OK,
      accessToken: creds.accessToken,
    };
  }

  // checks user existence & email equals => generate code & send to email
  public async changePassword(
    userId: string,
    email: string,
    browser: string,
    os: string,
  ): Promise<ChangePasswordRO> {
    const user = await this.usersService.findById(userId);
    const userByEmail = await this.usersService.findByEmail(email);

    if (
      !user ||
      !userByEmail ||
      email !== user.email ||
      email !== userByEmail.email
    ) {
      const profile = await this.usersService.findProfile(userId);

      await this.emailerService.sendChangePasswordError({
        email: user.email ?? userByEmail.email,
        browser,
        os,
        name: profile.firstName ?? 'Dear Customer',
      });

      throw new HttpException(
        'Something went wrong.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const verification = await this._findByUserId(userId);

    if (!verification)
      throw new HttpException('Verification not found.', HttpStatus.NOT_FOUND);

    const code = this._generateCode();

    verification.code = code;
    verification.codeCreatedAt = new Date();
    // TODO: call CRON with timeout

    await verification.save();

    await this.emailerService.sendVerifyEmail({
      email,
      code,
      type: VerifyEmailTemplateIdEnum.CHANGE_PASSWORD,
    });

    return {
      message: 'Code has been send.',
      statusCode: HttpStatus.OK,
    };
  }

  public async verifyCode(
    userId: string,
    clientIp: string,
    browser: string,
    os: string,
    email: string,
    code: number,
  ): Promise<VerifyCodeRO> {
    const verification = await this._findByUserId(userId);

    if (verification.resetPasswordTimeout > new Date())
      throw new HttpException('Timeout error.', HttpStatus.BAD_REQUEST);
    if (code !== verification.code)
      throw new HttpException(
        "Code isn't valid. Try another.",
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.usersService.findByIdWithProfile(userId);

    const expirationTime: number = new Date().getTime() + 86400000;

    verification.resetPasswordTimeout = new Date(expirationTime);
    await verification.save();

    const salt = await bcrypt.genSalt(15);
    const token = await bcrypt.hash(
      `${code}${email}${user.user.passwordHash}${expirationTime}${clientIp}${browser}${os}`,
      salt,
    );
    const link = `${this.configService.get<string>(
      'client.clientUrl',
    )}/change-password?userId=${userId}&expirationTime=${expirationTime}&token=${token}`;

    await this.emailerService.sendChangePasswordLink(
      email,
      user.profile.firstName ?? 'Dear Customer',
      link,
    );

    return {
      message: 'Link has been send.',
      statusCode: HttpStatus.OK,
    };
  }

  public async resetPassword(
    reqUserId: string,
    userId: string,
    expirationTime: number,
    token: string,
    clientIp: string,
    browser: string,
    os: string,
    email: string,
    data: ResetPasswordDto,
  ): Promise<ResetPasswordRO> {
    if (new Date().getTime() > expirationTime)
      throw new HttpException('Token is expired', HttpStatus.BAD_REQUEST);

    const userByReq = await this.usersService.findById(reqUserId);
    const userByQuery = await this.usersService.findById(userId);

    if (!userByReq || !userByQuery)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (data.password !== data.confirmPassword)
      throw new HttpException(
        'Passwords are not the same',
        HttpStatus.BAD_REQUEST,
      );

    const verification = await this._findByUserId(userId);

    const link = `${verification.code}${email}${userByReq.passwordHash}${expirationTime}${clientIp}${browser}${os}`;

    const isEquals = bcrypt.compareSync(link, token);

    if (!isEquals)
      throw new HttpException(
        'Internal severer error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const salt = await bcrypt.genSalt();
    const ph = await bcrypt.hash(data.confirmPassword, salt);

    await this.usersService.findByIdAndUpdate(userId, {
      passwordHash: ph,
    });
    verification.code = undefined;
    verification.codeCreatedAt = undefined;
    verification.resetPasswordTimeout = undefined;
    await verification.save();

    await this.emailerService.sendChangePasswordSuccess(email);

    return {
      message: 'Password has been changed.',
      statusCode: HttpStatus.OK,
    };
  }

  public async isUserEmailVerified(id: string): Promise<boolean> {
    const verification = await this._findByUserId(id);

    if (!verification)
      throw new HttpException('Verification not found', HttpStatus.NOT_FOUND);

    return verification.isEmailVerified;
  }

  private _generateCode(): number {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }

  private async _findByUserId(userId: string): Promise<VerificationDocument> {
    return await this.verificationModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
  }
}
