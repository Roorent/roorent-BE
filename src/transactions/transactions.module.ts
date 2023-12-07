import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions.entity';
import { UsersModule } from '#/users/users.module';
import { BanksModule } from '#/banks/banks.module';
import { RentApplicationsModule } from '#/rent_applications/rent_applications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions]), UsersModule, BanksModule, RentApplicationsModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService]
})
export class TransactionsModule {}
