import { IsNotEmpty } from "class-validator";

export class CreatePhotoReviewsDTO {
  @IsNotEmpty()
  review_id: string;

  @IsNotEmpty()
  photo: string;
}