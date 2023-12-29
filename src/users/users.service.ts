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
import { Biodatas, StatusUsers } from '#/biodatas/entities/biodatas.entity'
import { ReactiveUserDto } from './dto/reactive-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Biodatas)
    private biodatasRepository: Repository<Biodatas>,
  ) {}

  findAllUsers(page: number = 1 , limit: number = 10){
    return this.usersRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        level:true,
        biodata:true
      }
    });
  }

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
        relations: {
          level: true,
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

  async getNonactive(id: string
    ) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        relations: ['biodata'],
        where: { id },
      })

      if (user.biodata.isActive !== 'active') {
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
      biodatasEntity.isActive = StatusUsers.INACTIVE

      await this.biodatasRepository.update(biodataId, biodatasEntity)

      return await this.biodatasRepository.findOneOrFail({
        where: { user: { id } },
      })
    } catch (err) {
      throw err
    }
  }

  async getReactive(id: string, payload: ReactiveUserDto) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        relations: ['biodata'],
        where: { id },
      })

      if (user.biodata.isActive !== 'inactive') {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        )
      }

      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Email is invalid',
          },
          HttpStatus.BAD_REQUEST,
        )
      }

      const isMatch = await bcrypt.compare(payload.password, user.password)

      if (!isMatch) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'password is invalid',
          },
          HttpStatus.BAD_REQUEST,
        )
      }

      const existingUser:any = await this.usersRepository.findOne({ 
        where: {biodata: {first_name: payload.first_name, last_name: payload.last_name}} 
      });

    if (existingUser) {
      const biodataId = user.biodata.id
      const biodatasEntity = new Biodatas()
      biodatasEntity.isActive = StatusUsers.ACTIVE
      await this.biodatasRepository.update(biodataId, biodatasEntity)
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'first name and last name is invalid',
        },
        HttpStatus.BAD_REQUEST,
      )
    }

      return await this.biodatasRepository.findOneOrFail({
        where: { user: { id } },
      })
    } catch (err) {
      throw err
    }
  }

  async approveOwner(id: string) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        relations: ['biodata'],
        where: { id },
      })

      // if (user.biodata.isActive !== 'pending') {
      //   throw new HttpException(
      //     {
      //       statusCode: HttpStatus.NOT_FOUND,
      //       error: 'Data not found',
      //     },
      //     HttpStatus.NOT_FOUND,
      //   )
      // }

      const biodataId = user.biodata.id
      const biodatasEntity = new Biodatas()
      biodatasEntity.isActive = StatusUsers.ACTIVE
      biodatasEntity.reason = null

      await this.biodatasRepository.update(biodataId, biodatasEntity)

      return await this.biodatasRepository.findOneOrFail({
        where: { user: { id } },
      })
    } catch (err) {
      throw err
    }
  }

  async rejectOwner(id: string, reason: any){
    try {
      const user = await this.usersRepository.findOneOrFail({
        relations: ['biodata'],
        where: { id },
      })

      if (user.biodata.isActive !== 'pending') {
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
      biodatasEntity.isActive = StatusUsers.REJECT
      biodatasEntity.reason = reason

      await this.biodatasRepository.update(biodataId, biodatasEntity)

      return await this.biodatasRepository.findOneOrFail({
        where: { user: { id } },
      })
    } catch (err) {
      throw err
    }
  }
}
