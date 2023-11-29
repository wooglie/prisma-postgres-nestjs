import appConfig, { Config as AppConfig } from './app.config';
import supabaseConfig, { SupabaseConfig } from './supabase.config';

export interface Configuration {
  app: AppConfig;
  supabase: SupabaseConfig;
}

export const load = [appConfig, supabaseConfig];
