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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { CreateReviewDTO } from './dto/create-review.dto'
import { UpdateReviewDTO } from './dto/update-review.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.reviewService.findAll(page, limit)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.reviewService.findOne(id)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/product/:id')
  async findByProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const [data, count] = await this.reviewService.findByProduct(
      page,
      limit,
      id,
    )

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  async create(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CreateReviewDTO )
    {
    const userId = req.user.id 
    const data = await this.reviewService.create(id, userId, payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateReviewDTO,
  ) {
    const data = await this.reviewService.update(id, payload)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.reviewService.remove(id)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }
}
