import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nav } from './entity/nav.entity';

@Injectable()
export class NavService {
  constructor(
    @InjectRepository(Nav)
    private readonly userRepository: Repository<Nav>,
  ) {}
  queryNav(): Promise<Nav[]> {
    return new Promise(async (resolve) => {
      const res = await this.userRepository.find();
      resolve(res);
    });
  }
}
