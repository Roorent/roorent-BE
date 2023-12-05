import { StatusUsers } from "#/biodatas/entities/biodatas.entity";
import { IsNotEmpty } from "class-validator";

export class ApproveOwnerDTO{
    @IsNotEmpty()
    status: StatusUsers
}