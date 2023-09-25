import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Verification,
  VerificationDocument,
} from './schemes/verification.scheme';
import { Model } from 'mongoose';
import { VerificationDto } from './dto/verification.dto';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>,
  ) {}

  async createVerification(
    userId: string,
    isPrivacyConfirmed: boolean,
  ): Promise<Verification> {
    const verificationDto: VerificationDto = {
      userId,
      isPrivacyConfirmed,
    };

    const createVerification = await new this.verificationModel(
      verificationDto,
    );

    return createVerification.save();
  }
}
