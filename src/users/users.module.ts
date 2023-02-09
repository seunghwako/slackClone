import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from 'src/entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])], // TypeOrm Repository Dependency Injection을 위해 필요
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
