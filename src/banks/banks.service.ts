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
    private usersRepository: UsersService,
  ) {}

  findAll() {
    return this.banksRepository.findAndCount({
      relations: {
        user: true,
      },
    })
  }

  async create(createBanksDTO: CreateBanksDTO) {
    try {
      const findOneUserId = await this.usersRepository.findOne(
        createBanksDTO.user_id,
      )

      const banksEntity = new Banks()
      banksEntity.bank_name = createBanksDTO.bank_name
      banksEntity.acc_name = createBanksDTO.acc_name
      banksEntity.acc_number = createBanksDTO.acc_number
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
            error: 'data not found',
          },
          HttpStatus.NOT_FOUND,
        )
      } else {
        throw err
      }
    }
  }

  async update(id: string, updateBanksDTO: UpdateBanksDTO) {
    try {
      await this.findOneById(id)

      const banksEntity = new Banks()
      banksEntity.bank_name = updateBanksDTO.bank_name
      banksEntity.acc_name = updateBanksDTO.acc_name
      banksEntity.acc_number = updateBanksDTO.acc_number

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

      return 'success'
    } catch (err) {
      throw err
    }
  }
}
