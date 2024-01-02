import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateTransactionsDTO {
  rent_application_id: string

  @IsOptional()
  bank_id: any

  @IsNotEmpty()
  transaction_proof: string

  transaction_deadline: Number
  reason: string
}
