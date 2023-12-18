import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateReviewDTO {
  @IsNotEmpty()
  @IsNumber()
  rating: number

  @IsNotEmpty()
  @IsString()
  content: string

  @IsArray()
  photo: string[]
}
