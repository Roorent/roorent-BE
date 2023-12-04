import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProductDescriptions } from "./entities/product_descriptions.entity";
import { EntityNotFoundError, Repository } from "typeorm";
import { CreateProductDescriptionsDTO } from "./dto/create-product_descriptions.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateProductDescriptionsDTO } from "./dto/update-product_descriptions.dto";

@Injectable()
export class ProductDescriptionsService{
    constructor(
        @InjectRepository(ProductDescriptions)
        private productDescriptionsRepository: Repository<ProductDescriptions>
    ){}

    findAll(page: number = 1 , limit: number = 10){
        return this.productDescriptionsRepository.findAndCount({
        skip: --page * limit,
        take: limit,
        });
    }

    async create(payload: CreateProductDescriptionsDTO) {
        const result = await this.productDescriptionsRepository.insert(payload);

        return this.productDescriptionsRepository.findOneOrFail({
            where: {
                id: result.identifiers[0].id
            }
        })
    }

    async findOne(id: string){
        try {
            return await this.productDescriptionsRepository.findOneOrFail({
                where: {
                    id,
                }
            })
        } catch (e) {
            if (e instanceof EntityNotFoundError){
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        error: 'data not found',
                    },
                    HttpStatus.NOT_FOUND,
                )
            } else {
                throw e
            }
        }
    }

    async update(id: string, payload: UpdateProductDescriptionsDTO){
        try {
            await this.productDescriptionsRepository.findOneOrFail({
                where: {id},
            })
        } catch (e) {
            if (e instanceof EntityNotFoundError){
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        error: 'Data not found',
                    },
                    HttpStatus.NOT_FOUND,
                )
            } else {
                throw e;
            }
        }

        await this.productDescriptionsRepository.update(id, payload);

        return this.productDescriptionsRepository.findOneOrFail({
            where: {id,},
        });
    }

    async remove(id: string){
        try {
            await this.productDescriptionsRepository.findOneOrFail({
                where: {id,},
            });

        } catch (e) {
            if (e instanceof EntityNotFoundError){
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        error: 'Data not found',
                    },
                    HttpStatus.NOT_FOUND,
                )
            } else {
                throw e;
            }
        }

        await this.productDescriptionsRepository.softDelete(id);
    }
}