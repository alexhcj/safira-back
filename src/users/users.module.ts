import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserScheme } from './schemes/user.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserScheme }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
