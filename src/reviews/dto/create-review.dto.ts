import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateReviewDTO {
  @IsNotEmpty()
  transactionsId: string

  @IsNotEmpty()
  @IsNumber()
  rating: number

  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsArray()
  photo: string[]
}
