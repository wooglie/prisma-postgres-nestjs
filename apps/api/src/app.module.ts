import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { load } from './core/config/configuration';
import { LoggerModule } from './core/logger/logger.module';
import { ClsModule } from 'nestjs-cls';
import { nanoid } from 'nanoid';
import { SupabaseModule } from './core/supabase/supabase.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: () => nanoid(),
      },
    }),
    LoggerModule,
    SupabaseModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
