import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/user.entity';
import { LevelsModule } from '#/levels/levels.module';
import { Biodatas } from '#/biodatas/entities/biodatas.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Users]),TypeOrmModule.forFeature([Biodatas]), LevelsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
