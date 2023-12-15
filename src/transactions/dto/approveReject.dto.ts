import { IsNotEmpty, IsOptional } from 'class-validator'
import { PaymentStatus } from '../entities/transactions.entity'

export class approveRejectDTO {
  @IsNotEmpty()
  status: PaymentStatus

  @IsOptional()
  reason: string
}
