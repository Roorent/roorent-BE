import { IsNotEmpty } from "class-validator";

export class UpdateTransactionsDTO{
  @IsNotEmpty()
  transaction_deadline: Date

  @IsNotEmpty()
  transaction_proof: string;

  @IsNotEmpty()
  transaction_type: string;
}