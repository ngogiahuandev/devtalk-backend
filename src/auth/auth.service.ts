import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { LoginInput, LoginResponse } from 'src/auth/dto/login.dto';
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

  private async generateTokens(userId: string) {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  async login(payload: LoginInput): Promise<LoginResponse> {
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
}
