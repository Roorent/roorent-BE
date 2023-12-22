import { IsArray, IsNotEmpty } from "class-validator";

export class CreatePhotoProductsDTO {
  @IsNotEmpty()
  product_id: string;

  @IsNotEmpty()
  photo: string
}