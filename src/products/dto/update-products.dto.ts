import { GenderProduct } from "#/special_rules/entities/special_rules.entity";
import { IsEnum, IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class UpdateProductsDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    @IsInt()
    stock: number;

    @IsNotEmpty()
    @IsInt()
    daily_price: number;

    @IsNotEmpty()
    @IsInt()
    monthly_price: number;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    location: string;
  
    @IsNotEmpty()
    specifications: string
  
    @IsNotEmpty()
    facilities: string
  
    @IsNotEmpty()
    general: string
  
    @IsNumber()
    max_person: number
  
    @IsEnum(GenderProduct)
    gender: GenderProduct
  
    @IsNotEmpty()
    Note: string
}