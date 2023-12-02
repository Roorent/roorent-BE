import { IsNotEmpty } from "class-validator";

export class UpdatePhotoReviewsDTO {
  @IsNotEmpty()
  photo: string;
}