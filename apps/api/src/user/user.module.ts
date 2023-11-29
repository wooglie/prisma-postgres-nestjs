import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserResolver],
})
export class UserModule {}
