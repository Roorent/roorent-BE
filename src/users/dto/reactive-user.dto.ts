import { StatusUsers } from '#/biodatas/entities/biodatas.entity';
import { IsNotEmpty } from 'class-validator';

export class ReactiveUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  photo_ktp: string;

  @IsNotEmpty()
  isActive: StatusUsers;
}
