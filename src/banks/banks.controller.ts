import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { BanksService } from './banks.service';
import { HttpStatusCode } from 'axios';
import { CreateBanksDTO } from './dto/create-banks.dto';
import { UpdateBanksDTO } from './dto/update-banks.dto';

@Controller('banks')
export class BanksController {
    constructor(
        private banksService: BanksService
    ){}

    @Get()
    async getAll(){
        const [data, count] = await this.banksService.findAll();

        return{
            statusCode: HttpStatusCode.Ok,
            message: "success",
            count,
            data
        }

    }

    @Post()
    async create(@Body() payload: CreateBanksDTO){
        const data = await this.banksService.create(payload)

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
            data: await this.banksService.findOneById(id)
        }
    }

    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateBanksDTO){
        const data = await this.banksService.update(id, payload)

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
            message: await this.banksService.softDeleteById(id)
        }
    }
}
