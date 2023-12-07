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
export class Notifications {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'text',
  })
  title: string

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'boolean', default: false })
  readable: boolean

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

  @ManyToOne(() => Users, (user) => user.sentNotif)
  @JoinColumn({ name: 'sender_id' })
  sender: Users

  @ManyToOne(() => Users, (user) => user.receivedNotif)
  @JoinColumn({ name: 'receiver_id' })
  receiver: Users
}
