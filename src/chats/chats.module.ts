import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chats } from './entities/chats.entity'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'
import { UsersModule } from '#/users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Chats]), UsersModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
