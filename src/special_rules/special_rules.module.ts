import { Module } from '@nestjs/common';
import { SpecialRulesController } from './special_rules.controller';
import { SpecialRulesService } from './special_rules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialRules } from './entities/special_rules.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialRules])],
  controllers: [SpecialRulesController],
  providers: [SpecialRulesService],
  exports: [SpecialRulesService]
})
export class SpecialRulesModule {}
