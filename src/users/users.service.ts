import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemes/user.scheme';
import { UserDto, UserHashedDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: UserDto): Promise<UserDocument> {
    const user = await this.findByEmail(data.email);

    if (user && user.email === data.email) {
      throw new HttpException(
        `Email ${data.email} is already taken`,
        HttpStatus.CONFLICT,
      );
    }

    const salt = await bcrypt.genSalt();
    const ph = await bcrypt.hash(data.password, salt);

    const userDto: UserHashedDto = {
      email: data.email,
      passwordHash: ph,
    };

    return new this.userModel(userDto).save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).exec();
  }
}
