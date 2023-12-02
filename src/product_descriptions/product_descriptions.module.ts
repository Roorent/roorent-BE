import { Module } from '@nestjs/common';
import { ProductDescriptionsController } from './product_descriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDescriptions } from './entities/product_descriptions.entity';
import { ProductDescriptionsService } from './product_descriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDescriptions])],
  controllers: [ProductDescriptionsController],
  providers: [ProductDescriptionsService],
  exports: [ProductDescriptionsService]
})
export class ProductDescriptionsModule {}
