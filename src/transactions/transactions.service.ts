import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  PaymentStatus,
  TransactionType,
  Transactions,
} from './entities/transactions.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { BanksService } from '#/banks/banks.service'
import { UsersService } from '#/users/users.service'
import { RentApplicationsService } from '#/rent_applications/rent_applications.service'
import { CreateTransactionsDTO } from './dto/create-transactions.dto'
import { UpdateTransactionsDTO } from './dto/update-transactions.dto'
import { approveRejectDTO } from './dto/approveReject.dto'
import puppeteer from 'puppeteer'
import { NotificationsService } from '#/notifications/notifications.service'
import { generatePaymentNumber } from '#/utils/generate'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private bankService: BanksService,
    private userService: UsersService,
    private rentApplicationsService: RentApplicationsService,
    private notificationService: NotificationsService,
  ) {}

  findAll(page: number = 1, limit: number = 10) {
    return this.transactionsRepository.findAndCount({
      skip: --page * limit,
      take: limit,
      relations: {
        user: true,
        banks: true,
        rentApplications: { product: true },
      },
    })
  }

  listAllOwner(page: number = 1, limit: number = 10) {
    return this.transactionsRepository.findAndCount({
      where: {
        transaction_type: TransactionType.OWNER,
      },
      skip: --page * limit,
      take: limit,
      relations: {
        user: true,
        banks: true,
        rentApplications: { product: true },
      },
    })
  }

  async listAllRenter(page: number = 1, limit: number = 10) {
    const [data, count] = await this.transactionsRepository.findAndCount({
      where: {
        transaction_type: TransactionType.RENTER,
        payment_status: PaymentStatus.PENDING,
      },
      skip: --page * limit,
      take: limit,
      relations: {
        user: {biodata: true},
        rentApplications: { product: true },
      },
    })
    
    const transactionsData = data.map((item) => ({
      id: item.id,
      trans_proof: item.transaction_proof,
      user_name: item.user.biodata.first_name + ' ' + item.user.biodata.last_name,
      product_name: item.rentApplications.product.name,
      price: item.rentApplications.price,
      amount: item.rentApplications.amount,
      total_price:item.rentApplications.total_price,
      createdAt: item.createdAt,
    }))

    return {
      count,
      transactionsData
    };
  }

  async listTransactionsByRenter(id: string, status: any, page: number = 1, limit: number = 90) {
    try {
      let [data, count] = await this.transactionsRepository.findAndCount({
        where: { user: { id: id }, payment_status: status},
        relations: {
          user: {biodata: true},
          rentApplications: {product: {specialRules: true, photoProducts: true}}
        },
        skip: --page * limit,
        take: limit,
      })

      const transactionsData = data.map((item) => ({
        id: item.id,
        payment_code: item.payment_code,
        payment_status: item.payment_status,
        product_name: item.rentApplications.product.name,
        product_address: item.rentApplications.product.address,
        product_type: item.rentApplications.product.type,
        product_gender: item.rentApplications.product.specialRules.gender,
        product_photo: item.rentApplications.product.photoProducts[0]?.photo,
        user_name: item.user.biodata.first_name + ' ' + item.user.biodata.last_name,
        price: item.rentApplications.price,
        amount: item.rentApplications.amount,
        total_price:item.rentApplications.total_price,
        createdAt: item.createdAt,
      }))

      return {
        count,
        transactionsData
      };
      
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

  async listTransactionsByOwner(id: string) {
    try {
      const owner = await this.userService.findOne(id)
      return await this.transactionsRepository.findOneOrFail({
        where: { user: { id: owner.id } },
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

  async listTransactionsRenterByOwner(id: string) {
    try {
      const renter: any = await this.rentApplicationsService.findOneById(id)

      const [data, count] = await this.transactionsRepository.findAndCount({
        where: { rentApplications: { product: renter.id } },
        relations: {
          user: true,
          banks: true,
          rentApplications: { product: true },
        },
      })

      return [data, count]
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

  async getDetailRenterById(id: string) {
    try {
      const transactionRenterByRentApp =
        await this.transactionsRepository.findOneOrFail({
          where: {
            transaction_type: TransactionType.RENTER,
            rentApplications: { id },
          },
        })

      const data = {
        id: transactionRenterByRentApp.id,
        payment_code: transactionRenterByRentApp.payment_code,
        payment_status: transactionRenterByRentApp.payment_status,
        transaction_proof: transactionRenterByRentApp.transaction_proof,
        transaction_type: transactionRenterByRentApp.transaction_type,
        reason: transactionRenterByRentApp.reason,
      }

      return data
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

  async getDetailOwnerById(id: string) {
    try {
      return await this.transactionsRepository.findOneOrFail({
        where: {
          transaction_type: TransactionType.OWNER,
          id,
        },
        relations: {
          user: true,
          banks: true,
          rentApplications: { product: true },
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

  async findOneById(id: string) {
    try {
      const transactionsId = await this.transactionsRepository.findOneOrFail({
        where: { id },
        relations: {
          user: {biodata: true},
          banks: true,
          rentApplications: {product: {specialRules: true, photoProducts: true}}
        },
      })

      const data = {
        id: transactionsId.id,
        payment_code: transactionsId.payment_code,
        payment_status: transactionsId.payment_status,
        product_id: transactionsId.rentApplications.product.id,
        product_name: transactionsId.rentApplications.product.name,
        product_address: transactionsId.rentApplications.product.address,
        product_type: transactionsId.rentApplications.product.type,
        product_gender: transactionsId.rentApplications.product.specialRules.gender,
        product_photo: transactionsId.rentApplications.product.photoProducts[0]?.photo,
        user_name: transactionsId.user.biodata.first_name + ' ' + transactionsId.user.biodata.last_name,
        price: transactionsId.rentApplications.price,
        amount: transactionsId.rentApplications.amount,
        lease_start: transactionsId.rentApplications.lease_start,
        lease_expiration: transactionsId.rentApplications.lease_expiration,
        rental_type: transactionsId.rentApplications.rental_type,
        total_price:transactionsId.rentApplications.total_price,
        createdAt: transactionsId.createdAt,
      }

      return data
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

  async createRenter(
    id: string,
    userId: string,
    payload: CreateTransactionsDTO,
  ) {
    try {
      const findOneUserId = await this.userService.findOne(userId)

      const findOneRentApplicationsId: any =
        await this.rentApplicationsService.findOneById(id)

      const expiredTime = Date.now() + 60 * 60 * 1000 * 3

      const transactionsEntity = new Transactions()
      transactionsEntity.payment_code = generatePaymentNumber()
      transactionsEntity.expired_payment = expiredTime.toString()
      transactionsEntity.transaction_proof = payload.transaction_proof
      transactionsEntity.transaction_type = TransactionType.RENTER
      transactionsEntity.user = findOneUserId
      transactionsEntity.banks = payload.bank_id
      transactionsEntity.rentApplications = findOneRentApplicationsId

      const insertRentApplications = await this.transactionsRepository.insert(
        transactionsEntity,
      )

      return await this.transactionsRepository.findOneOrFail({
        where: {
          id: insertRentApplications.identifiers[0].id,
        },
        relations: {
          banks: true,
          rentApplications: { product: true },
        },
      })
    } catch (err) {
      throw err
    }
  }

  async createOwner(id: string, payload: CreateTransactionsDTO) {
    try {
      const findOneUserId = await this.userService.findOne(id)
      const findOneBankId = await this.bankService.findOneById(payload.bank_id)
      const findOneRentApplicationsId: any =
        await this.rentApplicationsService.findOneById(
          payload.rent_application_id,
        )

      const totalfee =
        findOneRentApplicationsId.total_price *
        (findOneRentApplicationsId.fee / 100)
      const totalPrice = findOneRentApplicationsId.total_price - totalfee

      const expiredTime = Date.now() + 60 * 60 * 1000 * 3

      const transactionsEntity = new Transactions()
      transactionsEntity.payment_code = generatePaymentNumber()
      transactionsEntity.expired_payment = expiredTime.toString()
      transactionsEntity.transaction_proof = payload.transaction_proof
      transactionsEntity.transaction_type = TransactionType.OWNER
      transactionsEntity.payment_status = PaymentStatus.APPROVE
      transactionsEntity.user = findOneUserId
      transactionsEntity.banks = findOneBankId
      transactionsEntity.totalPrice = totalPrice
      transactionsEntity.rentApplications = findOneRentApplicationsId

      const insertRentApplications = await this.transactionsRepository.insert(
        transactionsEntity,
      )

      return await this.transactionsRepository.findOneOrFail({
        where: {
          id: insertRentApplications.identifiers[0].id,
        },
        relations: {
          user: true,
          banks: true,
          rentApplications: { product: true },
        },
      })
    } catch (err) {
      throw err
    }
  }

  async update(id: string, payload: UpdateTransactionsDTO) {
    await this.findOneById(id)

    const expiredTime = Date.now() + 60 * 60 * 1000 * 3

    const transactionsEntity = new Transactions()
    transactionsEntity.expired_payment = expiredTime.toString()
    transactionsEntity.transaction_proof = payload.transaction_proof

    await this.transactionsRepository.update(id, transactionsEntity)

    return await this.transactionsRepository.findOneOrFail({
      where: { id },
    })
  }

  async softDeleteById(id: string) {
    try {
      await this.findOneById(id)
      await this.transactionsRepository.softDelete(id)
      return 'success'
    } catch (err) {
      throw err
    }
  }

  async appTransactions(id: string, payload: approveRejectDTO) {
    try {
      await this.findOneById(id)
      const transactionsEntity = new Transactions()
      transactionsEntity.payment_status = payload.status
      transactionsEntity.reason = payload.reason
      await this.transactionsRepository.update(id, transactionsEntity)

      const transData = await this.transactionsRepository.findOneOrFail({
        where: { id },
        relations: {
          rentApplications: { product: { user: true }, user: true },
        },
      })

      const senderId = transData.rentApplications.product.user.id
      const receiverId = transData.rentApplications.user.id

      if (payload.status === 'approve') {
        const data = {
          title: 'Approved',
          content: `Selamat aplikasi anda disetujui!`,
        }
        await this.notificationService.create(data, senderId, receiverId)
      }
      if (payload.status === 'reject') {
        const data = {
          title: 'Rejected',
          content: `Mohon maaf aplikasi anda telah ditolak!`,
        }
        await this.notificationService.create(data, senderId, receiverId)
      }

      return await this.transactionsRepository.findOneOrFail({
        where: { id },
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

  async findByStatus(status: string) {
    let statusPayment: any

    if (status === 'approve') {
      statusPayment = PaymentStatus.APPROVE
    } else if (status === 'reject') {
      statusPayment = PaymentStatus.REJECT
    } else if (status === 'pending') {
      statusPayment = PaymentStatus.PENDING
    }

    try {
      const result = await this.transactionsRepository.find({
        where: { payment_status: statusPayment },
      })
      return result
    } catch (err) {
      throw err
    }
  }

  async listTransactionsByProducts(id: string){
    try {
      let [data, count] = await this.transactionsRepository.findAndCount({
        where: { rentApplications: { product: {id:id} }, payment_status: PaymentStatus.APPROVE, transaction_type: TransactionType.RENTER},
        relations: {
          user: {biodata: true},
          rentApplications: {product: {specialRules: true, photoProducts: true}}
        },
      })
      return {
        count,
        data
      };
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

  async generatepdfTransaction() {
    const browser = await puppeteer.launch({
      args: ['--allow-file-access-from-files'],
    })

    const page = await browser.newPage()
    const [allTransactions] = await this.findAll()
    // const oneTransactions = await this.findOneById(transactionsLoggedInId)
    const htmlTemplate = `
    <html>
      <head></head>
      <body>
        <h1>Table Data User</h1>
          <table>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
          ${allTransactions
            .map(
              (transactions) =>
                `<tr>
                <td>${transactions.id}</td>
                <td>${transactions.transaction_type}</td>
                <td>${transactions.rentApplications}</td>
              </tr>`,
            )
            .join('')}
        </table>
      </body>
      </html>
    `

    await page.setContent(htmlTemplate)

    const pdfBuffer = await page.pdf({})

    browser.close()
    return pdfBuffer
  }
}
