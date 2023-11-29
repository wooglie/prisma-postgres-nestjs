import { DatabaseService } from '@/core/database/database.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(externalId: string, email: string): Promise<User> {
    const user = await this.databaseService.user.findFirst({
      where: { externalId },
    });

    if (user) {
      return this.databaseService.user.update({
        data: {
          email,
          externalId,
          lastSeenAt: new Date(),
        },
        where: {
          id: user.id,
        },
      });
    }

    return this.databaseService.user.create({
      data: {
        externalId,
        email,
      },
    });
  }
}
