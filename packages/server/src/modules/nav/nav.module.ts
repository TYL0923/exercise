import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nav } from './entity/nav.entity';
import { NavController } from './nav.controller';
import { NavService } from './nav.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nav])],
  controllers: [NavController],
  providers: [NavService],
})
export class NavModule {}
