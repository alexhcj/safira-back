import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDocument } from './schemes/offer.scheme';
import { OfferEnum } from './enums/offer.enum';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Controller('offers')
export class OffersController {
  private readonly logger = new Logger(OffersController.name);

  constructor(private readonly offersService: OffersService) {}

  @Get(':type')
  getOfferByType(@Param('type') type: OfferEnum): Promise<OfferDocument> {
    this.logger.log('Handling get() request...');
    return this.offersService.getOfferByType(type);
  }

  @Post('create')
  create(@Body() data: CreateOfferDto): Promise<OfferDocument> {
    this.logger.log('Handling create() request...');
    return this.offersService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateOfferDto,
  ): Promise<OfferDocument> {
    this.logger.log('Handling update() request...');
    return this.offersService.update(id, data);
  }
}
