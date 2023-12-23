import { Users } from '#/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

export enum GenderUsers {
  PRIA = 'pria',
  WANITA = 'wanita',
}
export enum StatusUsers {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  REJECT = 'reject'
}

@Entity()
export class Biodatas {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  nik: string

  @Column({
    type: 'varchar',
    length: 25,
  })
  first_name: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  last_name: string

  @Column({
    type: 'enum',
    enum: GenderUsers,
  })
  gender: GenderUsers

  @Column({
    type: 'date',
    nullable: true,
  })
  birth_date: Date

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  photo_profile: string

  @Column({
    type: 'char',
    length: 16,
  })
  phone: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  photo_ktp: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  address: string

  @Column({
    type: 'enum',
    enum: StatusUsers,
    default: StatusUsers.PENDING,
  })
  isActive: StatusUsers

  @Column({
    type: 'text',
    nullable: true
  })
  reason: string

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date

  @VersionColumn()
  version: number

  @OneToOne(() => Users, (user) => user.biodata)
  user: Users
}
