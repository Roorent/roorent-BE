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
} from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { CreateReviewDTO } from './dto/create-review.dto'
import { UpdateReviewDTO } from './dto/update-review.dto'

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

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

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.reviewService.findOne(id)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }

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

  @Post()
  async create(@Body() payload: CreateReviewDTO) {
    const data = await this.reviewService.create(payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Success',
      data,
    }
  }

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
