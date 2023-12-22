import { ProductDescriptions } from '#/product_descriptions/entities/product_descriptions.entity'
import { GenderProduct } from '#/special_rules/entities/special_rules.entity'
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateProductsDTO {
  @IsNotEmpty()
  city: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  type: string

  @IsNotEmpty()
  @IsInt()
  stock: number

  @IsOptional()
  @IsInt()
  daily_price: number

  @IsOptional()
  @IsInt()
  monthly_price: number

  @IsNotEmpty()
  address: string

  @IsNotEmpty()
  location: string

  @IsNotEmpty()
  photo: string

  @IsNotEmpty()
  specifications: string

  @IsNotEmpty()
  facilities: string

  @IsNotEmpty()
  note: string

  @IsNotEmpty()
  @IsEnum(GenderProduct)
  gender: GenderProduct

  @IsNotEmpty()
  notes: string
}
