import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { GenderProduct } from '../entities/special_rules.entity';

export class CreateSpecialRulesDTO {
  @IsNotEmpty()
  @IsNumber()
  max_person: number;

  @IsNotEmpty()
  @IsEnum(GenderProduct)
  gender: GenderProduct;

  @IsNotEmpty()
  Note: string;
}
