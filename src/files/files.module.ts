import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import FilesController from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileScheme } from './schemes/file.scheme';
import { Profile, ProfileScheme } from '../profiles/schemes/profile.scheme';
import { ProfilesService } from '../profiles/profiles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileScheme },
      { name: Profile.name, schema: ProfileScheme },
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService, ProfilesService],
  exports: [FilesService],
})
export class FilesModule {}
