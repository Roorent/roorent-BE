import { Products } from "#/products/enitities/products.entity";
import { Transactions } from "#/transactions/entities/transactions.entity";
import { Users } from "#/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    type: 'varchar',
    length: 60,
  })
  rental_type: string

  @Column({
    type: 'int',
    nullable: true,
  })
  price: number

  @Column({
    type: 'int',
    nullable: true,
  })
  total_price: number

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

  @OneToMany(() => Transactions, (transactions) => transactions.rentApplications)
  transactions: Transactions
}