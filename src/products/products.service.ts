import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Products } from './enitities/products.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { UsersService } from '#/users/users.service'
import { CreateProductsDTO } from './dto/create-products.dto'
import { CitiesService } from '#/cities/cities.service'
import { SpecialRulesService } from '#/special_rules/special_rules.service'
import { ProductDescriptionsService } from '#/product_descriptions/product_descriptions.service'
import { UpdateProductsDTO } from './dto/update-products.dto'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private userService: UsersService,
    private citiesService: CitiesService,
    private productDescriptionsService: ProductDescriptionsService,
    private specialRulesService: SpecialRulesService,
  ) {}

  findAll() {
    return this.productsRepository.findAndCount({
      relations: {
        user: true,
        cities: true,
        productDescriptions: true,
        specialRules: true,
      },
    })
  }

  async findOneById(id: string) {
    try {
      return await this.productsRepository.findOneOrFail({
        where: { id },
        relations: {
          user: true,
          cities: true,
          productDescriptions: true,
          specialRules: true,
        },
      })
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Data not found',
        }
      } else {
        throw e
      }
    }
  }

  async create(payload: CreateProductsDTO) {
    try {
      const findOneUserId = await this.userService.findOne(
        payload.user_id,
      )
      const findOneCityId = await this.citiesService.findOne(
        payload.city_id,
      )
      const findOneProductDescriptionsId =
        await this.productDescriptionsService.findOne(
          payload.product_desc_id,
        )
      const findOneSpecialRulesId = await this.specialRulesService.findOne(
        payload.special_rules_id,
      )

      const productsEntity = new Products()
      productsEntity.name = payload.name
      productsEntity.type = payload.type
      productsEntity.stock = payload.stock
      productsEntity.daily_price = payload.daily_price
      productsEntity.monthly_price = payload.monthly_price
      productsEntity.address = payload.address
      productsEntity.latitude = payload.latitude
      productsEntity.longitude = payload.longitude
      productsEntity.user = findOneUserId
      productsEntity.cities = findOneCityId
      productsEntity.productDescriptions = findOneProductDescriptionsId
      productsEntity.specialRules = findOneSpecialRulesId

      const insertProduct = await this.productsRepository.insert(productsEntity)
      return await this.productsRepository.findOneOrFail({
        where: {
          id: insertProduct.identifiers[0].id,
        },
      })
    } catch (e) {
      throw e
    }
  }

  async update(id: string, payload:  UpdateProductsDTO) {
    try {
      await this.findOneById(id)

      const productsEntity = new Products()
      productsEntity.name = payload.name
      productsEntity.type = payload.type
      productsEntity.stock = payload.stock
      productsEntity.daily_price = payload.daily_price
      productsEntity.monthly_price = payload.monthly_price
      productsEntity.address = payload.address
      productsEntity.latitude = payload.latitude
      productsEntity.longitude = payload.longitude

      await this.productsRepository.update(id, productsEntity)

      return await this.productsRepository.findOneOrFail({
        where: {
          id,
        },
      })
    } catch (e) {
      throw e
    }
  }

  async softDeleteById(id: string) {
    try {
      await this.findOneById(id)
      await this.productsRepository.softDelete(id)
      return 'success'
    } catch (e) {
      throw e
    }
  }
}
