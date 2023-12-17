import { Module } from '@nestjs/common';
import { FavoritsController } from './favorits.controller';
import { FavoritsService } from './favorits.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorits } from './entities/favorits.entity';
import { UsersModule } from '#/users/users.module';
import { ProductsModule } from '#/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorits]), UsersModule, ProductsModule],
  controllers: [FavoritsController],
  providers: [FavoritsService]
})
export class FavProductModule {}
