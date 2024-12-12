import { HttpStatus } from '@nestjs/common';
import { ProfileDocument } from '../schemes/profile.scheme';
import { FileDocument } from '../../files/schemes/file.scheme';

export interface IProfileUpdateRO {
  status: HttpStatus;
}

export interface IPopulatedProfileDocumentRO extends ProfileDocument {
  avatarId: FileDocument;
}
