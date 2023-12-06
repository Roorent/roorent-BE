// chat.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Chats } from './entities/chats.entity'
import { UsersService } from '#/users/users.service'

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chats)
    private chatRepository: Repository<Chats>,
    private usersService: UsersService,
  ) {}

  // async findAllList(id: string) {
  //   try {
  //     const userId = await this.usersService.findOne(id)

  //     if (!userId) {
  //       throw new Error(`Your account haven't any chat`)
  //     }

  //     const [datas, count] = await this.chatRepository.findAndCount({
  //       where: [{ sender: { id } }, { receiver: { id } }],
  //     })

  //     return [datas, count]
  //   } catch (err) {
  //     throw err
  //   }
  // }

  async create(message: string, receiverId: string, senderId: string) {
    try {
      const receiver = await this.usersService.findOne(receiverId)
      const sender = await this.usersService.findOne(senderId)

      if (!sender || !receiver) {
        throw new Error('Sender or receiver not found')
      }

      const chatEntity = new Chats()
      chatEntity.message = message
      chatEntity.sender = sender
      chatEntity.receiver = receiver

      const insertChats = await this.chatRepository.insert(chatEntity)

      return this.chatRepository.findOneOrFail({
        where: {
          id: insertChats.identifiers[0].id,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async findByReceiver(receiverId: string, senderId: string) {
    try {
      const receiver = await this.usersService.findOne(receiverId)
      const sender = await this.usersService.findOne(senderId)

      if (!sender && !receiver) {
        throw new Error('Sender or receiver not found')
      }

      const datas = await this.chatRepository.find({
        where: {
          sender: { id: senderId },
          receiver: { id: receiverId },
        },
      })

      return datas
    } catch (err) {
      throw err
    }
  }
}
