import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { LoginInput, AuthResponse } from 'src/auth/dto/login.dto';
import { RegisterInput } from 'src/auth/dto/register.dto';
import { User } from '@prisma/client';
import { UserDto } from 'src/auth/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new GraphQLError('Invalid credentials');
  }

  private async verifyUser(userId: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.isBanned) {
      throw new GraphQLError('User not found or banned');
    }
    return this.mapUserToDto(user);
  }

  async verifyToken(token: string): Promise<UserDto> {
    const payload = this.decodeAndCheckExpiration(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );
    return this.verifyUser(payload.sub);
  }

  async verifyRefreshToken(token: string): Promise<UserDto> {
    const payload = this.decodeAndCheckExpiration(
      token,
      process.env.REFRESH_TOKEN_SECRET,
    );
    return this.verifyUser(payload.sub);
  }

  private decodeAndCheckExpiration(token: string, secret: string): any {
    try {
      const payload = this.jwtService.verify(token, { secret });

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        throw new GraphQLError('Token has expired');
      }

      return payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new GraphQLError('Invalid or expired token');
    }
  }

  async revokeTokensForUser(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  private mapUserToDto(user: User): UserDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userDto } = user;
    return userDto as UserDto;
  }

  private async generateTokens(
    userId: string,
    refreshTokenExpiresAt?: Date,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: refreshTokenExpiresAt
        ? Math.floor((refreshTokenExpiresAt.getTime() - Date.now()) / 1000)
        : process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  async login(payload: LoginInput): Promise<AuthResponse> {
    const { email, password } = payload;
    const user = await this.validateUser(email, password);

    await this.revokeTokensForUser(user.id);

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user: { connect: { id: user.id } },
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        isRevoked: false,
      },
    });

    return { accessToken, refreshToken, user };
  }

  async register(payload: RegisterInput): Promise<UserDto> {
    const { email, password, username, confirmPassword } = payload;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new GraphQLError('User already exists');
    }
    if (password !== confirmPassword) {
      throw new GraphQLError('Passwords do not match');
    }
    const hashedPassword = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });
    return this.mapUserToDto(user);
  }

  async refreshTokens(
    refreshToken: string,
    user: UserDto,
  ): Promise<AuthResponse> {
    const refreshTokenUser = await this.verifyRefreshToken(refreshToken);
    if (refreshTokenUser.id !== user.id) {
      throw new GraphQLError('Invalid refresh token where user does not match');
    }

    const oldRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!oldRefreshToken || oldRefreshToken.isRevoked) {
      throw new GraphQLError('Refresh token is invalid or revoked');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user.id, oldRefreshToken.expiresAt);

    await this.revokeTokensForUser(user.id);

    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        user: { connect: { id: user.id } },
        expiresAt: oldRefreshToken.expiresAt,
        isRevoked: false,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: refreshTokenUser,
    };
  }
}
