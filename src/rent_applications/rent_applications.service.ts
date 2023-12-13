import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RentApplications } from './entities/rent_applications.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { ProductsService } from '#/products/products.service'
import { UsersService } from '#/users/users.service'
import { CreateRentApplicationsDTO } from './dto/create-rent_applications.dto'
import { UpdateRentApplicationsDTO } from './dto/update-rent_applications.dto'

@Injectable()
export class RentApplicationsService {
  constructor(
    @InjectRepository(RentApplications)
    private rentApplicationsRepository: Repository<RentApplications>,
    private userService: UsersService,
    private productsService: ProductsService,
  ) {}

  findAll(page: number = 1, limit: number = 10) {
    return this.rentApplicationsRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        user: true,
        product: true,
      },
    })
  }

  async findOneById(id: string) {
    try {
      return await this.rentApplicationsRepository.findOneOrFail({
        where: { id },
        relations: {
          user: true,
          product: true,
        },
      })
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

  async create(id: string, userId: string, payload: CreateRentApplicationsDTO) {
    try {
      const findOneUser = await this.userService.findOne(userId)
      const findOneProduct: any = await this.productsService.findOneById(id)

      let rentApp: any = {};
      if (payload.rental_type === 'harian') {
        rentApp.price = findOneProduct.daily_price
        rentApp.total_price = findOneProduct.daily_price * payload.amount
      } if (payload.rental_type === 'bulanan') {
        rentApp.price = findOneProduct.monthly_price
        rentApp.total_price = findOneProduct.monthly_price * payload.amount
      }

      const fee = {
        kos: 5,
        gedung: 10,
        hotel: 10
      }

      let adminFee:  any
      if(findOneProduct.type === 'Kos'){
        adminFee = fee.kos
      } if (findOneProduct.type === 'Hotel'){
        adminFee = fee.hotel
      } if (findOneProduct.type === 'Gedung'){
        adminFee = fee.gedung
      }

      const rentApplicationsEntity = new RentApplications()
      rentApplicationsEntity.lease_start = payload.lease_start
      rentApplicationsEntity.lease_expiration = payload.lease_expiration
      rentApplicationsEntity.rental_type = payload.rental_type
      rentApplicationsEntity.price = rentApp.price
      rentApplicationsEntity.total_price = rentApp.total_price
      rentApplicationsEntity.fee = adminFee
      rentApplicationsEntity.user = findOneUser
      rentApplicationsEntity.product = findOneProduct

      const insertRentApplications =
        await this.rentApplicationsRepository.insert(rentApplicationsEntity)

      return await this.rentApplicationsRepository.findOneOrFail({
        where: {
          id: insertRentApplications.identifiers[0].id,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async update(id: string, payload: UpdateRentApplicationsDTO) {
    try {
      const transactionsId =
        await this.rentApplicationsRepository.findOneOrFail({
          where: { id },
        })

      if (!transactionsId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        )
      }

      const rentApplicationsEntity = new RentApplications()
      rentApplicationsEntity.lease_start = new Date(payload.lease_start)
      rentApplicationsEntity.lease_expiration = new Date(
        payload.lease_expiration,
      )

      await this.rentApplicationsRepository.update(id, rentApplicationsEntity)

      return await this.rentApplicationsRepository.findOneOrFail({
        where: { id },
      })
    } catch (err) {
      throw err
    }
  }

  async softDeleteById(id: string) {
    try {
      await this.findOneById(id)
      await this.rentApplicationsRepository.softDelete(id)
      return 'success'
    } catch (e) {
      throw e
    }
  }
}
