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
import { ReactiveUserDto } from './dto/reactive-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all-users')
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    const { count, userData } = await this.usersService.findAllUsers(
      page,
      limit,
    )

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      count,
      userData,
    }
  }

  @Get('/search')
  async listProductsWithSearch(
    @Query('s') searchCriteria: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.searchUsers(searchCriteria, page, limit)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
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
        ;[data, count] = await this.usersService.findUsersByLevel(
          role,
          page,
          limit,
        )
      }
    } else {
      ;[data, count] = await this.usersService.findAll()
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      count,
      data,
      page,
      limit,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/nonactive/:id')
  async getNonactive(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.usersService.getNonactive(id)
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/reactive/:id')
  async getReactive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: ReactiveUserDto,
  ) {
    const data = await this.usersService.getReactive(id, payload)
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile/:id')
  async userProfile(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.usersService.userProfile(id),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/byId/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.usersService.findOwnerOne(id),
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
  async approve(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.usersService.approveOwner(id)
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
    @Body('reason') reason: string,
  ) {
    const data = await this.usersService.rejectOwner(id, reason)
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/password/:id')
  async updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('password') password: string,
  ) {
    const data = await this.usersService.updatePassword(id, password)
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data,
    }
  }
}
