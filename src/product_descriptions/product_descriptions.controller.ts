import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ProductDescriptionsService } from './product_descriptions.service';
import { CreateProductDescriptionsDTO } from './dto/create-product_descriptions.dto';
import { UpdateProductDescriptionsDTO} from './dto/update-product_descriptions.dto';

@Controller('product-descriptions')
export class ProductDescriptionsController {
    constructor(private readonly productDescriptionsService: ProductDescriptionsService){}

    @Get()
    async getAll(@Query('page') page: number, @Query('limit') limit: number){
        const [data, count] = await this.productDescriptionsService.findAll(page, limit);

        return{
            data,
            count,
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }

    @Post()
    async create(@Body() payload: CreateProductDescriptionsDTO){
        return {
            data: await this.productDescriptionsService.create(payload),
            statusCode: HttpStatus.CREATED,
            message: 'success',
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string){
        return {
            data: await this.productDescriptionsService.findOne(id),
            stausCode: HttpStatus.OK,
            message: 'success',
        }
    }

    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateProductDescriptionsDTO){
        return {
            data: await this.productDescriptionsService.update(id, payload),
            statusCode: HttpStatus.OK,
            message: 'success',
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string){
        await this.productDescriptionsService.remove(id);

        return {
            statusCode: HttpStatus.OK,
            message: 'succes',
        }
    }
}
