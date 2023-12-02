import { IsNotEmpty } from "class-validator";

export class UpdatePhotoProductsDTO {
  @IsNotEmpty()
  photo: string;
}