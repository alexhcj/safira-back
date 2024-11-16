import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneratorsService {
  constructor() {}

  public generateRandomNumbers(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }
}
