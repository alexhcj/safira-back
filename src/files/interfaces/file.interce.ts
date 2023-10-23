import { HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

export interface IUploadFileRO {
  status: HttpStatus;
}

export interface IUpdateFileRO {
  status: HttpStatus;
}

export interface IDeleteFileRO {
  status: HttpStatus;
}

interface IAvatar {
  profileId: Types.ObjectId;
  filename: string;
  path: string;
  mimetype: string;
}

export type IFile = IAvatar;
