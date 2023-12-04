import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PhotoProducts } from './entities/photo_products.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { ProductsService } from '#/products/products.service'
import { CreatePhotoProductsDTO } from './dto/create-photo_products.dto'
import { UpdatePhotoProductsDTO } from './dto/update-photo_products.dto'

@Injectable()
export class PhotoProductsService {
  constructor(
    @InjectRepository(PhotoProducts)
    private photoProductsRepository: Repository<PhotoProducts>,
    private productsService: ProductsService,
  ) {}

  findAll(page: number = 1 , limit: number = 10) {
    return this.photoProductsRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        products: true,
      },
    })
  }

  async findOneById(id: string) {
    try {
      return await this.photoProductsRepository.findOneOrFail({
        where: { id },
        relations: { products: true },
      })
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'data not found',
          },
          HttpStatus.NOT_FOUND,
        )
      } else {
        throw e
      }
    }
  }

  async create(payload: CreatePhotoProductsDTO) {
   try {
    const findOneProductId: any = await this.productsService.findOneById(
      payload.product_id
    )

    const photoProductsEntity = new PhotoProducts()
    if (Array.isArray(payload.photo)) {
      photoProductsEntity.photo = payload.photo;
    } else {
      photoProductsEntity.photo = [payload.photo];
    }
    
    // photoProductsEntity.photo = payload.photo
    photoProductsEntity.products = findOneProductId

    const insertPhotoProducts = await this.photoProductsRepository.insert(photoProductsEntity)
    return await this.photoProductsRepository.findOneOrFail({
      where: {
        id: insertPhotoProducts.identifiers[0].id,
      },
    })
   } catch (e) {
    throw e
   }
  }

  async update(id: string, payload: UpdatePhotoProductsDTO) {
    try {
      await this.findOneById(id)

      const photoProductsEntity = new PhotoProducts()
      if (Array.isArray(payload.photo)) {
        photoProductsEntity.photo = payload.photo;
      } else {
        photoProductsEntity.photo = [payload.photo];
      }
      // photoProductsEntity.photo = payload.photo

      await this.photoProductsRepository.update(id, photoProductsEntity)

      return await this.photoProductsRepository.findOneOrFail({
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

      await this.photoProductsRepository.softDelete(id)

      return 'success'
    } catch (e) {
      throw e
    }
  }
}
