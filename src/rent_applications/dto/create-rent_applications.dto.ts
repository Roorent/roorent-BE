import { IsEnum, IsInt, IsNotEmpty } from 'class-validator'
import { RentalType } from '../entities/rent_applications.entity'

export class CreateRentApplicationsDTO {
  @IsNotEmpty()
  lease_start: Date

  @IsNotEmpty()
  lease_expiration: Date

  @IsNotEmpty()
  @IsEnum(RentalType)
  rental_type: RentalType

  @IsNotEmpty()
  amount: number
}
