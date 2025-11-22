import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ایجاد کاربر جدید
  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.databaseService.user.create({
        data: createUserDto,
      });
    } catch (err: any) {
      // ایمیل تکراری
      if (err.code === 'P2002') {
        throw new ConflictException('ایمیل قبلا ثبت شده است.');
      }
      console.error('Prisma Error:', err);
      throw err;
    }
  }

  // همه کاربران
  findAll(): Promise<User[]> {
    return this.databaseService.user.findMany({
      include: {
        verificationTokens: true, // relation tokens
      },
    });
  }

  // پیدا کردن کاربر با ایمیل
  async findOneByEmail(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { email },
      include: {
        verificationTokens: true,
      },
    });
  }

  // پیدا کردن کاربر با ID
  async findOneById(id: string): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      include: {
        verificationTokens: true,
      },
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد.');
    }

    return user;
  }

  // آپدیت کاربر
  async update(id: string, updateUserDto: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.databaseService.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (err: any) {
      console.error('Prisma Error:', err);
      throw err;
    }
  }

  // حذف کاربر
  async remove(id: string): Promise<User> {
    try {
      return await this.databaseService.user.delete({
        where: { id },
      });
    } catch (err: any) {
      console.error('Prisma Error:', err);
      throw err;
    }
  }
}
