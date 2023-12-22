import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

export enum GenderProduct {
  PRIA = 'pria',
  WANITA = 'wanita',
  CAMPUR = 'campur',
}
@Entity()
export class SpecialRules {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: GenderProduct,
  })
  gender: GenderProduct

  @Column({
    type: 'varchar',
    length: 255,
  })
  notes: string

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
}
