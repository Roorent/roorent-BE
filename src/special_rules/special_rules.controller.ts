import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Delete,
} from '@nestjs/common'
import { SpecialRulesService } from './special_rules.service'
import { CreateSpecialRulesDto } from './dto/create-specialRules.dto'
import { UpdateSpecialRulesDto } from './dto/update-specialRules.dto'

@Controller('special-rules')
export class SpecialRulesController {
  constructor(private readonly specialRulesService: SpecialRulesService) {}

  @Get()
  async findAll() {
    const [data, count] = await this.specialRulesService.findAll()
    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      count,
      data,
    }
  }

  @Post()
  async create(@Body() payload: CreateSpecialRulesDto) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data: await this.specialRulesService.create(payload),
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.specialRulesService.findOne(id),
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateSpecialRulesDto,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.specialRulesService.update(id, payload),
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.specialRulesService.remove(id)
    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
    }
  }
}
