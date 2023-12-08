import { ProductDescriptions } from '#/product_descriptions/entities/product_descriptions.entity'
import { GenderProduct } from '#/special_rules/entities/special_rules.entity'
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateProductsDTO {
  @IsNotEmpty()
  user_id: string

  @IsNotEmpty()
  city_id: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  type: string

  @IsNotEmpty()
  @IsInt()
  stock: number

  @IsNotEmpty()
  @IsInt()
  daily_price: number

  @IsNotEmpty()
  @IsInt()
  monthly_price: number

  @IsNotEmpty()
  address: string

  @IsNotEmpty()
  location: string

  @IsNotEmpty()
  @IsArray()
  photo: string[]

  @IsNotEmpty()
  specifications: string

  @IsNotEmpty()
  facilities: string

  @IsNotEmpty()
  note: string

  @IsNotEmpty()
  @IsNumber()
  max_person: number

  @IsNotEmpty()
  @IsEnum(GenderProduct)
  gender: GenderProduct

  @IsNotEmpty()
  Note: string

}
