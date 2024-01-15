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
  Req,
  UseGuards,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { HttpStatusCode } from 'axios'
import { CreateProductsDTO } from './dto/create-products.dto'
import { UpdateProductsDTO } from './dto/update-products.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService, // private photoProductsService: PhotoProductsService
  ) {}

  @Get('all')
  async getAll(@Query('type') type?: string) {
    const [data, count] = await this.productsService.findAll(type)

    return {
      count,
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      data,
    }
  }

  @Get('all-hotel')
  async getAllHotel(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const [data, count] = await this.productsService.findAllHotel(page, limit)

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @Get('all-gedung')
  async getAllGedung(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const [data, count] = await this.productsService.findAllGedung(page, limit)

    return {
      statusCode: HttpStatusCode.Ok,
      message: 'success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() payload: CreateProductsDTO) {
    const userId = req.user.id
    const data = await this.productsService.create(userId, payload)

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data,
    }
  }

  @Get('/recommended-kos')
  async getRecommendedKos(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Body('city') city: string,
  ) {
    const recommendedProducts = await this.productsService.recommendProductKos(
      city,
      page,
      limit,
    )

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: recommendedProducts,
    }
  }

  @Get('/recommended-hotel')
  async getRecommendedHotel(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Body('city') city: string,
  ) {
    const recommendedProducts =
      await this.productsService.recommendProductHotel(city, page, limit)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: recommendedProducts,
    }
  }

  @Get('/recommended-gedung')
  async getRecommendedGedung(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Body('city') city: string,
  ) {
    const recommendedProducts =
      await this.productsService.recommendProductGedung(city, page, limit)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: recommendedProducts,
    }
  }

  // @Get('populer/:id')
  // async findByProduct(
  //   @Param('id', ParseUUIDPipe) id: string,
  // ) {
  //   const [data, count] = await this.productsService.popularProduct(
  //     id,
  //   )

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Success',
  //     count,
  //     data,
  //   }
  // }

  @Get('/search')
  async listProductsWithSearch(
    @Query('q') search?: string,
    @Query('type') type?: string,
    @Query('city') city?: string,
    @Query('payment') payment?: string,
    @Query('min') min?: string,
    @Query('max') max?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 9,
  ) {
    const [data, count] = await this.productsService.listProductsWithSearch(
      search,
      type,
      city,
      payment,
      min,
      max,
      page,
      limit,
    )

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }

  @Get(':id')
  async getDetailById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.productsService.findOneById(id),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateProductsDTO,
  ) {
    const data = await this.productsService.update(id, payload)

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: await this.productsService.softDeleteById(id),
    }
  }

  @Get('/find-owner/:id')
  async getProductsByOwner(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    const [data, count]: any = await this.productsService.listProductsByOwner(
      id,
      type,
      page,
      limit,
      status,
    )
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      count,
      data,
    }
  }

  @Put('noactivate-products/:id')
  async nonactivateOwnerProducts(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.productsService.nonactivateProductOwner(id)
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    }
  }
}
