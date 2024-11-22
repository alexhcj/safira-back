import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemes/user.scheme';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginRO } from './interfaces/auth.interface';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { VerificationsService } from '../verifications/verifications.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => VerificationsService))
    private verificationService: VerificationsService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (user && AuthService.comparePassword(password, user.passwordHash)) {
      return user;
    }
    throw new HttpException('Wrong email or password', HttpStatus.NOT_FOUND);
  }

  async login(user: LoginUserDto): Promise<AuthLoginRO> {
    const validatedUser = await this.validateUser(user.email, user.password);

    if (!validatedUser) {
      throw new HttpException('User not validated', HttpStatus.FORBIDDEN);
    }

    const payload = { email: validatedUser.email, userId: validatedUser.id };

    const accessToken = this.jwtService.sign(payload);

    return { id: validatedUser.id, accessToken };
  }

  async register(user: RegisterUserDto): Promise<any> {
    if (!user.isPrivacyConfirmed)
      throw new HttpException(
        'User not confirmed terms and policies',
        HttpStatus.BAD_REQUEST,
      );

    const newUser = await this.usersService.create({
      email: user.email,
      password: user.password,
    });

    await this.verificationService.createVerification(
      newUser.id,
      newUser.email,
      user.isPrivacyConfirmed,
    );

    return this.login({
      email: newUser.email,
      password: user.password,
    });
  }

  private static comparePassword(password, passwordHash): boolean {
    return bcrypt.compareSync(password, passwordHash);
  }
}
