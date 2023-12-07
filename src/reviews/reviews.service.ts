import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Reviews } from './entities/reviews.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { CreateReviewDTO } from './dto/create-review.dto'
import { UsersService } from '#/users/users.service'
import { UpdateReviewDTO } from './dto/update-review.dto'
import { ProductsService } from '#/products/products.service'

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    private userService: UsersService,
    private productService: ProductsService,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const sorter = 'ASC' // 'ASC' or 'DESC'

    const data = await this.reviewsRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      order: {
        rating: `${sorter}`,
      },
      relations: ['user', 'product'],
    })

    return data
  }

  async findOne(id: string) {
    try {
      return await this.reviewsRepository.findOneOrFail({ where: { id } })
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

  async create(payload: CreateReviewDTO) {
    try {
      if (payload.rating <= 0 || payload.rating > 5) {
        return 'Rating tidak sesuai'
      }

      const findUserId = await this.userService.findOne(payload.userId)
      const findProductId: any = await this.productService.findOneById(
        payload.productId,
      )

      const reviewEntity = new Reviews()
      reviewEntity.rating = payload.rating
      reviewEntity.content = payload.content
      reviewEntity.user = findUserId
      reviewEntity.product = findProductId

      const insertReview = await this.reviewsRepository.insert(reviewEntity)

      return this.reviewsRepository.findOneOrFail({
        where: {
          id: insertReview.identifiers[0].id,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async update(id: string, payload: UpdateReviewDTO) {
    try {
      await this.findOne(id)

      const reviewEntity = new Reviews()
      reviewEntity.rating = payload.rating
      reviewEntity.content = payload.content

      await this.reviewsRepository.update(id, payload)

      return await this.reviewsRepository.findOneOrFail({ where: { id } })
    } catch (err) {
      throw err
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      return await this.reviewsRepository.softDelete(id)
    } catch (err) {
      throw err
    }
  }

  async findByProduct(page: number = 1, limit: number = 10, productId: string) {
    const sorter = 'ASC' // 'ASC' or 'DESC'

    const [data, count] = await this.reviewsRepository.findAndCount({
      where: { product: { id: productId } },
      skip: --page * limit,
      take: limit,
      order: {
        rating: `${sorter}`,
      },
      relations: ['user', 'product'],
    })

    return [data, count]
  }
}
