import { GenderUsers } from '#/biodatas/entities/biodatas.entity'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class RegisterDTO {
  // @IsNotEmpty()
  level: string

  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  nik: string

  @IsNotEmpty()
  first_name: string

  @IsNotEmpty()
  last_name: string

  @IsNotEmpty()
  @IsEnum(GenderUsers)
  gender: GenderUsers

  @IsNotEmpty()
  birth_date: Date

  photo_profile: string

  @IsNotEmpty()
  phone: string

  photo_ktp: string

  
  address: string
}
