import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/user.entity';
import { LevelsModule } from '#/levels/levels.module';
import { Products } from '#/products/enitities/products.entity';
import { ProductsModule } from '#/products/products.module';


@Module({
  imports: [TypeOrmModule.forFeature([Users]), LevelsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
