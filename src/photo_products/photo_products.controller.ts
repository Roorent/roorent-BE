import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { PhotoProductsService } from './photo_products.service'
import { HttpStatusCode } from 'axios'
import { CreatePhotoProductsDTO } from './dto/create-photo_products.dto'
import { UpdatePhotoProductsDTO } from './dto/update-photo_products.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { storagePhotoProducts } from './helpers/upload-photo-reviews'
import { of } from 'rxjs'
import { join } from 'path'

@Controller('photo-products')
export class PhotoProductsController {
  constructor(private photoProductsService: PhotoProductsService) {}

  @Get()
  async getAllPhotoProducts(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const [data, count] = await this.photoProductsService.findAll(page, limit)

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @Get(':id')
  async getDetailById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.photoProductsService.findOneById(id)

    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data,
    }
  }

  @Post()
  async create(@Body() payload: CreatePhotoProductsDTO) {
    const data = await this.photoProductsService.create(payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdatePhotoProductsDTO,
  ) {
    const data = await this.photoProductsService.update(id, payload)

    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data,
    }
  }

  @Delete('/filename/:fileName')
  async deletePhoto(@Param('fileName') fileName: string) {
    return {
      statusCode: HttpStatus.OK,
      message: await this.photoProductsService.deletePhotoByName(fileName),
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: await this.photoProductsService.softDeleteById(id),
    }
  }

  @Post('upload-photo-products')
  @UseInterceptors(FileInterceptor('photo-products', storagePhotoProducts))
  uploadPhotoProducts(@UploadedFile() photoProducts: Express.Multer.File) {
    if (typeof photoProducts?.filename == 'undefined') {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'file is not uploaded',
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    return {
      filename: photoProducts?.filename,
    }
  }

  @Get('/:type/:filename')
  getProfileImage(
    @Param('type') type: string,
    @Param('filename') filename: string,
    @Res() res: any,
  ) {
    return of(res.sendFile(join(process.cwd(), `upload/${type}/${filename}`)))
  }
}
