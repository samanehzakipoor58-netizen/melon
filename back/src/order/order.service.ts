import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from 'generated/prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrderService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createOrderDto: Prisma.OrderCreateInput) {
    return this.databaseService.order.create({
      data: createOrderDto,
      include: { user: true },
    });
  }

async find(filter?: string, email?: string) {
  let dateFilter: Date | undefined = undefined;

  switch (filter) {
    case '3hours':
      dateFilter = new Date(Date.now() - 3 * 60 * 60 * 1000);
      break;
    case '3days':
      dateFilter = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      break;
    case 'week':
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
  }

  return this.databaseService.order.findMany({
    where: {
      ...(email ? { user: { email } } : {}),
      ...(dateFilter ? { createdAt: { gte: dateFilter } } : {}),
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
}






  findOne(id: string) {
    return this.databaseService.order.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  update(id: string, updateOrderDto: Prisma.OrderUpdateInput) {
    return this.databaseService.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  updateStatus(id: string, status: OrderStatus) {
    return this.databaseService.order.update({
      where: { id },
      data: { status },
    });
  }

  remove(id: string) {
    return this.databaseService.order.delete({
      where: { id },
    });
  }
}
