import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class ProductService {
    constructor(private readonly databaseService: DatabaseService) {}
  create(createProductDto: Prisma.ProductCreateInput) {
    return this.databaseService.product.create({ data: createProductDto });
  }

  async addVariant(productId: number,createProductDto: Prisma.VariantCreateInput) {
  return this.databaseService.variant.create({
    data: {
      name: createProductDto.name,
      img: createProductDto.img,
      price: createProductDto.price,
      productId,
    },
  });
}


  findAll() {
    return this.databaseService.product.findMany({
      include: { variants: true },
    })
  }

  findOne(id: number) {
    return this.databaseService.product.findUnique({ where: { id }, include: { variants: true } });
  }

  update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
    return this.databaseService.product.update({ where: { id }, data: updateProductDto });
  }

  remove(id: number) {
    return this.databaseService.product.delete({ where: { id } });
  }
}
