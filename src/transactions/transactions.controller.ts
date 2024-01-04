import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { AuthGuard } from '@nestjs/passport'
import { HttpStatusCode } from 'axios'
import { CreateTransactionsDTO } from './dto/create-transactions.dto'
import { UpdateTransactionsDTO } from './dto/update-transactions.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { storageTransactions } from './helper/upload-transactions'
import { of } from 'rxjs'
import { join } from 'path'
import { approveRejectDTO } from './dto/approveReject.dto'

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-transactions')
  @UseInterceptors(FileInterceptor('photo_transactions', storageTransactions))
  uploadPhotoProfile(@UploadedFile() photoTransactions: Express.Multer.File) {
    if (typeof photoTransactions?.filename == 'undefined') {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'error upload file',
      }
    }

    return {
      filename: photoTransactions?.filename,
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('photo_transactions/:type/:filename')
  getProfileImage(
    @Param('type') type: string,
    @Param('filename') filename: string,
    @Res() res: any,
  ) {
    return of(res.sendFile(join(process.cwd(), `upload/${type}/${filename}`)))
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.transactionService.findAll(page, limit)

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @Get('/status')
  async findByStatus(@Query('status') status: string) {
    const data = await this.transactionService.findByStatus(status)
    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      data,
    }
  }

  @Get('export')
  @UseGuards(AuthGuard('jwt'))
  async generatePdfUser(
    @Res() res: any,
    // @Req() req,
    @Headers() headers: any,
  ) {
    const pdfBuffer = await this.transactionService.generatepdfTransaction()
    const fileName = Date.now()

    //set header to response
    headers['content-type'] = 'application/pdf'
    headers['content-disposition'] = `inline; filename=${fileName}.pdf`

    res.end(pdfBuffer, 'binary')
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all-owner')
  async getAllOwner(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const [data, count] = await this.transactionService.listAllOwner(
      page,
      limit,
    )

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all-renter')
  async getAllRenter(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const { count, transactionsData } = await this.transactionService.listAllRenter(
      page,
      limit,
    );

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      transactionsData
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('renter-to-admin/:id')
  async createRenter(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CreateTransactionsDTO,
    @Req() req,
  ) {
    const userId = req.user.id
    const data = await this.transactionService.createRenter(id, userId, payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('admin-to-owner/:id')
  async createOwner(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CreateTransactionsDTO,
  ) {
    const data = await this.transactionService.createOwner(id, payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/renter/:id')
  async getDetailRenterById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data: await this.transactionService.getDetailRenterById(id),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/owner/:id')
  async getDetailOwnerById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data: await this.transactionService.getDetailOwnerById(id),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getDetailById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data: await this.transactionService.findOneById(id),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateTransactionsDTO,
  ) {
    const data = await this.transactionService.update(id, payload)

    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: await this.transactionService.softDeleteById(id),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('applications/:id')
  async appTransactions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: approveRejectDTO,
  ) {
    const data = await this.transactionService.appTransactions(id, payload)
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/list-renter/:id')
  async getTransactionsByRenter(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    ) {
    const{ count, transactionsData }: any = await this.transactionService.listTransactionsByRenter(id,page,limit)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      transactionsData,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/list-renter-owner/:id')
  async getTransactionsRenterByOwner(@Param('id', ParseUUIDPipe) id: string) {
    const [data, count]: any =
      await this.transactionService.listTransactionsRenterByOwner(id)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/list-owner/:id')
  async getTransactionsByOwner(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.transactionService.listTransactionsByOwner(id)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }
}
