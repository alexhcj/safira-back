import { Controller, Get, Logger, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Get()
  searchGlobal(@Query() query): Promise<any> {
    this.logger.log('Handling searchGlobal() request...');
    return this.searchService.searchGlobal(query);
  }
}
