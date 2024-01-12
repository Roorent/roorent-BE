import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  photo_profile: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;
}
