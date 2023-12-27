import { IsNotEmpty } from "class-validator";

export class CreateProductDescriptionsDTO{
    @IsNotEmpty()
    specifications: string;

    @IsNotEmpty()
    facilities: string;

    @IsNotEmpty()
    descriptions: string;
}