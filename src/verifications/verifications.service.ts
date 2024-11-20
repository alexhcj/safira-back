import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Verification,
  VerificationDocument,
} from './schemes/verification.scheme';
import { Model, Types } from 'mongoose';
import {
  CreateVerificationRO,
  VerificationDto,
  VerifyEmailDto,
} from './dto/verification.dto';
import { EmailerService } from '../emailer/emailer.service';
import { UsersService } from '../users/users.service';
import { VerificationEnum } from './enums/verification.enum';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>,
    private readonly emailerService: EmailerService,
    private readonly usersService: UsersService,
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
  }: VerifyEmailDto): Promise<boolean> {
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

    return true;
  }

  private async _sendVerifyEmail(email: string, code: number) {
    return this.emailerService.sendVerifyEmail({ email, code });
  }

  private _generateCode(length: number = 6): number {
    return +Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }

  private async _findByUserId(userId: string): Promise<VerificationDocument> {
    return await this.verificationModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
  }
}
