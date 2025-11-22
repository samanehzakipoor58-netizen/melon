import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from 'generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ایجاد کاربر جدید
  @Post()
  async create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  // دریافت همه کاربران
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // پیدا کردن کاربر با ایمیل
  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  // پیدا کردن کاربر با ID
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  // آپدیت کاربر با ID
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // حذف کاربر با ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
