import { Injectable, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Favorits } from './entities/favorits.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { UsersService } from '#/users/users.service'
import { ProductsService } from '#/products/products.service'

@Injectable()
export class FavoritsService {
  constructor(
    @InjectRepository(Favorits)
    private favoritRepository: Repository<Favorits>,
    private userService: UsersService,
    private productService: ProductsService,
  ) {}

  findAll(page: number = 1, limit: number = 10) {
    return this.favoritRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        user: true,
        product: true,
      },
    })
  }

  async create(id: string, userId: string) {
    try {
      const findUserId = await this.userService.findOne(userId)
      const findProductId: any = await this.productService.findOneById(id)
      const favoritEntity = new Favorits()
      favoritEntity.user = findUserId
      favoritEntity.product = findProductId

      const insertFavorit = await this.favoritRepository.insert(favoritEntity)

      return this.favoritRepository.findOneOrFail({
        where: {
          id: insertFavorit.identifiers[0].id,
        },
        relations: {
          user: true,
          product: true,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async findOne(id: string) {
    try {
      return await this.favoritRepository.findOneOrFail({ where: { id } })
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

  async remove(id: string) {
    try {
      await this.findOne(id)
      return await this.favoritRepository.softDelete(id)
    } catch (err) {
      throw err
    }
  }
}
