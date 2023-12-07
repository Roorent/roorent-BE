import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateReviewDTO {
  @IsNotEmpty()
  userId: string

  @IsNotEmpty()
  productId: string

  @IsNotEmpty()
  @IsNumber()
  rating: number

  @IsNotEmpty()
  @IsString()
  content: string
}
