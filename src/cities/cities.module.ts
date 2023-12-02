import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from './entities/cities.entity';
import { Products } from '#/products/enitities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cities, Products])],
  providers: [CitiesService],
  controllers: [CitiesController],
  exports: [CitiesService],
})
export class CitiesModule {}
