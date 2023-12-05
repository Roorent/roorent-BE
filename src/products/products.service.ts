import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Products } from './enitities/products.entity'
import { Like, EntityNotFoundError, Repository } from 'typeorm'
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

  findAll(page: number = 1, limit: number = 10) {
    return this.productsRepository.findAndCount({
      skip: --page * limit,
      take: limit,
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
      const findOneUserId = await this.userService.findOne(payload.user_id)
      const findOneCityId = await this.citiesService.findOne(payload.city_id)
      const findOneProductDescriptionsId =
        await this.productDescriptionsService.findOne(payload.product_desc_id)
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

  async update(id: string, payload: UpdateProductsDTO) {
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

  async listProductsByOwner(id: string) {
    try {
      const owner = await this.userService.findOne(id)
      return await this.productsRepository.findOneOrFail({
        where: { user: { id: owner.id } },
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

  async deactivateProductOwner(id: string) {
    try {
      const owner = await this.userService.findOne(id)
      await this.productsRepository.update(
        { user: { id: owner.id } },
        { active_status: false },
      )
      return {
        statusCode: HttpStatus.OK,
        message: 'Owner products deactivated successfully',
      }
    } catch (err) {
      throw err
    }
  }

  async listProductsWithSearch(searchCriteria: string, page: number = 1, limit: number = 10) {
    const [data, count] = await this.productsRepository.findAndCount({
      where: [
        { type: Like(`%${searchCriteria}%`) }, // Adjust this based on your entity's properties
        // Add other criteria for search based on your entity properties
      ],
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      count,
      data,
    };
  }
}
