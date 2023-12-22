import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reviews } from './entities/reviews.entity'
import { ReviewsService } from './reviews.service'
import { ReviewsController } from './reviews.controller'
import { UsersModule } from '#/users/users.module'
import { ProductsModule } from '#/products/products.module'
import { PhotoReviews } from '#/photo_reviews/entities/photo_reviews.entity'
import { TransactionsModule } from '#/transactions/transactions.module'
import { Transactions } from '#/transactions/entities/transactions.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Reviews, PhotoReviews, Transactions]),
    UsersModule,
    ProductsModule,
    TransactionsModule,
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
