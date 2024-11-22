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
import {
  CheckEmailAndUserExistenceRO,
  CreateVerificationRO,
  ValidatePasswordRO,
  VerificationDto,
  VerifyEmailDto,
  VerifyEmailRO,
  VerifyNewEmailRO,
} from './dto/verification.dto';
import { EmailerService } from '../emailer/emailer.service';
import { UsersService } from '../users/users.service';
import { VerificationEnum } from './enums/verification.enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>,
    private readonly emailerService: EmailerService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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
    await this._sendVerifyEmail(email, code);

    return {
      message: HttpStatus.OK,
    };
  }

  public async resendVerifyEmail(userId: string) {
    const verification = await this._findByUserId(userId);

    if (!verification)
      throw new HttpException('Verification not found.', HttpStatus.NOT_FOUND);

    // TODO: add protection: e.x. => not allow to call method?
    if (verification.isEmailVerified)
      throw new HttpException(
        'Email already verified.',
        HttpStatus.BAD_REQUEST,
      );

    if (
      new Date().getTime() <
      +new Date(verification.codeCreatedAt) + 1000 * 60
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

    await this._sendVerifyEmail(user.email, code);
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
      throw new HttpException('Code is not valid.', HttpStatus.BAD_REQUEST);

    if (
      +new Date(verification.codeCreatedAt) +
        +VerificationEnum.CODE_EXPIRATION_LIMIT <
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
    await this.emailerService.sendSuccessVerifyEmail(email);

    return {
      message: HttpStatus.OK,
    };
  }

  // checks email and user existence => generate code & send to new email
  public async changeEmail(
    userId: string,
    email: string,
  ): Promise<CheckEmailAndUserExistenceRO> {
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

    await this.emailerService.sendVerifyEmail({ email, code });

    return {
      message: HttpStatus.OK,
    };
  }

  public async verifyNewEmail(
    userId: string,
    code: number,
  ): Promise<VerifyNewEmailRO> {
    const verification = await this._findByUserId(userId);

    if (code !== verification.code)
      throw new HttpException('Code is not valid.', HttpStatus.BAD_REQUEST);

    verification.isNewEmailVerified = true;
    verification.code = undefined;
    verification.codeCreatedAt = undefined;

    await verification.save();

    return {
      message: HttpStatus.OK,
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

    user.email = verification.newEmail;

    await user.save();

    await this.emailerService.sendSuccessChangeEmail(user.email);

    verification.code = undefined;
    verification.codeCreatedAt = undefined;
    verification.isNewEmailVerified = undefined;
    verification.newEmail = undefined;

    await verification.save();

    return {
      message: HttpStatus.OK,
    };
  }

  private _generateCode(length: number = 6): number {
    return +Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }

  private async _sendVerifyEmail(email: string, code: number) {
    return this.emailerService.sendVerifyEmail({ email, code });
  }

  private async _findByUserId(userId: string): Promise<VerificationDocument> {
    return await this.verificationModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
  }
}
