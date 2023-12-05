import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { HttpStatusCode } from 'axios'
import { CreateProductsDTO } from './dto/create-products.dto'
import { UpdateProductsDTO } from './dto/update-products.dto'

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService, // private photoProductsService: PhotoProductsService
  ) {}

  @Get()
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.productsService.findAll(page, limit)

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @Post()
  async create(@Body() payload: CreateProductsDTO) {
    const data = await this.productsService.create(payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @Get(':id')
  async getDetailById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data: await this.productsService.findOneById(id),
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateProductsDTO,
  ) {
    const data = await this.productsService.update(id, payload)

    return {
      statusCode: HttpStatus.OK,
      message: 'succes',
      data,
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: await this.productsService.softDeleteById(id),
    }
  }

  @Get('/find-owner/:id')
  async getProductsByOwner(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.productsService.listProductsByOwner(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    }
  }

  @Put('deactivate-owner/:id')
  async deactivateOwnerProducts(@Param('id', ParseUUIDPipe) id: string) {
    return {
      message: await this.productsService.deactivateProductOwner(id),
    }
  }
}
