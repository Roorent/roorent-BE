import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { PhotoProductsService } from './photo_products.service'
import { HttpStatusCode } from 'axios'
import { CreatePhotoProductsDTO } from './dto/create-photo_products.dto'
import { UpdatePhotoProductsDTO } from './dto/update-photo_products.dto'

@Controller('photo-products')
export class PhotoProductsController {
  constructor(private photoProductsService: PhotoProductsService) {}

  @Get()
  async getAllPhotoProducts() {
    const [data, count] = await this.photoProductsService.findAll()

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @Get(':id')
  async getDetailById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data: await this.photoProductsService.findOneById(id),
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
    const data = await this.photoProductsService.update(
      id,
      payload,
    )

    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data,
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: await this.photoProductsService.softDeleteById(id),
    }
  }
}
