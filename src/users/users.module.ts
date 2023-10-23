import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserScheme } from './schemes/user.scheme';
import { ProfilesService } from '../profiles/profiles.service';
import { Profile, ProfileScheme } from '../profiles/schemes/profile.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserScheme },
      { name: Profile.name, schema: ProfileScheme },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ProfilesService],
  exports: [UsersService],
})
export class UsersModule {}
