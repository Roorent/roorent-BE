import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Banks } from './entities/banks.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { UsersService } from '#/users/users.service'
import { CreateBanksDTO } from './dto/create-banks.dto'
import { UpdateBanksDTO } from './dto/update-banks.dto'

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Banks)
    private banksRepository: Repository<Banks>,
    private usersService: UsersService,
  ) {}

  findAll(page: number = 1, limit: number = 10) {
    return this.banksRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        user: true,
      },
    })
  }

  async create(payload: CreateBanksDTO) {
    try {
      const findOneUserId = await this.usersService.findOne(payload.user_id)

      const banksEntity = new Banks()
      banksEntity.bank_name = payload.bank_name
      banksEntity.acc_name = payload.acc_name
      banksEntity.acc_number = payload.acc_number
      banksEntity.user = findOneUserId

      const insertBanks = await this.banksRepository.insert(banksEntity)
      return await this.banksRepository.findOneOrFail({
        where: {
          id: insertBanks.identifiers[0].id,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async findOneById(id: string) {
    try {
      return await this.banksRepository.findOneOrFail({
        where: { id },
        relations: { user: true },
      })
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        )
      } else {
        throw err
      }
    }
  }

  async update(id: string, payload: UpdateBanksDTO) {
    try {
      await this.findOneById(id)

      const banksEntity = new Banks()
      banksEntity.bank_name = payload.bank_name
      banksEntity.acc_name = payload.acc_name
      banksEntity.acc_number = payload.acc_number

      await this.banksRepository.update(id, banksEntity)

      return await this.banksRepository.findOneOrFail({
        where: {
          id,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async softDeleteById(id: string) {
    try {
      await this.findOneById(id)

      await this.banksRepository.softDelete(id)

      return 'Success'
    } catch (err) {
      throw err
    }
  }
}
