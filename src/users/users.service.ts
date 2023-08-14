import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';
import { validate as validateEntity } from 'class-validator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    return validateEntity(user).then(async (errors) => {
      if (errors.length) {
        throw new BadRequestException();
      } else {
        const createdUser = await this.userRepository.save(user);

        return instanceToPlain(createdUser);
      }
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const updatePassword = new UpdatePasswordDto();
    updatePassword.oldPassword = updatePasswordDto.oldPassword;
    updatePassword.newPassword = updatePasswordDto.newPassword;

    await validateEntity(updatePassword).then((errors) => {
      if (errors.length) {
        throw new BadRequestException();
      }
    });

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException(
        "The old password didn't match",
        HttpStatus.FORBIDDEN,
      );
    }

    user.version += 1;
    user.password = updatePasswordDto.newPassword;
    user.updatedAt = new Date();

    const updatedUser = await this.userRepository.save(user);
    return instanceToPlain(updatedUser);
  }

  async remove(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return await this.userRepository.remove(user);
  }
}
