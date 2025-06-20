import { IsArray, IsString } from 'class-validator';

export class FindUniqueDietaryTagsRdo {
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
