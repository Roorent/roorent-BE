import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentApplications } from './entities/rent_applications.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { ProductsService } from '#/products/products.service';
import { UsersService } from '#/users/users.service';
import { CreateRentApplicationsDTO } from './dto/create-rent_applications.dto';
import { UpdateRentApplicationsDTO } from './dto/update-rent_applications.dto';

@Injectable()
export class RentApplicationsService {
  constructor(
    @InjectRepository(RentApplications)
    private rentApplicationsRepository: Repository<RentApplications>,
    private userService: UsersService,
    private productsService: ProductsService,
  ){}

  findAll(page: number = 1, limit: number = 10){
    return this.rentApplicationsRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        user: true,
        product: true,
      }
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

  async create(payload: CreateRentApplicationsDTO){
    try {
      const findOneUserId = await this.userService.findOne(payload.user_id)
      const findOneProductId:any = await this.productsService.findOneById(payload.product_id)

      const rentApplicationsEntity = new RentApplications()
      rentApplicationsEntity.lease_start = payload.lease_start
      rentApplicationsEntity.lease_expiration = payload.lease_expiration
      rentApplicationsEntity.rental_type = payload.rental_type
      rentApplicationsEntity.price = payload.price
      rentApplicationsEntity.total_price = payload.total_price
      rentApplicationsEntity.user = findOneUserId
      rentApplicationsEntity.product = findOneProductId

      const insertRentApplications = await this.rentApplicationsRepository.insert(rentApplicationsEntity)

      return await this.rentApplicationsRepository.findOneOrFail({
        where: {
          id: insertRentApplications.identifiers[0].id
        }
      })
    } catch (err) {
      throw err
    }
  }

  async update(id: string, payload: UpdateRentApplicationsDTO){
    try {
      await this.findOneById(id)

      const rentApplicationsEntity = new RentApplications()
      rentApplicationsEntity.lease_start = payload.lease_start
      rentApplicationsEntity.lease_expiration = payload.lease_expiration
      rentApplicationsEntity.rental_type = payload.rental_type
      rentApplicationsEntity.price = payload.price
      rentApplicationsEntity.total_price = payload.total_price
      
      await this.rentApplicationsRepository.update(id, rentApplicationsEntity)

      return await this.rentApplicationsRepository.findOneOrFail({
        where: {id}
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
