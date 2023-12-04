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
import { ReviewsService } from './reviews.service'
import { CreateReviewDTO } from './dto/create-review.dto'
import { UpdateReviewDTO } from './dto/update-review.dto'

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @Get()
  async findAll() {
    const [data, count] = await this.reviewService.findAll()

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

  @Post()
  async create(@Body() payload: CreateReviewDTO) {
    const datas = await this.reviewService.create(payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Success',
      data: datas,
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateReviewDTO,
  ) {
    const datas = await this.reviewService.update(id, payload)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: datas,
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const datas = await this.reviewService.remove(id)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: datas,
    }
  }
}
