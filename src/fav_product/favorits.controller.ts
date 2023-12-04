import { Controller, Get, HttpStatus, Query, Body, Post, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { FavoritsService } from './favorits.service';
import { CreateFavoritDTO } from './dto/create-favorits.dto';

@Controller('favorit')
export class FavoritsController {
    constructor(private favoritService: FavoritsService){}

    @Get()
    async findAll(@Query('page')page: number, @Query('limit') limit: number){
        const [data, count] = await this.favoritService.findAll(page,limit)
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            count,
            data
        }
    }

    @Post()
    async create(@Body() payload: CreateFavoritDTO){
        const datas = await this.favoritService.create(payload)
        return{
            statusCode: HttpStatus.CREATED,
            message: 'Succes',
            data: datas
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string){
        const datas = await this.favoritService.remove(id)
        return{
            statusCode: HttpStatus.OK,
            message: 'Succes',
            data: datas
        }
    }

   
}
