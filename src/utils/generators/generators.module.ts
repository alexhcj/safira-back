import { Module } from '@nestjs/common';
import { GeneratorsService } from './generators.service';

@Module({
  providers: [GeneratorsService],
  exports: [GeneratorsService],
})
export class GeneratorsModule {}
