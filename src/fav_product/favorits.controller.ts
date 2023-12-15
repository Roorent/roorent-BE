import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Post,
  Delete,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common'
import { FavoritsService } from './favorits.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('favorite')
export class FavoritsController {
  constructor(private favoritService: FavoritsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.favoritService.findAll(page, limit)
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  async create(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    const userId = req.user.id
    const datas = await this.favoritService.create(id, userId)
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Succes',
      data: datas,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const datas = await this.favoritService.remove(id)
    return {
      statusCode: HttpStatus.OK,
      message: 'Succes',
      data: datas,
    }
  }
}
