import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HttpStatusCode } from 'axios';
import { CreateProductsDTO } from './dto/create-products.dto';
import { UpdateProductsDTO } from './dto/update-products.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ){}

    @Get()
    async getAll(){
        const [data, count] = await this.productsService.findAll();

        return {
            statusCode: HttpStatusCode.Ok,
            message: "success",
            count,
            data
        }
    }

    @Post()
    async create(@Body() createProductsDTO: CreateProductsDTO){
        const data = await this.productsService.create(createProductsDTO)

        return{
            statusCode: HttpStatus.CREATED,
            message: "success",
            data,
        }
    }

    @Get(':id')
    async getDetailById(@Param('id', ParseUUIDPipe) id: string){
        return{
            statusCode: HttpStatus.OK,
            message: "succes",
            data: await this.productsService.findOneById(id)
        }
    }

    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() UpdateProductsDTO: UpdateProductsDTO){
        const data = await this.productsService.update(id, UpdateProductsDTO)

        return{
            statusCode: HttpStatus.OK,
            message:"succes",
            data,
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string){
        return {
            statusCode: HttpStatus.OK,
            message: await this.productsService.softDeleteById(id)
        }
    }

}
