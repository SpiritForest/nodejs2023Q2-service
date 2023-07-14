import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';
import { validate as validateEntity } from 'class-validator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { AppDataSource } from '../db';
import { User } from './entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

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
    console.log('user id is ', id)
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
    })

    const user = await this.findOne(id);
    console.log('11111111111', user)

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
    user.updatedAt = Date.now();

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
