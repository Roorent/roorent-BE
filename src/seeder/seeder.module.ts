import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Levels } from '#/levels/entities/level.entity';
import { Cities } from '#/cities/entities/cities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Levels, Cities])],
  // providers: [SeederService],
})
export class SeederModule {}
