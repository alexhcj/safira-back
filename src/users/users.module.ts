import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserScheme } from './schemes/user.scheme';
import { Profile, ProfileScheme } from '../profiles/schemes/profile.scheme';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserScheme },
      { name: Profile.name, schema: ProfileScheme },
    ]),
    ProfilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
