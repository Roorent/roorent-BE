import { UsersService } from '#/users/users.service'
import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityNotFoundError, Repository } from 'typeorm'
import { Notifications } from './entities/notification.entity'
import { CreateNotifDTO } from './dto/create-notif.dto'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notifRepository: Repository<Notifications>,
    private usersService: UsersService,
  ) {}

  async findAll() {
    const [data, count] = await this.notifRepository.findAndCount()

    return [data, count]
  }

  async findUnread() {
    try {
      const [data, count] = await this.notifRepository.findAndCount({
        where: {
          readable: false,
        },
      })

      if (!data || data.length === 0) {
        throw new Error('Unread notifications not found')
      }

      return [data, count]
    } catch (err) {
      throw err
    }
  }

  async findByUser(id: string) {
    try {
      const findNotif = await this.notifRepository.findOneOrFail({
        where: { receiver: { id } },
        relations: { receiver: true },
      })

      const data = {
        id: findNotif.id,
        title: findNotif.title,
        content: findNotif.content,
        readable: findNotif.readable,
        createdAt: findNotif.createdAt,
        updatedAt: findNotif.updatedAt,
        receiverId: findNotif.receiver.id,
      }

      return data
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Data not found',
        }
      } else {
        throw err
      }
    }
  }

  async create(payload: CreateNotifDTO, receiverId: string, senderId: string) {
    try {
      const receiver = await this.usersService.findOne(receiverId)
      const sender = await this.usersService.findOne(senderId)

      if (!sender || !receiver) {
        throw new Error('Sender or receiver not found')
      }

      const notifEntity = new Notifications()
      notifEntity.sender = sender
      notifEntity.receiver = receiver
      notifEntity.title = payload.title
      notifEntity.content = payload.content

      const insertNotif = await this.notifRepository.insert(notifEntity)

      return this.notifRepository.findOneOrFail({
        where: { id: insertNotif.identifiers[0].id },
      })
    } catch (err) {
      throw err
    }
  }

  async update(id: string, readable: boolean) {
    try {
      const notif = await this.notifRepository.findOneOrFail({ where: { id } })

      if (!notif) {
        throw new Error('Notification not found')
      }

      await this.notifRepository.update(id, { readable })

      return this.notifRepository.findOneOrFail({
        where: { id },
      })
    } catch (err) {
      throw err
    }
  }
}
