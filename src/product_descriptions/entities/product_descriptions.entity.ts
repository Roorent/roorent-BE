import { Products } from "#/products/enitities/products.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ProductDescriptions{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "varchar",
    })
    specifications: string;

    @Column({
        type: "varchar",
    })
    facilities: string;
    
    @Column({
        type: "varchar",
    })
    descriptions: string;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        nullable: false,
      })
      createdAt: Date;
    
      @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: false,
      })
      updatedAt: Date;
    
      @DeleteDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
      })
      deletedAt: Date;
}