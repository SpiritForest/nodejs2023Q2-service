import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { validateOrReject as validateOrRejectEntity } from 'class-validator';

import { LoginDto } from './dto/login-auth.dto';
import { SignUpDto } from './dto/signup-auth.dto';
import { RefreshTokenDto } from './dto/refresh-auth.dto';
import { User } from '../users/entities/user.entity';
import config from '../config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const salt = bcrypt.genSaltSync(config.CRYPT_SALT);
    const hash = bcrypt.hashSync(signUpDto.password, salt);
    const user = await this.userService.create({
      login: signUpDto.login,
      password: hash,
    });

    return user;
  }

  async login(loginDto: LoginDto) {
    await validateOrRejectEntity(loginDto).catch((errors) => {
      throw new BadRequestException(errors);
    });

    const user = await this.userRepository.findOne({
      where: { login: loginDto.login },
    });

    if (!user) {
      throw new ForbiddenException();
    }

    const match = await bcrypt.compare(loginDto.password, user.password);

    if (!match) {
      throw new ForbiddenException();
    }

    return this.getTokens(user);
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    await validateOrRejectEntity(refreshTokenDto).catch((errors) => {
      throw new UnauthorizedException(errors);
    });

    try {
      const token = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: config.JWT_SECRET_REFRESH_KEY,
      });

      return this.getTokens({
        id: token.sub,
        login: token.login,
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  private getTokens(user) {
    const payload = {
      sub: user.id,
      userId: user.id,
      login: user.login,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: config.JWT_SECRET_KEY,
      expiresIn: config.TOKEN_EXPIRE_TIME,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: config.JWT_SECRET_REFRESH_KEY,
      expiresIn: config.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
