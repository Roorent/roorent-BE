import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { PhotoReviewsService } from './photo_reviews.service';
import { HttpStatusCode } from 'axios';
import { UpdatePhotoReviewsDTO } from './dto/update-photo_reviews.dto';
import { CreatePhotoReviewsDTO } from './dto/create-photo_reviews.dto';

@Controller('photo-reviews')
export class PhotoReviewsController {
  constructor(
    private photoReviewsService: PhotoReviewsService
  ){}

  @Get()
  async getAllPhotoReviews() {
    const [data, count] = await this.photoReviewsService.findAll()

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
      data: await this.photoReviewsService.findOneById(id),
    }
  }

  @Post()
  async create(@Body() createPhotoReviewsDTO: CreatePhotoReviewsDTO) {
    const data = await this.photoReviewsService.create(createPhotoReviewsDTO)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhotoReviewsDTO: UpdatePhotoReviewsDTO,
  ) {
    const data = await this.photoReviewsService.update(
      id,
      updatePhotoReviewsDTO,
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
      message: await this.photoReviewsService.softDeleteById(id),
    }
  }
}
