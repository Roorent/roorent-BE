import { IsInt, IsNotEmpty } from "class-validator";

export class CreateProductsDTO {
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    city_id: string;

    @IsNotEmpty()
    product_desc_id: string;

    @IsNotEmpty()
    special_rules_id: string;

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
    latitude: string;

    @IsNotEmpty()
    longitude: string;
}