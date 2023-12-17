import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PhotoReviewsService } from './photo_reviews.service';
import { HttpStatusCode } from 'axios';
import { UpdatePhotoReviewsDTO } from './dto/update-photo_reviews.dto';
import { CreatePhotoReviewsDTO } from './dto/create-photo_reviews.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storagePhotoReviews } from './helpers/upload-photo-reviews';
import { of } from 'rxjs';
import { join } from 'path';

@Controller('photo-reviews')
export class PhotoReviewsController {
  constructor(
    private photoReviewsService: PhotoReviewsService
  ){}

  @Get()
  async getAllPhotoReviews(@Query('page') page: number, @Query('limit') limit: number){
    const [data, count] = await this.photoReviewsService.findAll(page, limit);

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
  async create(@Body() payload: CreatePhotoReviewsDTO) {
    const data = await this.photoReviewsService.create(payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdatePhotoReviewsDTO,
  ) {
    const data = await this.photoReviewsService.update(
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
      message: await this.photoReviewsService.softDeleteById(id),
    }
  }

  @Post('upload-photo-reviews')
  @UseInterceptors(FileInterceptor('photo-reviews', storagePhotoReviews))
  uploadPhotoReviews(@UploadedFile() photoReviews: Express.Multer.File){
    if(typeof photoReviews?.filename == "undefined"){
      return {
        statusCode: HttpStatus.BAD_REQUEST, 
        message: "error upload file"
      }
     }
  
     return {
        filename: photoReviews?.filename
     }
  }

  @Get('/:type/:filename')
  getProfileImage(@Param('type') type: string,@Param('filename') filename: string, @Res() res: any){
    return of(
      res.sendFile(join(process.cwd(), `upload/${type}/${filename}`))
    )
  }
}
