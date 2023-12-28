import { IsNotEmpty } from 'class-validator'

export class CreateTransactionsDTO {
  bank_id: string

  rent_application_id: string

  transaction_deadline: Number

  @IsNotEmpty()
  transaction_proof: string

  reason: string
}
