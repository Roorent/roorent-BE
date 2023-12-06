import { IsInt, IsNotEmpty } from 'class-validator'

export class UpdateRentApplicationsDTO {
  @IsNotEmpty()
  lease_start: Date

  @IsNotEmpty()
  lease_expiration: Date

  @IsNotEmpty()
  rental_type: string

  @IsNotEmpty()
  @IsInt()
  price: number

  @IsNotEmpty()
  @IsInt()
  total_price: number
}
