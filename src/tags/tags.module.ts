import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagScheme } from './schemes/tag.scheme';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagScheme }])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
