import { Banks } from "#/banks/entities/banks.entity";
import { RentApplications } from "#/rent_applications/entities/rent_applications.entity";
import { Users } from "#/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export enum PaymentStatus {
  APPROVE = 'approve',
  REJECT = 'reject',
  PENDING = 'pending',
}

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'date',
    nullable: true,
  })
  transaction_deadline: Date

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  transaction_proof: string

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  transaction_type: string

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

  @ManyToOne(() => Banks, (banks) => banks.transactions)
  banks: Banks

  @ManyToOne(() => Users, (user) => user.transactions)
  user: Users

  @ManyToOne(() => RentApplications, (rentApplications) => rentApplications.transactions)
  rentApplications: RentApplications
}