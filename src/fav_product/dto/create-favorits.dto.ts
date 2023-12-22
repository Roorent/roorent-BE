import { IsNotEmpty } from "class-validator";

export class CreateFavoritDTO{
    @IsNotEmpty()
    userId: string;
    
    @IsNotEmpty()
    productId: string;
}