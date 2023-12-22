import { Module } from '@nestjs/common';
import { BanksController } from './banks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banks } from './entities/banks.entity';
import { UsersModule } from '#/users/users.module';
import { BanksService } from './banks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Banks]), UsersModule],
  controllers: [BanksController],
  providers: [BanksService],
  exports: [BanksService]
})
export class BanksModule {}
