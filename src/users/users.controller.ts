import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from '@nestjs/passport'
import { ApproveOwnerDTO } from './dto/approve-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    if (status && !role) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'role is required',
      }
    }

    let data, count

    if (role) {
      if (status) {
        ;[data, count] = await this.usersService.findOwnerByStatus(status, role)
      } else {
        ;[data, count] = await this.usersService.findUsersByLevel(role)
      }
    } else {
      ;[data, count] = await this.usersService.findAll()
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      count,
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/nonactive/:id')
  async getNonactive(@Param('id', ParseUUIDPipe) id: string, @Body('isActive') isActive: string){
    const data = await this.usersService.getNonactive(id, isActive)
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/reactive/:id')
  async getReactive(@Param('id', ParseUUIDPipe) id: string, @Body('isActive') isActive: string){
    const data = await this.usersService.getReactive(id, isActive)
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.usersService.findOne(id),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserDto,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.usersService.update(id, payload),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id)

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('approve/:id')
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: ApproveOwnerDTO)
    {
      return{
        statusCode: HttpStatus.OK,
        message: 'success',
        data: await this.usersService.approveOwner(id, payload)
      }
    }
}
