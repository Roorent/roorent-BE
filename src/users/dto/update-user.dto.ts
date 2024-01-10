import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  photo_profile: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;
}
