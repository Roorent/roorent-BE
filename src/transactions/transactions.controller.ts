import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { HttpStatusCode } from 'axios';
import { CreateTransactionsDTO } from './dto/create-transactions.dto';
import { UpdateTransactionsDTO } from './dto/update-transactions.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageTransactions } from './helper/upload-transactions';
import { of } from 'rxjs';
import { join } from 'path';
import { approveRejectDTO } from './dto/approveReject.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionService: TransactionsService,
  ){}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-transactions')
  @UseInterceptors(FileInterceptor('photo_transactions', storageTransactions))
  uploadPhotoProfile(@UploadedFile() photoTransactions: Express.Multer.File){
   if(typeof photoTransactions?.filename == "undefined"){
    return {
      statusCode: HttpStatus.BAD_REQUEST, 
      message: "error upload file"
    }
   }

   return {
      filename: photoTransactions?.filename
   }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('photo_transactions/:type/:filename')
  getProfileImage(@Param('type') type: string,@Param('filename') filename: string, @Res() res: any){
    return of(
      res.sendFile(join(process.cwd(), `upload/${type}/${filename}`))
    )
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

  @UseGuards(AuthGuard('jwt'))
  @Get('all-owner')
  async getAllOwner(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.transactionService.listAllOwner(page, limit)

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all-renter')
  async getAllRenter(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.transactionService.listAllRenter(page, limit)

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('renter')
  async createRenter(@Body() payload: CreateTransactionsDTO) {
    const data = await this.transactionService.createRenter(payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('owner')
  async createOwner(@Body() payload: CreateTransactionsDTO) {
    const data = await this.transactionService.createOwner(payload)

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
  @Put('approve/:id')
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: approveRejectDTO,
  ) {
    const data = await this.transactionService.approveTransactions(id, payload)
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('reject/:id')
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: approveRejectDTO
  ) {
    const data = await this.transactionService.rejectTransactions(id, payload)
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/list-renter/:id')
  async getProductsByRenter(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.transactionService.listTransactionsByRenter(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/list-owner/:id')
  async getProductsByOwner(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.transactionService.listTransactionsByOwner(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    }
  }
}