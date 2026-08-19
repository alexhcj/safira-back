import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Session, SessionDocument } from './schemes/session.schema';
import {
  IIssuedSession,
  IRotatedSession,
} from './interfaces/session.interface';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private configService: ConfigService,
  ) {}

  private hash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateRawToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  private getExpiresAt(): Date {
    const ttlSeconds = this.configService.get<number>(
      'jwt.refreshExpiresInSeconds',
    );
    return new Date(Date.now() + ttlSeconds * 1000);
  }

  public async createSession(
    userId: string,
    clientId: string,
    ipAddress: string,
    familyId: string = crypto.randomUUID(),
  ): Promise<IIssuedSession> {
    const rawToken = this.generateRawToken();

    await new this.sessionModel({
      userId,
      refreshTokenHash: this.hash(rawToken),
      familyId,
      expiresAt: this.getExpiresAt(),
      clientId,
      ipAddress,
      lastUsedAt: new Date(),
    }).save();

    return { rawToken, familyId };
  }

  /**
   * Verifies + rotates a refresh token. Throws on invalid/expired token.
   * If a *revoked* token is presented (i.e. one already used once before),
   * that's the reuse signal — every session in that family is killed,
   * forcing re-login on all devices tied to that login.
   */
  public async rotate(
    rawToken: string,
    clientId: string,
    ipAddress: string,
  ): Promise<IRotatedSession> {
    const session = await this.sessionModel.findOne({
      refreshTokenHash: this.hash(rawToken),
    });

    if (!session) throw new UnauthorizedException();

    if (session.revoked) {
      await this.sessionModel.updateMany(
        { familyId: session.familyId },
        { revoked: true },
      );
      throw new UnauthorizedException('Session reuse detected');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    session.revoked = true;
    await session.save();

    const next = await this.createSession(
      session.userId.toString(),
      clientId,
      ipAddress,
      session.familyId,
    );

    return {
      userId: session.userId.toString(),
      rawToken: next.rawToken,
      familyId: next.familyId,
    };
  }

  public async revokeByRawToken(rawToken: string): Promise<void> {
    await this.sessionModel.updateOne(
      { refreshTokenHash: this.hash(rawToken) },
      { revoked: true },
    );
  }

  public async revokeAllForUser(userId: string): Promise<void> {
    await this.sessionModel.updateMany(
      { userId: new Types.ObjectId(userId), revoked: false },
      { revoked: true },
    );
  }
}
