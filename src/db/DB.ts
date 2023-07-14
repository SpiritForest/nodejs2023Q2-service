import { User } from '../users/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DB {
  private static instance: DB;
  users: User[];

  constructor() {
    if (!DB.instance) {
      DB.instance = this;
    } else {
      return DB.instance;
    }

    this.users = [];
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }
}
