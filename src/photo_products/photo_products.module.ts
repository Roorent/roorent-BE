import { Module } from '@nestjs/common'
import { PhotoProductsService } from './photo_products.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PhotoProducts } from './entities/photo_products.entity'
import { ProductsModule } from '#/products/products.module'
import { ProductsService } from '#/products/products.service'
import { PhotoProductsController } from './photo_products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoProducts]), ProductsModule],
  providers: [PhotoProductsService],
  exports: [PhotoProductsService],
  controllers: [PhotoProductsController]
})
export class PhotoProductsModule {}
