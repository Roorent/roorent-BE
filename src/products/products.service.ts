import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Products, ProductsType } from './enitities/products.entity'
import { ILike, EntityNotFoundError, Repository } from 'typeorm'
import { UsersService } from '#/users/users.service'
import { CreateProductsDTO } from './dto/create-products.dto'
import { CitiesService } from '#/cities/cities.service'
import { UpdateProductsDTO } from './dto/update-products.dto'
import { ProductDescriptions } from '#/product_descriptions/entities/product_descriptions.entity'
import { SpecialRules } from '#/special_rules/entities/special_rules.entity'
import { PhotoProducts } from '#/photo_products/entities/photo_products.entity'
import { Reviews } from '#/reviews/entities/reviews.entity'

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

  findAll() {
    return this.productsRepository.findAndCount({
      where: {
        active_status: true,
      },
      // skip: --page * limit,
      // take: limit,
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
      const productById = await this.productsRepository.findOneOrFail({
        where: { id },
        relations: {
          user: { biodata: true },
          cities: true,
          productDescriptions: true,
          specialRules: true,
          photoProducts: true,
        },
      })

      const data = {
        id: productById.id,
        name: productById.name,
        type: productById.type,
        stock: productById.stock,
        daily_price: productById.daily_price,
        monthly_price: productById.monthly_price,
        address: productById.address,
        active_status: productById.active_status,
        location: productById.location,
        city: productById.cities.name,
        photo: productById.photoProducts[0].photo,
        specifications: productById.productDescriptions.specifications,
        facilities: productById.productDescriptions.facilities,
        descriptions: productById.productDescriptions.descriptions,
        user_id: productById.user.id,
        user_name:
          productById.user.biodata.first_name +
          ' ' +
          productById.user.biodata.last_name,
        user_photo: productById.user.biodata.photo_profile,
        gender: productById.specialRules.gender,
        rules: productById.specialRules.rules,
        photoProducts: productById.photoProducts,
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
      productDescriptionsEntity.descriptions = payload.descriptions

      const specialRulesEntity = new SpecialRules()
      specialRulesEntity.gender = payload.gender
      specialRulesEntity.rules = payload.rules

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

      payload.photo.forEach(async (item) => {
        const photoProductsEntity = new PhotoProducts()
        photoProductsEntity.photo = item
        photoProductsEntity.products = insertProduct.identifiers[0].id
        await this.photoProductsRepository.insert(photoProductsEntity)
      })

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

  async update(id: any, payload: UpdateProductsDTO) {
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

      const productDescId = allProducts.productDescriptions.id
      const specialRulesId = allProducts.specialRules.id

      const dataProductDesc = {
        specifications: payload.specifications,
        facilities: payload.facilities,
        descriptions: payload.descriptions,
      }

      const dataSpecialRules = {
        gender: payload.gender,
        rules: payload.rules,
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

      
      payload.photo.map(async (value) => {
        await this.photoProductsRepository.delete({ products: id })
        const photoProductsEntity = new PhotoProducts()
        photoProductsEntity.products = id
        photoProductsEntity.photo = value
        await this.photoProductsRepository.insert(photoProductsEntity)
      })

      return await this.productsRepository.findOneOrFail({
        relations: {
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
      const photoProducts = await allProducts.photoProducts

      await this.productsRepository.softDelete(id)
      await this.productDescriptionsRepository.softDelete(productDescId)
      await this.specialRulesRepository.softDelete(specialRulesId)
      for (const photoProduct of photoProducts) {
        await this.photoProductsRepository.softDelete(photoProduct.id)
      }

      return 'Success'
    } catch (err) {
      throw err
    }
  }

  async listProductsByOwner(id: string, types: string) {
    try {
      let [data, count] = await this.productsRepository.findAndCount({
        where: { user: { id: id }, type: types },
        relations: {
          cities: true,
          photoProducts: true,
        },
      })

      const datas = data.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        stock: item.stock,
        daily_price: item.daily_price,
        monthly_price: item.monthly_price,
        address: item.address,
        photo: item.photoProducts[0]?.photo,
        active_status: item.active_status,
        location: item.location,
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
    search: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const [data, count] = await this.productsRepository.findAndCount({
      where: [
        { name: ILike(`%${search}%`) },
        { address: ILike(`%${search}%`) },
        {
          cities: {
            name: ILike(`%${search}%`),
          },
        },
      ],
      relations: {
        cities: true,
        productDescriptions: true,
        specialRules: true,
        photoProducts: true,
      },
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
