import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reviews } from './entities/reviews.entity'
import { ReviewsService } from './reviews.service'
import { ReviewsController } from './reviews.controller'
import { UsersModule } from '#/users/users.module'
import { ProductsModule } from '#/products/products.module'

@Module({
  imports: [TypeOrmModule.forFeature([Reviews]), UsersModule, ProductsModule],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
