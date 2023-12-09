import { IsNotEmpty } from "class-validator";
import { PaymentStatus } from "../entities/transactions.entity";

export class approveRejectDTO{
    @IsNotEmpty()
    payment_status: PaymentStatus

    reason: string
}