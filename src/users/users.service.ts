import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemes/user.scheme';
import { UserHashedDto, UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userDto: UserDto): Promise<UserDocument> {
    const user = await this.findByEmail(userDto.email);

    if (user) {
      throw new HttpException(
        `Email ${userDto.email} already taken`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();
    const ph = await bcrypt.hash(userDto.password, salt);

    const userDBDto: UserHashedDto = {
      email: userDto.email,
      passwordHash: ph,
    };

    return new this.userModel(userDBDto).save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).exec();
  }
}
