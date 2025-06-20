import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class FindQueryDietaryTagsRdo {
  @IsNotEmpty()
  @IsArray({ each: true })
  @IsString()
  tags: string[];
}
