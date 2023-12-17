import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/user.entity';
import { LevelsModule } from '#/levels/levels.module';
import { BiodatasModule } from '#/biodatas/biodatas.module';
import { Biodatas } from '#/biodatas/entities/biodatas.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Users, Biodatas]), LevelsModule, BiodatasModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
