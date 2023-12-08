import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Products } from './enitities/products.entity'
import { Like, EntityNotFoundError, Repository } from 'typeorm'
import { UsersService } from '#/users/users.service'
import { CreateProductsDTO } from './dto/create-products.dto'
import { CitiesService } from '#/cities/cities.service'
import { UpdateProductsDTO } from './dto/update-products.dto'
import { ProductDescriptions } from '#/product_descriptions/entities/product_descriptions.entity'
import { SpecialRules } from '#/special_rules/entities/special_rules.entity'
import { PhotoProducts } from '#/photo_products/entities/photo_products.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private userService: UsersService,
    private citiesService: CitiesService,
    @InjectRepository(ProductDescriptions)
    private productDescriptionsRepository: Repository<ProductDescriptions>,
    @InjectRepository(SpecialRules)
    private specialRulesRepository: Repository<SpecialRules>,
    @InjectRepository(PhotoProducts)
    private photoProductsRepository: Repository<PhotoProducts>,
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
        photoProducts: true,
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
          photoProducts: true,
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

  async create(
    payload: CreateProductsDTO,
  ) {
    try {
      const findOneUserId = await this.userService.findOne(payload.user_id)
      const findOneCityId = await this.citiesService.findOne(payload.city_id)

      const productDescriptionsEntity = new ProductDescriptions()
      productDescriptionsEntity.specifications = payload.specifications
      productDescriptionsEntity.facilities = payload.facilities
      productDescriptionsEntity.note = payload.note

      const specialRulesEntity = new SpecialRules()
      specialRulesEntity.max_person = payload.max_person
      specialRulesEntity.gender = payload.gender
      specialRulesEntity.note = payload.note
     
      const insertProductDescriptions = await this.productDescriptionsRepository.insert(productDescriptionsEntity)
      const insertSpecialRules = await this.specialRulesRepository.insert(specialRulesEntity)
      
      const productsEntity = new Products()
      productsEntity.name = payload.name
      productsEntity.type = payload.type
      productsEntity.stock = payload.stock
      productsEntity.daily_price = payload.daily_price
      productsEntity.monthly_price = payload.monthly_price
      productsEntity.address = payload.address
      productsEntity.location = payload.location
      productsEntity.user = findOneUserId
      productsEntity.cities = findOneCityId
      productsEntity.productDescriptions =  insertProductDescriptions.identifiers[0].id
      productsEntity.specialRules = insertSpecialRules.identifiers[0].id
      const insertProduct = await this.productsRepository.insert(productsEntity)

      
      const photoProductsEntity = new PhotoProducts()
      if (Array.isArray(payload.photo)) {
        photoProductsEntity.photo = payload.photo
      } else {
        photoProductsEntity.photo = [payload.photo]
      }
      photoProductsEntity.products = insertProduct.identifiers[0].id
      const insertPhotoProducts = await this.photoProductsRepository.insert(photoProductsEntity)

      return ([
        await this.productsRepository.findOneOrFail({
          where: {
            id: insertProduct.identifiers[0].id,
          },
        }),
        await this.productDescriptionsRepository.findOneOrFail({
          where: {
            id: insertProductDescriptions.identifiers[0].id,
          },
        }),
        await this.specialRulesRepository.findOneOrFail({
          where: {
            id: insertSpecialRules.identifiers[0].id,
          },
        }),
        await this.photoProductsRepository.findOneOrFail({
          where: {
            id: insertPhotoProducts.identifiers[0].id,
          },
        })
       ] )
    } catch (err) {
      throw err
    }
  }

  async update(id: string, payload: UpdateProductsDTO) {
    try {
      const allProducts = await this.productsRepository.findOneOrFail({
        where: {id},
        relations: {
          user: true,
          cities: true,
          productDescriptions: true,
          specialRules: true,
          photoProducts: true,
        },
      })

      const productDescId = await allProducts.productDescriptions.id
      const specialRulesId = await allProducts.specialRules.id
      const photoProductsId = await allProducts.photoProducts[0].id

      const dataProductDesc = {
        specifications: payload.specifications,
        facilities: payload.facilities,
        note: payload.note
      }

      const dataSpecialRules = {
        max_person: payload.max_person,
        gender: payload.gender,
        note: payload.note
      }

      const dataProducts = {
        name: payload.name,
        type : payload.type,
        stock : payload.stock,
        daily_price : payload.daily_price,
        monthly_price : payload.monthly_price,
        address : payload.address,
        location : payload.location
      }
      
      await this.productsRepository.update(id, dataProducts)
      await this.productDescriptionsRepository.update(productDescId, dataProductDesc)
      await this.specialRulesRepository.update(specialRulesId, dataSpecialRules)

      const dataPhotoProducts = {
        photo: payload.photo
      }
     await this.photoProductsRepository.update(photoProductsId, dataPhotoProducts)

      return await this.productsRepository.findOneOrFail({
        relations: {
          user: true,
          cities: true,
          productDescriptions: true,
          specialRules: true,
          photoProducts: true,
        },
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
      const allProducts = await this.productsRepository.findOneOrFail({
        where: {id},
        relations: {
          user: true,
          cities: true,
          productDescriptions: true,
          specialRules: true,
          photoProducts: true,
        },
      })

      const productDescId = await allProducts.productDescriptions.id
      const specialRulesId = await allProducts.specialRules.id
      const photoProductsId = await allProducts.photoProducts[0].id
      
      await this.productsRepository.softDelete(id)
      await this.productDescriptionsRepository.softDelete(productDescId)
      await this.specialRulesRepository.softDelete(specialRulesId)
      await this.photoProductsRepository.softDelete(photoProductsId)

      return 'Success'
    } catch (err) {
      throw err
    }
  }

  async listProductsByOwner(id: string) {
    try {
      const owner = await this.userService.findOne(id)
      return await this.productsRepository.findOneOrFail({
        where: { user: { id: owner.id } },
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

  async listProductsWithSearch(
    searchCriteria: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const [data, count] = await this.productsRepository.findAndCount({
      where: [
        { name: Like(`%${searchCriteria}%`) },
        { type: Like(`%${searchCriteria}%`) },
        { address: Like(`%${searchCriteria}%`) },
      ],
      take: limit,
      skip: (page - 1) * limit,
    })

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }
}
