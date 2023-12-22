import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDTO } from './dto/register.dto'
import { LoginDTO } from './dto/login.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Query('role') level: string, @Body() payload: RegisterDTO) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data: await this.authService.register({ ...payload, level }),
    }
  }

  @Post('/login')
  async login(@Body() payload: LoginDTO) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.authService.login(payload),
    }
  }
  
  @Post('adm/register')
  async registerAdm(@Query('role') level: string, @Body() payload: RegisterDTO){
    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data: await this.authService.registerAdm({ ...payload, level }),
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async profile(@Req() req) {
    return req.user
  }
}
