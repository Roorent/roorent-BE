import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { RentApplicationsService } from './rent_applications.service';
import { HttpStatusCode } from 'axios';
import { CreateRentApplicationsDTO } from './dto/create-rent_applications.dto';
import { UpdateRentApplicationsDTO } from './dto/update-rent_applications.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('rent-applications')
export class RentApplicationsController {
  constructor(
    private rentApplicationsService: RentApplicationsService,
  ){}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.rentApplicationsService.findAll(page, limit)

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  async create(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CreateRentApplicationsDTO )
    {
    const userId = req.user.id 
    const data = await this.rentApplicationsService.create(id, userId, payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getDetailById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data: await this.rentApplicationsService.findOneById(id),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateRentApplicationsDTO,
  ) {
    const data = await this.rentApplicationsService.update(id, payload)

    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: await this.rentApplicationsService.softDeleteById(id),
    }
  }
}
