import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemes/user.scheme';
import { UserDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginRO } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (user && AuthService.comparePassword(password, user.passwordHash)) {
      return user;
    }
    throw new HttpException('Wrong email or password', HttpStatus.NOT_FOUND);
  }

  async login(user: UserDto): Promise<AuthLoginRO> {
    const validatedUser = await this.validateUser(user.email, user.password);

    if (!validatedUser) {
      throw new HttpException('User not validated', HttpStatus.FORBIDDEN);
    }

    const payload = { email: validatedUser.email, userId: validatedUser.id };

    const accessToken = this.jwtService.sign(payload);

    return { userId: validatedUser.id, accessToken };
  }

  async register(user: UserDto): Promise<any> {
    const newUser = await this.usersService.create({
      email: user.email,
      password: user.password,
    });

    return this.login({
      email: newUser.email,
      password: user.password,
    });
  }

  private static comparePassword(password, passwordHash): boolean {
    return bcrypt.compareSync(password, passwordHash);
  }
}
