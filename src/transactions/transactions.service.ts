import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { BanksService } from '#/banks/banks.service';
import { UsersService } from '#/users/users.service';
import { RentApplicationsService } from '#/rent_applications/rent_applications.service';
import { CreateTransactionsDTO } from './dto/create-transactions.dto';
import { UpdateTransactionsDTO } from './dto/update-transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private bankService: BanksService,
    private userService: UsersService,
    private rentApplications: RentApplicationsService,
  ){}

  findAll(page: number = 1, limit: number = 10){
    return this.transactionsRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        user: true,
        banks: true,
        rentApplications: true,
      }
    })
  }

  async findOneById(id: string) {
    try {
      return await this.transactionsRepository.findOneOrFail({
        where: { id },
        relations: {
          user: true,
          banks: true,
          rentApplications: true,
        },
      })
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Data not found',
        }
      } else {
        throw err
      }
    }
  }

  async create(payload: CreateTransactionsDTO){
    try {
      const findOneUserId = await this.userService.findOne(payload.user_id)
      const findOneBankId = await this.bankService.findOneById(payload.bank_id)
      const findOneRentApplicationsId:any = await this.rentApplications.findOneById(payload.rent_application_id)

      const transactionsEntity = new Transactions()
      transactionsEntity.transaction_deadline = new Date(payload.transaction_deadline)
      transactionsEntity.transaction_proof = payload.transaction_proof
      transactionsEntity.transaction_type = payload.transaction_type
      transactionsEntity.user = findOneUserId
      transactionsEntity.banks = findOneBankId
      transactionsEntity.rentApplications = findOneRentApplicationsId

      const insertRentApplications = await this.transactionsRepository.insert(transactionsEntity)

      return await this.transactionsRepository.findOneOrFail({
        where: {
          id: insertRentApplications.identifiers[0].id
        }
      })
    } catch (err) {
      throw err
    }
  }

  async update(id: string, payload: UpdateTransactionsDTO){
    await this.findOneById(id)

    
    const transactionsEntity = new Transactions()
    transactionsEntity.transaction_deadline = new Date(payload.transaction_deadline)
    transactionsEntity.transaction_proof = payload.transaction_proof
    transactionsEntity.transaction_type = payload.transaction_type

    await this.transactionsRepository.update(id, transactionsEntity)

      return await this.transactionsRepository.findOneOrFail({
        where: {id}
      })
  }

  async softDeleteById(id: string) {
    try {
      await this.findOneById(id)
      await this.transactionsRepository.softDelete(id)
      return 'success'
    } catch (e) {
      throw e
    }
  }

  async approveTransactions(id: string, active: any) {
    try {
      await this.findOneById(id)
  
      const transactionsEntity = new Transactions()
      transactionsEntity.payment_status = active
  
      await this.transactionsRepository.update(id, transactionsEntity)
      return await this.transactionsRepository.findOneOrFail({
        where: {id},
        relations: {
          user: true,
          banks: true,
          rentApplications: true,
        },
      })
      
    } catch (err) {
      throw err
    }
  }

  async rejectTransactions(id: string, active: any) {
    try {
      await this.findOneById(id)
  
      const transactionsEntity = new Transactions()
      transactionsEntity.payment_status = active
  
      await this.transactionsRepository.update(id, transactionsEntity)
      return await this.transactionsRepository.findOneOrFail({
        where: {id},
        relations: {
          user: true,
          banks: true,
          rentApplications: true,
        },
      })
      
    } catch (err) {
      throw err
    }
  }
}
