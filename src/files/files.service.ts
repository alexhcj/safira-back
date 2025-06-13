import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { File, FileDocument } from './schemes/file.scheme';
import { FileDto } from './dto/file.dto';
import {
  IDeleteFileRO,
  IFile,
  IUpdateFileRO,
  IUploadFileRO,
} from './interfaces/file.interce';
import { ProfilesService } from '../profiles/profiles.service';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private profilesService: ProfilesService,
  ) {}

  async getFileById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new HttpException('Id not found', HttpStatus.BAD_REQUEST);

    const file = await this.findById(new Types.ObjectId(id));

    if (!file)
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);

    return file;
  }

  public async uploadAvatar(
    userId: string,
    data: FileDto,
  ): Promise<IUploadFileRO> {
    const profile = await this.profilesService.findByUserId(userId);

    const avatar: IFile = {
      profileId: profile._id,
      filename: data.filename,
      path: data.path,
      mimetype: data.mimetype,
    };

    const createdAvatar = await new this.fileModel(avatar).save();

    await this.profilesService.update(userId, { avatarId: createdAvatar._id });

    return {
      status: HttpStatus.CREATED,
    };
  }

  public async deleteAvatar(
    userId: string,
    avatarId: string,
  ): Promise<IUpdateFileRO> {
    const profile = await this.profilesService.findByUserId(userId);

    if (!profile)
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);

    const avatar = await this.findById(new Types.ObjectId(avatarId));
    await this.deleteFile(avatar.path);

    await this.delete(new Types.ObjectId(avatarId));
    profile.avatarId = undefined;

    await profile.save();

    return { status: HttpStatus.OK };
  }

  private async findById(id: Types.ObjectId): Promise<FileDocument> {
    return this.fileModel.findById(id);
  }

  private async delete(id: Types.ObjectId): Promise<IDeleteFileRO> {
    await this.fileModel.deleteOne(id).exec();
    return { status: HttpStatus.OK };
  }

  private async deleteFile(path: string) {
    await fs.unlink(path, (err) => {
      if (err) throw new Error('File cannot be deleted');
      console.log(err);
    });
  }
}
