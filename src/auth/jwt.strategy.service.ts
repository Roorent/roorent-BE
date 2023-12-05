import { Users } from '#/users/entities/user.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {
    super({
      secretOrKey: 'TOPSECRET2023',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload: any) {
    try {
      const userOne = await this.usersRepository.findOne({
        relations: ['level', 'biodata'],
        where: { id: payload.id },
      })

      if (!userOne) {
        throw new HttpException(
          {
            StatusCode: HttpStatus.UNAUTHORIZED,
            message: 'token is invalid',
          },
          HttpStatus.UNAUTHORIZED,
        )
      }

      const data = {
        id: userOne.id,
        role: userOne.level.name,
        firstName: userOne.biodata.first_name,
      }

      return data
    } catch (err) {
      throw err
    }
  }
}
