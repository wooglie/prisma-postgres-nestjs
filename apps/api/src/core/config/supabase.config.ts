import { ConfigStruct, validateSchema } from '@/utils/validation';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export type SupabaseConfig = {
  url: string;
  jwtSecret: string;
  anonKey: string;
  serviceKey: string;
};

export default registerAs<SupabaseConfig>('supabase', () => {
  const config: ConfigStruct<SupabaseConfig> = {
    url: {
      value: process.env.SUPABASE_URL,
      schema: z.string(),
    },
    jwtSecret: {
      value: process.env.SUPABASE_JWT_SECRET,
      schema: z.string(),
    },
    anonKey: {
      value: process.env.SUPABASE_ANON_KEY,
      schema: z.string(),
    },
    serviceKey: {
      value: process.env.SUPABASE_SERVICE_KEY,
      schema: z.string(),
    },
  };

  return validateSchema(config);
});
