import { Controller, Get, HttpStatus, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService){}

    @Get()
    async findAll(@Query('page') page: number, @Query('limit') limit: number){
        const [count, data] = await this.citiesService.findAll(page, limit)

        return{
            statusCode: HttpStatus.OK,
            message: 'Success',
            count,
            data,
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string){
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: await this.citiesService.findOne(id)
        }
    }
}
