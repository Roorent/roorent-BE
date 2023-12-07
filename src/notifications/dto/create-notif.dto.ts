import { IsNotEmpty } from 'class-validator'

export class CreateNotifDTO {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  content: string
}
