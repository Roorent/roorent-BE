import { IsNotEmpty } from "class-validator";

export class CreateTransactionsDTO{
  @IsNotEmpty()
  bank_id: string;

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  rent_application_id: string;

  @IsNotEmpty()
  transaction_deadline: Date

  @IsNotEmpty()
  transaction_proof: string;

  reason: string;
}