import { Module } from '@nestjs/common'
import { RentApplicationsService } from './rent_applications.service'
import { RentApplicationsController } from './rent_applications.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RentApplications } from './entities/rent_applications.entity'
import { UsersModule } from '#/users/users.module'
import { ProductsModule } from '#/products/products.module'
import { BanksModule } from '#/banks/banks.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([RentApplications]),
    UsersModule,
    ProductsModule,
    BanksModule,
  ],
  providers: [RentApplicationsService],
  controllers: [RentApplicationsController],
  exports: [RentApplicationsService],
})
export class RentApplicationsModule {}
