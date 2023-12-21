import { GenderUsers } from '#/biodatas/entities/biodatas.entity'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

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

  @IsOptional()
  photo_profile: string

  @IsNotEmpty()
  phone: string

  @IsOptional()
  photo_ktp: string

  @IsOptional()
  address: string
}
