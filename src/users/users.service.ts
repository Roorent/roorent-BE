import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { EntityNotFoundError, Repository } from 'typeorm'
import { Users } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Biodatas } from '#/biodatas/entities/biodatas.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Biodatas)
    private biodatasRepository: Repository<Biodatas>,
  ) {}

  async findUsersByLevel(role: string) {
    try {
      if (!['owner', 'renter'].includes(role)) {
        throw new BadRequestException('Invalid, role not specified.')
      }

      const result = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.level', 'level')
        .leftJoinAndSelect('user.biodata', 'biodata')
        .where('level.name = :role', { role })
        .getMany()

      const count = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('user.level', 'level')
        .where('level.name = :role', { role })
        .getCount()

      return [result, count]
    } catch (err) {
      throw err
    }
  }

  async findOwnerByStatus(status: string, role: string) {
    try {
      if (role !== 'owner') {
        throw new BadRequestException('Invalid, role not owner.')
      }

      if (!['active', 'pending'].includes(status)) {
        throw new BadRequestException('Invalid, status not specified.')
      }

      const result = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.level', 'level')
        .leftJoinAndSelect('user.biodata', 'biodata')
        .where('level.name = :role', { role })
        .andWhere('biodata.is_active = :status', { status })
        .getMany()

      const count = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('user.level', 'level')
        .leftJoin('user.biodata', 'biodata')
        .where('level.name = :role', { role })
        .andWhere('biodata.is_active = :status', { status })
        .getCount()

      return [result, count]
    } catch (err) {
      throw err
    }
  }

  findAll() {
    return this.usersRepository.findAndCount({
      relations: {
        level: true,
      },
    })
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
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

  async update(id: string, payload: UpdateUserDto) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
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

    await this.usersRepository.update(id, payload)

    return this.usersRepository.findOneOrFail({
      where: {
        id,
      },
    })
  }

  async remove(id: string) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
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

    await this.usersRepository.softDelete(id)
  }

  async getNonactive(id: string, active: any) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        relations: ['biodata'],
        where: { id },
      })

      if(user.biodata.isActive !== 'active') {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        )
      } 

      const biodataId = user.biodata.id
      const biodatasEntity = new Biodatas()
      biodatasEntity.isActive = active
       
     const updateStatus = await this.biodatasRepository.update(biodataId, biodatasEntity)

      return updateStatus

     } catch (err) {
      throw err
     }
  }

  async getReactive(id: string, active: any) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        relations: ['biodata'],
        where: { id },
      })

      if(user.biodata.isActive !== 'inactive') {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        )
      } 

      const biodataId = user.biodata.id
      const biodatasEntity = new Biodatas()
      biodatasEntity.isActive = active
       
     const updateStatus = await this.biodatasRepository.update(biodataId, biodatasEntity)

      return updateStatus

     } catch (err) {
      throw err
     }
  }
}
