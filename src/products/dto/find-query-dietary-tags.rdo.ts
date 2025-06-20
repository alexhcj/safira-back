import { IsArray, IsString } from 'class-validator';

export class FindQueryDietaryTagsRdo {
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
