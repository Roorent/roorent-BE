import { Banks } from '#/banks/entities/banks.entity'
import { Biodatas } from '#/biodatas/entities/biodatas.entity'
import { Chats } from '#/chats/entities/chats.entity'
import { Favorits } from '#/fav_product/entities/favorits.entity'
import { Levels } from '#/levels/entities/level.entity'
import { Notifications } from '#/notifications/entities/notification.entity'
import { Products } from '#/products/enitities/products.entity'
import { Reviews } from '#/reviews/entities/reviews.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm'

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ nullable: true })
  salt: string

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

  @ManyToOne(() => Levels, (level) => level.user)
  level: Levels

  @OneToMany(() => Reviews, (reviews) => reviews.user)
  reviews: Reviews

  @OneToMany(() => Banks, (banks) => banks.user)
  banks: Banks

  @OneToOne(() => Biodatas, (biodatas) => biodatas.user)
  @JoinColumn()
  biodata: Biodatas

  @OneToMany(() => Products, (products) => products.user)
  products: Products

  @OneToMany(() => Favorits, (favorit) => favorit.user)
  favorit: Favorits[]

  @OneToMany(() => Chats, (chat) => chat.sender)
  sentChats: Chats[]

  @OneToMany(() => Chats, (chat) => chat.receiver)
  receivedChats: Chats[]

  @OneToMany(() => Notifications, (notification) => notification.sender)
  sentNotif: Notifications[]

  @OneToMany(() => Notifications, (notification) => notification.receiver)
  receivedNotif: Notifications[]
}
