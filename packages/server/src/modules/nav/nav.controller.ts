import { Controller, Get, Query } from '@nestjs/common';
import { NavService } from './nav.service';

@Controller('nav')
export class NavController {
  constructor(private readonly navService: NavService) {}
  @Get('list')
  async getNav() {
    return this.navService.queryNav();
  }
}
