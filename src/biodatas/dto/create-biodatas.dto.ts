import { IsEnum, IsNotEmpty } from 'class-validator';
import { GenderUsers } from '../entities/biodatas.entity';

export class CreateBiodatasDTO {
  @IsNotEmpty()
  nik: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEnum(GenderUsers)
  gender: GenderUsers;

  @IsNotEmpty()
  birth_date: Date;

  @IsNotEmpty()
  photo_profile: string;

  @IsNotEmpty()
  telephone: string;

  @IsNotEmpty()
  photo_ktp: string;

  @IsNotEmpty()
  address: string;

}
