import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Reviews } from './entities/reviews.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { CreateReviewDTO } from './dto/create-review.dto'
import { UsersService } from '#/users/users.service'
import { UpdateReviewDTO } from './dto/update-review.dto'
import { ProductsService } from '#/products/products.service'
import { PhotoReviews } from '#/photo_reviews/entities/photo_reviews.entity'
import { TransactionsService } from '#/transactions/transactions.service'
import { Transactions } from '#/transactions/entities/transactions.entity'

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    @InjectRepository(PhotoReviews)
    private photoReviewsRepository: Repository<PhotoReviews>,
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private transactionsService: TransactionsService,
    private userService: UsersService,
    private productService: ProductsService,
  ) {}

  async findAllreviews(page: number = 1, limit: number = 10) {
    const [data,count] = await this.reviewsRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        user: {biodata: true},
        photoReviews: true,
        transactions: true,
      },
    })

    const reviewsData = data.map((item) =>({
      id: item.id,
      rating: item.rating,
      content: item.content,
      photo1: item.photoReviews[0]?.photo,
      photo2: item.photoReviews[1]?.photo,
      photo3: item.photoReviews[2]?.photo,
      user_name: item.user.biodata.first_name + ' ' + item.user.biodata.last_name,
      // transactions: item.transactions,
      createdAt: item.createdAt
    }))

    return {
      count,
      reviewsData
    }
  }

  async findAllByBadRating(page: number = 1, limit: number = 10) {
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

  async create(id: string, userId: string, payload: CreateReviewDTO) {
    try {
      if (payload.rating <= 0 || payload.rating > 5) {
        return 'Rating tidak sesuai'
      }

      const findOneUser = await this.userService.findOne(userId)
      const findOneProduct: any = await this.productService.findOneById(id)

      const findTransactionByProduct =
        await this.transactionsRepository.findOneOrFail({
          where: {
            rentApplications: { product: { id } },
            user: { id: userId },
          },
          relations: { rentApplications: { product: true }, user: true },
        })

      const reviewEntity = new Reviews()
      reviewEntity.rating = payload.rating
      reviewEntity.content = payload.content
      reviewEntity.user = findOneUser
      reviewEntity.product = findOneProduct
      reviewEntity.transactions = findTransactionByProduct

      const insertReviews = await this.reviewsRepository.insert(reviewEntity)

      payload.photo.forEach(async (item) => {
        const photoReviewsEntity = new PhotoReviews()
        photoReviewsEntity.photo = item 
        photoReviewsEntity.reviews = insertReviews.identifiers[0].id
        await this.photoReviewsRepository.insert(
          photoReviewsEntity,
        )
      })
      // const insertPhotoReviews = await this.photoReviewsRepository.insert(
      //   photoReviewsEntity,
      // )

      // return await this.photoReviewsRepository.findOneOrFail({
      //   where: {
      //     id: insertPhotoReviews.identifiers[0].id,
      //   },
      //   relations: { reviews: true },
      // })
      return (
        this.findAllByBadRating()
      )
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
      relations: ['user.biodata', 'product', 'photoReviews', 'transactions'],
    })

    const reviewsData = data.map((item) =>({
      id: item.id,
      rating: item.rating,
      content: item.content,
      photo: item.photoReviews,
      user_name: item.user.biodata.first_name + ' ' + item.user.biodata.last_name,
      // transactions: item.transactions,
      createdAt: item.createdAt
    }))

    return [reviewsData, count]
  }

  async findByTrancations(page: number = 1, limit: number = 10, trancationsId: string) {
    const sorter = 'ASC' // 'ASC' or 'DESC'

    const [data, count] = await this.reviewsRepository.findAndCount({
      where: { transactions: { id: trancationsId } },
      skip: --page * limit,
      take: limit,
      order: {
        rating: `${sorter}`,
      },
      relations: ['user.biodata', 'product', 'photoReviews', 'transactions'],
    })

    const reviewsData = data.map((item) =>({
      id: item.id,
      rating: item.rating,
      content: item.content,
      photo: item.photoReviews,
      user_name: item.user.biodata.first_name + ' ' + item.user.biodata.last_name,
      // transactions: item.transactions,
      createdAt: item.createdAt
    }))

    return [reviewsData, count]
  }
}
