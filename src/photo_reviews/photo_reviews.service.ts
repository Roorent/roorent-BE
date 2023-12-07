import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PhotoReviews } from './entities/photo_reviews.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { ReviewsService } from '#/reviews/reviews.service'
import { CreatePhotoReviewsDTO } from './dto/create-photo_reviews.dto'
import { UpdatePhotoReviewsDTO } from './dto/update-photo_reviews.dto'

@Injectable()
export class PhotoReviewsService {
  constructor(
    @InjectRepository(PhotoReviews)
    private photoReviewsRepository: Repository<PhotoReviews>,
    private reviewsService: ReviewsService,
  ) {}

  findAll(page: number = 1, limit: number = 10) {
    return this.photoReviewsRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        reviews: true,
      },
    })
  }

  async findOneById(id: string) {
    try {
      return await this.photoReviewsRepository.findOneOrFail({
        where: { id },
        relations: { reviews: true },
      })
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'data not found',
          },
          HttpStatus.NOT_FOUND,
        )
      } else {
        throw err
      }
    }
  }

  async create(payload: CreatePhotoReviewsDTO) {
    try {
      const findOneReviewId: any = await this.reviewsService.findOne(
        payload.review_id,
      )

      const photoReviewsEntity = new PhotoReviews()
      // if (Array.isArray(payload.photo)) {
      //   photoReviewsEntity.photo = payload.photo;
      // } else {
      //   photoReviewsEntity.photo = [payload.photo];
      // }

      photoReviewsEntity.photo = payload.photo
      photoReviewsEntity.reviews = findOneReviewId

      const insertPhotoReviews = await this.photoReviewsRepository.insert(
        photoReviewsEntity,
      )
      return await this.photoReviewsRepository.findOneOrFail({
        where: {
          id: insertPhotoReviews.identifiers[0].id,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async update(id: string, payload: UpdatePhotoReviewsDTO) {
    try {
      await this.findOneById(id)

      const photoReviewsEntity = new PhotoReviews()
      // if (Array.isArray(payload.photo)) {
      //   photoReviewsEntity.photo = payload.photo;
      // } else {
      //   photoReviewsEntity.photo = [payload.photo];
      // }
      photoReviewsEntity.photo = payload.photo

      await this.photoReviewsRepository.update(id, photoReviewsEntity)

      return await this.photoReviewsRepository.findOneOrFail({
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
      await this.findOneById(id)

      await this.photoReviewsRepository.softDelete(id)

      return 'success'
    } catch (err) {
      throw err
    }
  }
}
