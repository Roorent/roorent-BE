import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Products, ProductsType } from './enitities/products.entity'
import { Like, EntityNotFoundError, Repository } from 'typeorm'
import { UsersService } from '#/users/users.service'
import { CreateProductsDTO } from './dto/create-products.dto'
import { CitiesService } from '#/cities/cities.service'
import { UpdateProductsDTO } from './dto/update-products.dto'
import { ProductDescriptions } from '#/product_descriptions/entities/product_descriptions.entity'
import { SpecialRules } from '#/special_rules/entities/special_rules.entity'
import { PhotoProducts } from '#/photo_products/entities/photo_products.entity'
import { Reviews } from '#/reviews/entities/reviews.entity'
import { log } from 'console'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private userService: UsersService,
    private citiesService: CitiesService,
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    @InjectRepository(ProductDescriptions)
    private productDescriptionsRepository: Repository<ProductDescriptions>,
    @InjectRepository(SpecialRules)
    private specialRulesRepository: Repository<SpecialRules>,
    @InjectRepository(PhotoProducts)
    private photoProductsRepository: Repository<PhotoProducts>,
  ) {}

  findAllKos(page: number = 1, limit: number = 10) {
    return this.productsRepository.findAndCount({
      where: {
        type: ProductsType.KOS,
        active_status: true,
      },
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

  findAllHotel(page: number = 1, limit: number = 10) {
    return this.productsRepository.findAndCount({
      where: {
        type: ProductsType.HOTEL,
        active_status: true,
      },
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

  findAllGedung(page: number = 1, limit: number = 10) {
    return this.productsRepository.findAndCount({
      where: {
        type: ProductsType.GEDUNG,
        active_status: true,
      },
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

  async create(userId: string, payload: CreateProductsDTO) {
    try {
      const findOneUserId = await this.userService.findOne(userId)
      const findCity = await this.citiesService.findOneByName(payload.city)
      const cityId: any = findCity.id

      if (findOneUserId.level.name !== 'owner') {
        return 'Only Owner can create products'
      }

      const productDescriptionsEntity = new ProductDescriptions()
      productDescriptionsEntity.specifications = payload.specifications
      productDescriptionsEntity.facilities = payload.facilities
      productDescriptionsEntity.note = payload.note

      const specialRulesEntity = new SpecialRules()
      specialRulesEntity.gender = payload.gender
      specialRulesEntity.notes = payload.notes

      const insertProductDescriptions =
        await this.productDescriptionsRepository.insert(
          productDescriptionsEntity,
        )
      const insertSpecialRules = await this.specialRulesRepository.insert(
        specialRulesEntity,
      )

      const productsEntity = new Products()
      productsEntity.name = payload.name
      productsEntity.type = payload.type
      productsEntity.stock = payload.stock
      productsEntity.daily_price = payload.daily_price
      productsEntity.monthly_price = payload.monthly_price
      productsEntity.address = payload.address
      productsEntity.location = payload.location
      productsEntity.user = findOneUserId
      productsEntity.cities = cityId
      productsEntity.productDescriptions =
        insertProductDescriptions.identifiers[0].id
      productsEntity.specialRules = insertSpecialRules.identifiers[0].id
      const insertProduct = await this.productsRepository.insert(productsEntity)

      const photoProductsEntity = new PhotoProducts()

      payload.photo.forEach(async (item) => {
        photoProductsEntity.photo = item
        photoProductsEntity.products = insertProduct.identifiers[0].id
        await this.photoProductsRepository.insert(photoProductsEntity)
      })

      // photoProductsEntity.photo = payload.photo
      // photoProductsEntity.products = insertProduct.identifiers[0].id
      // await this.photoProductsRepository.insert(photoProductsEntity)

      return await this.productsRepository.findOneOrFail({
        where: {
          id: insertProduct.identifiers[0].id,
        },
        relations: {
          user: true,
          cities: true,
          productDescriptions: true,
          specialRules: true,
          photoProducts: true,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async update(id: string, payload: UpdateProductsDTO) {
    try {
      const allProducts = await this.productsRepository.findOneOrFail({
        where: { id },
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
        note: payload.note,
      }

      const dataSpecialRules = {
        gender: payload.gender,
        note: payload.note,
      }

      const dataProducts = {
        name: payload.name,
        type: payload.type,
        stock: payload.stock,
        daily_price: payload.daily_price,
        monthly_price: payload.monthly_price,
        address: payload.address,
        location: payload.location,
      }

      await this.productsRepository.update(id, dataProducts)
      await this.productDescriptionsRepository.update(
        productDescId,
        dataProductDesc,
      )
      await this.specialRulesRepository.update(specialRulesId, dataSpecialRules)

      const dataPhotoProducts = {
        photo: payload.photo[0],
      }
      await this.photoProductsRepository.update(
        photoProductsId,
        dataPhotoProducts,
      )

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
        where: { id },
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

  async listProductsByOwner(id: string, types: string) {
    try {
      let data: any, count: any

      if (types === 'semua') {
        ;[data, count] = await this.photoProductsRepository.findAndCount({
          relations: { products: { user: true } },
          where: { products: { user: { id: id } } },
          order: { updatedAt: 'DESC' },
        })
      } else {
        ;[data, count] = await this.photoProductsRepository.findAndCount({
          relations: { products: { user: true } },
          where: { products: { user: { id: id }, type: types } },
          order: { updatedAt: 'DESC' },
        })
      }

      const datas = data.map((item) => ({
        id: item.products.id,
        photo: item.photo,
        name: item.products.name,
        type: item.products.type,
        stock: item.products.stock,
        daily_price: item.products.daily_price,
        monthly_price: item.products.monthly_price,
        address: item.products.address,
        active_status: item.products.active_status,
        location: item.products.location,
      }))

      return [datas, count]
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

  async recommendProductKos(
    city: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const findCity = await this.citiesService.findOneByName(city)
    const cityId: any = findCity.id

    return await this.productsRepository.findAndCount({
      where: {
        type: ProductsType.KOS,
        active_status: true,
        cities: { id: cityId },
      },
      skip: --page * limit,
      take: limit,
      relations: {
        cities: true,
      },
    })
  }

  async recommendProductHotel(
    city: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const findCity = await this.citiesService.findOneByName(city)
    const cityId: any = findCity.id

    return await this.productsRepository.findAndCount({
      where: {
        type: ProductsType.HOTEL,
        active_status: true,
        cities: { id: cityId },
      },
      skip: --page * limit,
      take: limit,
      relations: {
        cities: true,
      },
    })
  }

  async recommendProductGedung(
    city: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const findCity = await this.citiesService.findOneByName(city)
    const cityId: any = findCity.id

    return await this.productsRepository.findAndCount({
      where: {
        type: ProductsType.GEDUNG,
        active_status: true,
        cities: { id: cityId },
      },
      skip: --page * limit,
      take: limit,
      relations: {
        cities: true,
      },
    })
  }

  // async popularProduct(productId: any) {
  //   const sorter = 'DESC' // 'ASC' or 'DESC'

  //   const [data, count] = await this.reviewsRepository.findAndCount({
  //     where: { product: { id: productId } },
  //     order: {
  //       rating: `${sorter}`,
  //     },
  //     relations: ['product'],
  //   })

  //   return [data, count]
  // }
}
