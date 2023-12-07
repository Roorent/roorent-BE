import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { AuthGuard } from '@nestjs/passport'
import { CreateNotifDTO } from './dto/create-notif.dto'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    const [data, count] = await this.notificationService.findAll()

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/unread')
  async findUnread() {
    const [data, count] = await this.notificationService.findUnread()

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':receiverId')
  async create(
    @Param('receiverId', ParseUUIDPipe) receiverId: string,
    @Req() req,
    @Body() payload: CreateNotifDTO,
  ) {
    const senderId = req.user.id
    const data = await this.notificationService.create(
      payload,
      receiverId,
      senderId,
    )

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('readable') readable: boolean,
  ) {
    const data = await this.notificationService.update(id, readable)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }
}
