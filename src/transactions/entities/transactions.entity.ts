import { Banks } from "#/banks/entities/banks.entity";
import { RentApplications } from "#/rent_applications/entities/rent_applications.entity";
import { Reviews } from "#/reviews/entities/reviews.entity";
import { Users } from "#/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export enum PaymentStatus {
  APPROVE = 'approve',
  REJECT = 'reject',
  PENDING = 'pending',
}

export enum TransactionType {
  OWNER = 'admin to owner',
  RENTER = 'renter to admin',
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
    type: 'enum',
    enum: TransactionType,
    nullable: true,
  })
  transaction_type: string

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

  @ManyToOne(() => Banks, (banks) => banks.transactions)
  banks: Banks

  @ManyToOne(() => Users, (user) => user.transactions)
  user: Users

  @ManyToOne(() => RentApplications, (rentApplications) => rentApplications.transactions)
  rentApplications: RentApplications

  @OneToOne(() => Reviews, reviews => reviews.transactions) // Definisikan relasi One-to-One
  review: Reviews; // Relasi ke entitas Review
}