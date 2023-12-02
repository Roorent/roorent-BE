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
    private userRepository: UsersService,
    private citiesRepository: CitiesService,
    private productDescriptionsRepository: ProductDescriptionsService,
    private specialRulesRepository: SpecialRulesService,
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

  async create(createProductsDTO: CreateProductsDTO) {
    try {
      const findOneUserId = await this.userRepository.findOne(
        createProductsDTO.user_id,
      )
      const findOneCityId = await this.citiesRepository.findOne(
        createProductsDTO.city_id,
      )
      const findOneProductDescriptionsId =
        await this.productDescriptionsRepository.findOne(
          createProductsDTO.product_desc_id,
        )
      const findOneSpecialRulesId = await this.specialRulesRepository.findOne(
        createProductsDTO.special_rules_id,
      )

      const productsEntity = new Products()
      productsEntity.name = createProductsDTO.name
      productsEntity.type = createProductsDTO.type
      productsEntity.stock = createProductsDTO.stock
      productsEntity.daily_price = createProductsDTO.daily_price
      productsEntity.monthly_price = createProductsDTO.monthly_price
      productsEntity.address = createProductsDTO.address
      productsEntity.latitude = createProductsDTO.latitude
      productsEntity.longitude = createProductsDTO.longitude
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

  async update(id: string, updateProductsDTO: UpdateProductsDTO) {
    try {
      await this.findOneById(id)

      const productsEntity = new Products()
      productsEntity.name = updateProductsDTO.name
      productsEntity.type = updateProductsDTO.type
      productsEntity.stock = updateProductsDTO.stock
      productsEntity.daily_price = updateProductsDTO.daily_price
      productsEntity.monthly_price = updateProductsDTO.monthly_price
      productsEntity.address = updateProductsDTO.address
      productsEntity.latitude = updateProductsDTO.latitude
      productsEntity.longitude = updateProductsDTO.longitude

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
