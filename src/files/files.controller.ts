import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import LocalFilesInterceptor from '../interceptors/local-files.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ICurrentUser } from '../common/interfaces/current-user.interface';

@Controller('files')
@UseInterceptors(ClassSerializerInterceptor)
export default class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(private readonly filesService: FilesService) {}

  @Get('avatar/:id')
  async findById(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.filesService.getFileById(id);

    const stream = createReadStream(join(process.cwd(), file.path));

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype,
    });

    return new StreamableFile(stream);
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'avatar',
      path: '/avatars',
    }),
  )
  async uploadAvatar(
    @CurrentUser('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    data: Express.Multer.File,
  ) {
    return this.filesService.uploadAvatar(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('avatar/:id')
  deleteAvatar(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    this.logger.log('Handling deleteAvatar() request...');
    return this.filesService.deleteAvatar(user.id, id);
  }
}
