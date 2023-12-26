import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { RegisterDTO } from './dto/register.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LevelsService } from '#/levels/levels.service'
import { LoginDTO } from './dto/login.dto'
import { Users } from '#/users/entities/user.entity'
import { Biodatas } from '#/biodatas/entities/biodatas.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Biodatas)
    private biodatasRepository: Repository<Biodatas>,
    private levelService: LevelsService,
    private jwtService: JwtService,
  ) {}

  async register(payload: RegisterDTO) {
    try {
      const existingEmail:any = await this.usersRepository.findOne({ 
        where: { email: payload.email} 
      });
      if (existingEmail) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Email sudah terdaftar',
          },
          HttpStatus.BAD_REQUEST,
        )
      }

      if (!['owner', 'renter'].includes(payload.level)) {
        throw new BadRequestException('Invalid, role not specified.')
      }

      const findLevelUser = await this.levelService.findOne(payload.level)

      const levelId: any = findLevelUser.id

      // kondisi untuk menentukan is_active pada user
      let isActive: any
      if (payload.level === 'renter') {
        isActive = 'active'
      } else if (payload.level === 'owner') {
        isActive = 'pending'
      }

      const saltGenerate = await bcrypt.genSalt()
      const hash = await bcrypt.hash(payload.password, saltGenerate)

      const biodatasEntity = new Biodatas()
      biodatasEntity.nik = payload.nik
      biodatasEntity.first_name = payload.first_name
      biodatasEntity.last_name = payload.last_name
      biodatasEntity.gender = payload.gender
      biodatasEntity.birth_date = new Date(payload.birth_date)
      biodatasEntity.photo_profile = payload.photo_profile
      biodatasEntity.phone = payload.phone
      biodatasEntity.isActive = isActive
      biodatasEntity.photo_ktp = payload.photo_ktp
      biodatasEntity.address = payload.address

      const insertBiodatas = await this.biodatasRepository.insert(
        biodatasEntity,
      )

      const usersEntity = new Users()
      usersEntity.email = payload.email
      usersEntity.salt = saltGenerate
      usersEntity.password = hash
      usersEntity.level = levelId
      usersEntity.biodata = insertBiodatas.identifiers[0].id

      const insertUsers = await this.usersRepository.insert(usersEntity)

      return (
        this.usersRepository.findOneOrFail({
          where: {
            id: insertUsers.identifiers[0].id,
          },
        }),
        this.biodatasRepository.findOneOrFail({
          where: {
            id: insertBiodatas.identifiers[0].id,
          },
        })
      )
    } catch (err) {
      throw err
    }
  }

  async login(payload: LoginDTO) {
    try {
      const userOne = await this.usersRepository.findOne({
        where: { email: payload.email },
        relations: ['level', 'biodata'],
      })
      if (!userOne) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Email salah',
          },
          HttpStatus.BAD_REQUEST,
        )
      }
      if (userOne.biodata.isActive == 'active') {
        const isMatch = await bcrypt.compare(payload.password, userOne.password)

        if (!isMatch) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              error: 'password salah',
            },
            HttpStatus.BAD_REQUEST,
          )
        }

        const datas = {
          id: userOne.id,
          role: userOne.level.name,
          firstname: userOne.biodata.first_name,
          photo: userOne.biodata.photo_profile,
        }

        return { access_token: await this.jwtService.sign(datas) }
      } else {
        return 'Akun anda tidak aktif, silahkan hubungi admin'
      }
    } catch (err) {
      throw err
    }
  }

  async registerAdm(payload: RegisterDTO) {
    try {
      if (!['admin'].includes(payload.level)) {
        throw new BadRequestException('Invalid, role not specified.')
      }

      const findLevelUser = await this.levelService.findOne(payload.level)

      const levelId: any = findLevelUser.id

      const isActive: any = 'active'

      const saltGenerate = await bcrypt.genSalt()
      const hash = await bcrypt.hash(payload.password, saltGenerate)

      const biodatasEntity = new Biodatas()
      biodatasEntity.nik = payload.nik
      biodatasEntity.first_name = payload.first_name
      biodatasEntity.last_name = payload.last_name
      biodatasEntity.gender = payload.gender
      biodatasEntity.birth_date = new Date(payload.birth_date)
      biodatasEntity.photo_profile = payload.photo_profile
      biodatasEntity.phone = payload.phone
      biodatasEntity.isActive = isActive
      biodatasEntity.address = payload.address

      const insertBiodatas = await this.biodatasRepository.insert(
        biodatasEntity,
      )

      const usersEntity = new Users()
      usersEntity.email = payload.email
      usersEntity.salt = saltGenerate
      usersEntity.password = hash
      usersEntity.level = levelId
      usersEntity.biodata = insertBiodatas.identifiers[0].id

      const insertUsers = await this.usersRepository.insert(usersEntity)

      return (
        this.usersRepository.findOneOrFail({
          where: {
            id: insertUsers.identifiers[0].id,
          },
        }),
        this.biodatasRepository.findOneOrFail({
          where: {
            id: insertBiodatas.identifiers[0].id,
          },
        })
      )
    } catch (err) {
      throw err
    }
  }
}
