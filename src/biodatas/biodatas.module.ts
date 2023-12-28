import { Module } from '@nestjs/common';
import { BiodatasController } from './biodatas.controller';
import { BiodatasService } from './biodatas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Biodatas } from './entities/biodatas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Biodatas])],
  controllers: [BiodatasController],
  providers: [BiodatasService],
  exports: [BiodatasService],
})
export class BiodatasModule {}
