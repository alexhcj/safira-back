import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Query,
  Delete,
  Controller,
  Logger,
  ParamData,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import { PriceRO } from './price.interface';
import { CreatePriceDto } from './dto/price.dto';

@Controller('prices')
export class PricesController {
  private readonly logger = new Logger(PricesController.name);

  constructor(private pricesService: PricesService) {}

  @Post('create')
  create(@Body() data: CreatePriceDto) {
    this.logger.log('Handling create() request...');
    return this.pricesService.create(data);
  }

  @Get('list')
  findAll() {
    this.logger.log('Handling findAll() request...');
    return this.pricesService.findAll();
  }

  @Get()
  findOne(@Query('id') id: ParamData): Promise<PriceRO> {
    this.logger.log('Handling findOne() request...');
    return this.pricesService.findOne({ id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: CreatePriceDto) {
    this.logger.log('Handling update() request with id=' + id + '...');
    return this.pricesService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.pricesService.delete(id);
  }
}
