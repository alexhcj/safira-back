import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schemes/profile.scheme';
import { Model, Types } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  IPopulatedProfileDocumentRO,
  IProfileUpdateRO,
} from './interfaces/profile.interfaces';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private profileModel: Model<ProfileDocument>,
  ) {}

  public async create(userId: string): Promise<ProfileDocument> {
    const profile: CreateProfileDto = {
      userId,
    };

    return new this.profileModel(profile).save();
  }

  public async update(
    userId: string,
    data: UpdateProfileDto,
  ): Promise<IProfileUpdateRO> {
    const profileData: UpdateProfileDto = {
      avatarId: data.avatarId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      location: data.location,
      phone: data.phone,
    };

    const profile = await this.findByUserIdAndUpdate(
      new Types.ObjectId(userId),
      profileData,
    );

    if (!profile)
      throw new HttpException(
        'Could`t update profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      status: HttpStatus.CREATED,
    };
  }

  public async findByUserId(
    userId: string,
  ): Promise<IPopulatedProfileDocumentRO> {
    return this.findOne(new Types.ObjectId(userId));
  }

  private async findOne(
    userId: Types.ObjectId,
  ): Promise<IPopulatedProfileDocumentRO> {
    return this.profileModel.findOne({ userId }).populate('avatarId');
  }

  private async findByUserIdAndUpdate(
    id: Types.ObjectId,
    data: UpdateProfileDto,
  ): Promise<ProfileDocument> {
    return this.profileModel
      .findOneAndUpdate({ userId: id }, data, {
        new: true,
      })
      .exec();
  }
}
