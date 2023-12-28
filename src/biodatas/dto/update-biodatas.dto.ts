import { PartialType } from "@nestjs/mapped-types";
import { CreateBiodatasDTO } from "./create-biodatas.dto";

export class UpdateBiodatasDTO extends PartialType(CreateBiodatasDTO){}