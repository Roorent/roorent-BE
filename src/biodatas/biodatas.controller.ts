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
  UseInterceptors,
  UploadedFile, 
  Res,
  Query
} from '@nestjs/common';
import { BiodatasService } from './biodatas.service';
import { CreateBiodatasDTO } from './dto/create-biodatas.dto';
import { UpdateBiodatasDTO } from './dto/update-biodatas.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storagePhotoProfile } from './helpers/upload-profile';
import { join } from 'path';
import { of } from 'rxjs';
import { storagePhotoKtp } from './helpers/upload-ktp';

@Controller('biodatas')
export class BiodatasController {
  constructor(private readonly biodatasService: BiodatasService) {}

  @Post('upload-profile')
  @UseInterceptors(FileInterceptor('photo_profile', storagePhotoProfile))
  uploadPhotoProfile(@UploadedFile() photoProfile: Express.Multer.File){
   if(typeof photoProfile?.filename == "undefined"){
    return {
      statusCode: HttpStatus.BAD_REQUEST, 
      message: "error upload file"
    }
   }

   return {
      filename: photoProfile?.filename
   }
  }

  @Post('upload-ktp')
  @UseInterceptors(FileInterceptor('photo_ktp', storagePhotoKtp))
  uploadPhotKtp(@UploadedFile() photoKtp: Express.Multer.File){
   if(typeof photoKtp?.filename == "undefined"){
    return {
      statusCode: HttpStatus.BAD_REQUEST, 
      message: "error upload file"
    }
   }

   return {
    filename: photoKtp?.filename,
  }
  }

  @Get('profile-image/:type/:filename')
  getProfileImage(@Param('type') type: string,@Param('filename') filename: string, @Res() res: any){
    return of(
      res.sendFile(join(process.cwd(), `upload/${type}/${filename}`))
    )
  }

  @Get()
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.biodatasService.findAll(page, limit);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      count,
      data,
    };
  }

  @Post()
  async create(@Body() payload: CreateBiodatasDTO) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data: await this.biodatasService.create(payload),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      stausCode: HttpStatus.OK,
      message: 'success',
      data: await this.biodatasService.findOne(id),
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateBiodatasDTO,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.biodatasService.update(id, payload),
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.biodatasService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
    };
  }
}
