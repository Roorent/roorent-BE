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
  VersionColumn,
} from 'typeorm'

@Entity()
export class Banks {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  bank_name: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  acc_name: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  acc_number: string

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

  @ManyToOne(() => Users, (user) => user.banks)
  user: Users

  @OneToMany(() => Transactions, (transaction) => transaction.banks)
  transactions: Transactions
}
