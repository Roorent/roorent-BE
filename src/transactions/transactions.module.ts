import { Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { TransactionsController } from './transactions.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transactions } from './entities/transactions.entity'
import { UsersModule } from '#/users/users.module'
import { BanksModule } from '#/banks/banks.module'
import { RentApplicationsModule } from '#/rent_applications/rent_applications.module'
import { NotificationsModule } from '#/notifications/notifications.module'
import { Products } from '#/products/enitities/products.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions, Products]),
    UsersModule,
    BanksModule,
    RentApplicationsModule,
    NotificationsModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
