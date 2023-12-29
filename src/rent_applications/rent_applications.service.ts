import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RentApplications } from './entities/rent_applications.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { ProductsService } from '#/products/products.service'
import { UsersService } from '#/users/users.service'
import { CreateRentApplicationsDTO } from './dto/create-rent_applications.dto'
import { UpdateRentApplicationsDTO } from './dto/update-rent_applications.dto'
import { FEE } from '#/constant'
import { BanksService } from '#/banks/banks.service'

@Injectable()
export class RentApplicationsService {
  constructor(
    @InjectRepository(RentApplications)
    private rentApplicationsRepository: Repository<RentApplications>,
    private userService: UsersService,
    private productsService: ProductsService,
    private bankService: BanksService,
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
      const rentApp = await this.rentApplicationsRepository.findOneOrFail({
        where: { id },
        relations: {
          user: { biodata: true },
          product: {
            specialRules: true,
            productDescriptions: true,
            user: true,
            photoProducts: true,
          },
        },
      })

      const [users, count] = await this.userService.findAll()
      const userAdmin = users.filter((user) => user.level.name === 'admin')

      const bankAdmin = await this.bankService.findOneByUser(userAdmin[0].id)

      const data = {
        id: rentApp.id,
        lease_start: rentApp.lease_start,
        lease_expiration: rentApp.lease_expiration,
        rental_type: rentApp.rental_type,
        amount: rentApp.amount,
        fee: rentApp.fee,
        price: rentApp.price,
        total_price: rentApp.total_price,
        user_name:
          rentApp.user.biodata.first_name +
          ' ' +
          rentApp.user.biodata.last_name,
        user_nik: rentApp.user.biodata.nik,
        user_hp: rentApp.user.biodata.phone,
        user_gender: rentApp.user.biodata.gender,
        user_birthday: rentApp.user.biodata.birth_date,
        user_address: rentApp.user.biodata.address,
        product_id: rentApp.product.id,
        product_name: rentApp.product.name,
        product_photo: rentApp.product.photoProducts[0].photo,
        product_type: rentApp.product.type,
        product_label: rentApp.product.specialRules.gender,
        product_desc: rentApp.product.productDescriptions.descriptions,
        product_address: rentApp.product.address,
        adm_bank: bankAdmin,
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

  async create(id: string, userId: string, payload: CreateRentApplicationsDTO) {
    try {
      const findOneUser = await this.userService.findOne(userId)
      const findOneProduct: any = await this.productsService.findOneById(id)

      const startDate = new Date(payload.lease_start)
      const endDate = new Date(payload.lease_expiration)
      let amount: number

      if (payload.rental_type === 'bulanan') {
        amount = endDate.getMonth() - startDate.getMonth()
      } else if (payload.rental_type === 'harian') {
        amount = (endDate.getTime() - startDate.getTime()) / 86400000
      }

      let rentApp: any = {}
      if (payload.rental_type === 'harian') {
        rentApp.price = findOneProduct.daily_price
        rentApp.total_price = findOneProduct.daily_price * amount
      }
      if (payload.rental_type === 'bulanan') {
        rentApp.price = findOneProduct.monthly_price
        rentApp.total_price = findOneProduct.monthly_price * amount
      }

      let adminFee: any
      if (findOneProduct.type === 'kost') {
        adminFee = FEE.kos
      }
      if (findOneProduct.type === 'hotel') {
        adminFee = FEE.hotel
      }
      if (findOneProduct.type === 'gedung') {
        adminFee = FEE.gedung
      }

      const rentApplicationsEntity = new RentApplications()
      rentApplicationsEntity.lease_start = payload.lease_start
      rentApplicationsEntity.lease_expiration = payload.lease_expiration
      rentApplicationsEntity.rental_type = payload.rental_type
      rentApplicationsEntity.price = rentApp.price
      rentApplicationsEntity.total_price = rentApp.total_price
      rentApplicationsEntity.amount = amount
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
    } catch (err) {
      throw err
    }
  }
}
