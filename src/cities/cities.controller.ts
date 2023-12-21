import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService){}

    @Get('by-name/:name')
    async findOneByName(@Param('name') name: string){
        return {
            statusCode: HttpStatus.OK,
            message: 'success',
            data: await this.citiesService.findOneByName(name)
        }
    }

    @Get()
    async findAll(){
        const [data, count] = await this.citiesService.findAll()

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
