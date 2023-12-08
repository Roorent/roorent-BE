import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Products } from './enitities/products.entity'
import { UsersModule } from '#/users/users.module'
import { CitiesModule } from '#/cities/cities.module'
import { PhotoProducts } from '#/photo_products/entities/photo_products.entity'
import { SpecialRules } from '#/special_rules/entities/special_rules.entity'
import { ProductDescriptions } from '#/product_descriptions/entities/product_descriptions.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Products,
      ProductDescriptions,
      SpecialRules,
      PhotoProducts,
    ]),
    UsersModule,
    CitiesModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
