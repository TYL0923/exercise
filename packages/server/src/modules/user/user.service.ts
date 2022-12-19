import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateToken } from 'src/shared/jwt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entity/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  checkAccount(account: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.userRepository
          .findOneByOrFail({
            account,
          })
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  login(loginDto: LoginDto): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        const { account, password } = loginDto;
        const res = await this.userRepository.findOne({
          where: {
            account,
            password,
          },
        });
        if (!res) {
          return resolve(null);
        }
        return resolve({
          account: res.account,
          name: res.name,
          token: generateToken({
            account: res.account,
          }),
        });
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  register(registerDto: RegisterDto): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.userRepository
          .insert(registerDto)
          .then((res) => {
            if (res.raw.affectedRows > 0) {
              return resolve(true);
            } else {
              return resolve(false);
            }
          })
          .catch(() => {
            return resolve(false);
          });
      } catch (err) {
        throw new Error(err);
      }
    });
  }
}
