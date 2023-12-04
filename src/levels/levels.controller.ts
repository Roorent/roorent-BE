import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common'
import { LevelsService } from './levels.service'

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.levelsService.findAll(page, limit)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.levelsService.findOne(name),
    }
  }
}
