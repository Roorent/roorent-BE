import { Users } from '#/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

@Entity()
export class Chats {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'text',
  })
  message: string

  @Column({
    type: 'boolean',
    default: false,
  })
  readable: boolean

  @Column({ type: 'bigint', nullable: true })
  timestamp: string

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

  @ManyToOne(() => Users, (user) => user.sentChats)
  @JoinColumn({ name: 'sender_id' })
  sender: Users

  @ManyToOne(() => Users, (user) => user.receivedChats)
  @JoinColumn({ name: 'receiver_id' })
  receiver: Users
}
