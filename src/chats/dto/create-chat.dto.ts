import { IsNotEmpty } from 'class-validator'

export class CreateChatDTO {
  @IsNotEmpty()
  message: string
}
