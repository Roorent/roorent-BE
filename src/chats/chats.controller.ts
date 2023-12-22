import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpStatus,
  Req,
} from '@nestjs/common'
import { ChatsService } from './chats.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @Get()
  // async findAllList(@Req() req) {
  //   const id = req.user.id
  //   const [data, count] = await this.chatsService.findAllList(id)

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Success',
  //     count,
  //     data,
  //   }
  // }

  @UseGuards(AuthGuard('jwt'))
  @Post(':receiverId')
  async create(
    @Param('receiverId', ParseUUIDPipe) receiverId: string,
    @Body('message') message: string,
    @Req() req,
  ) {
    const senderId = req.user.id
    const data = await this.chatsService.create(message, receiverId, senderId)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':receiverId')
  async findByReceiver(
    @Param('receiverId', ParseUUIDPipe) receiverId: string,
    @Req() req,
  ) {
    const senderId = req.user.id
    const data = await this.chatsService.findByReceiver(receiverId, senderId)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }
}
