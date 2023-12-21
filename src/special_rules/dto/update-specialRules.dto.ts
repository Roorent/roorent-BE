import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { GenderProduct } from '../entities/special_rules.entity';

export class UpdateSpecialRulesDto {
  @IsNotEmpty()
  @IsEnum(GenderProduct)
  gender: GenderProduct;

  @IsNotEmpty()
  general: string;
}
