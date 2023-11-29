import { Configuration } from '@/core/config/configuration';
import { LoggerService } from '@/core/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User as UserModel } from '@prisma/client';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private configService: ConfigService<Configuration, true>,
    private logger: LoggerService,
  ) {}

  async users(): Promise<UserModel[]> {
    const isLocalEnvironment = this.configService.get(
      'app.isLocalEnvironment',
      {
        infer: true,
      },
    );
    this.logger.log({ isLocalEnvironment }, 'isLocalEnvironment');
    return this.databaseService.user.findMany();
  }
}
