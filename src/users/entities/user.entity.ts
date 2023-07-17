import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { IsString } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  login: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @IsString()
  password: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn({ type: 'bigint', name: 'created_at' })
  @Transform(({ value }) => new Date(value).getTime())
  createdAt: number;

  @UpdateDateColumn({ type: 'bigint', name: 'updated_at' })
  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: number;
}
