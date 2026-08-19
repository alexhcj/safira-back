import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemes/user.scheme';
import { JwtService } from '@nestjs/jwt';
import {
  IAuthLoginWithSessionRO,
  IRefreshRO,
} from './interfaces/auth.interface';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { VerificationsService } from '../verifications/verifications.service';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
    private verificationService: VerificationsService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    return this.usersService.validateCredentials(email, password);
  }

  async login(
    data: LoginUserDto,
    clientId: string,
    ipAddress: string,
  ): Promise<IAuthLoginWithSessionRO> {
    const validatedUser = await this.validateUser(data.email, data.password);

    const payload = { email: validatedUser.email, userId: validatedUser.id };
    const accessToken = this.jwtService.sign(payload);

    const { rawToken: refreshToken } = await this.sessionsService.createSession(
      validatedUser.id,
      clientId,
      ipAddress,
    );

    return {
      id: validatedUser.id,
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    rawToken: string,
    clientId: string,
    ipAddress: string,
  ): Promise<IRefreshRO> {
    const rotated = await this.sessionsService.rotate(
      rawToken,
      clientId,
      ipAddress,
    );
    const user = await this.usersService.findById(rotated.userId);
    const accessToken = this.jwtService.sign({
      email: user.email,
      userId: user.id,
    });

    return {
      userId: user.id,
      accessToken,
      refreshToken: rotated.rawToken,
    };
  }

  async register(
    user: RegisterUserDto,
    clientId: string,
    ipAddress: string,
  ): Promise<any> {
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

    return this.login(
      { email: newUser.email, password: user.password },
      clientId,
      ipAddress,
    );
  }

  private static comparePassword(password, passwordHash): boolean {
    return bcrypt.compareSync(password, passwordHash);
  }
}
