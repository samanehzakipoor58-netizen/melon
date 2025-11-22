import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from 'generated/prisma';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: Prisma.ProductCreateInput) {
    return this.productService.create(createProductDto);
  }

  @Post(':id/variant')
addVariant(
  @Param('id', ParseIntPipe) productId: number,
  @Body() createProductDto: Prisma.VariantCreateInput,
) {
  return this.productService.addVariant(productId, createProductDto);
}


  @Get()
  findAll() {
    return this.productService.findAll();
  }

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.productService.findOne(id);
}

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: Prisma.ProductUpdateInput) {
    return this.productService.update(id, updateProductDto);
  }

  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
