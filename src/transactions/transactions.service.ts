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

  listAllRenter(page: number = 1, limit: number = 10) {
    return this.transactionsRepository.findAndCount({
      where: {
        transaction_type: TransactionType.RENTER,
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

  async listTransactionsByRenter(id: string) {
    try {
      const renter = await this.userService.findOne(id)
      return await this.transactionsRepository.findOneOrFail({
        where: { user: { id: renter.id } },
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
      return await this.transactionsRepository.findOneOrFail({
        where: {
          transaction_type: TransactionType.RENTER,
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
      return await this.transactionsRepository.findOneOrFail({
        where: { id },
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

  async createRenter(
    id: string,
    userId: string,
    payload: CreateTransactionsDTO,
  ) {
    try {
      const findOneUserId = await this.userService.findOne(userId)
      const [users, count] = await this.userService.findAll()
      const userAdmin = users.filter((user) => user.level.name === 'admin')

      const findOneRentApplicationsId: any =
        await this.rentApplicationsService.findOneById(id)
      const findOneBankId = await this.bankService.findOneByUser(
        userAdmin[0].id,
      )

      const expiredTime = Date.now() + 60 * 60 * 1000 * 3

      const transactionsEntity = new Transactions()
      transactionsEntity.expired_payment = expiredTime.toString()
      transactionsEntity.transaction_proof = payload.transaction_proof
      transactionsEntity.transaction_type = TransactionType.RENTER
      transactionsEntity.user = findOneUserId
      transactionsEntity.banks = findOneBankId
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
