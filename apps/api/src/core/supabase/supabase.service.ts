import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Configuration } from '../config/configuration';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class SupabaseService {
  public client: SupabaseClient;
  public adminClient: SupabaseClient;

  constructor(
    private readonly configService: ConfigService<Configuration, true>,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(SupabaseService.name);

    this.client = createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.anonKey', { infer: true }),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    this.adminClient = createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.serviceKey', { infer: true }),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }
}
