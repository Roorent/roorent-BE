import { IsInt, IsNotEmpty } from "class-validator";

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
    latitude: string;

    @IsNotEmpty()
    longitude: string;
}