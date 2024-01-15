import { Products } from '#/products/enitities/products.entity'
import { Transactions } from '#/transactions/entities/transactions.entity'
import { Users } from '#/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum RentalType {
  DAILY = 'harian',
  MONTHLY = 'bulanan',
}
@Entity()
export class RentApplications {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'date',
    nullable: true,
  })
  lease_start: Date

  @Column({
    type: 'date',
    nullable: true,
  })
  lease_expiration: Date

  @Column({
    type: 'enum',
    enum: RentalType,
  })
  rental_type: RentalType

  @Column({
    type: 'int',
    nullable: true,
  })
  amount: number

  @Column({
    type: 'int',
    nullable: true,
  })
  price: number

  @Column({
    type: 'int',
    nullable: true,
  })
  total_price: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  fee: Number

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

  @ManyToOne(() => Products, (product) => product.rentApplications)
  product: Products

  @ManyToOne(() => Users, (user) => user.rentApplications)
  user: Users

  @OneToMany(
    () => Transactions,
    (transactions) => transactions.rentApplications,
  )
  transactions: Transactions
}
