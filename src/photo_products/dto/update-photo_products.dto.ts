import { IsArray, IsNotEmpty } from "class-validator";

export class UpdatePhotoProductsDTO {
  @IsNotEmpty()
  @IsArray()
  photo: string[];
}