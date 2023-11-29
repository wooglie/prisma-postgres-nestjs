import { Resolver, Query } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/core/auth/guards/jwt-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User], { description: 'Get all users' })
  async users() {
    return this.userService.users();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { description: '(Admin) Get all users' })
  async adminUsers() {
    return this.userService.users();
  }
}
