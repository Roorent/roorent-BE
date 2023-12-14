import { IsNotEmpty } from 'class-validator'
import { PaymentStatus } from '../entities/transactions.entity'

export class approveRejectDTO {
  @IsNotEmpty()
  status: PaymentStatus

  reason: string
}
