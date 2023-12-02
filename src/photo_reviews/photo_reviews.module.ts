import { Module } from '@nestjs/common';
import { PhotoReviewsService } from './photo_reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoReviews } from './entities/photo_reviews.entity';
import { ReviewsModule } from '#/reviews/reviews.module';
import { PhotoReviewsController } from './photo_reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoReviews]), ReviewsModule],
  providers: [PhotoReviewsService],
  exports: [PhotoReviewsService],
  controllers: [PhotoReviewsController]
})
export class PhotoReviewsModule {}
