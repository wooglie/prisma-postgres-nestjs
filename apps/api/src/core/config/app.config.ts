import { EnvironmentName } from '@/common/enums';
import { ConfigStruct, validateSchema } from '@/utils/validation';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export type Config = {
  port: number;
  logLevel: string;
  environment: EnvironmentName;
  isLocalEnvironment: boolean;
  isTestEnvironment: boolean;
  isProductionEnvironment: boolean;
};

export default registerAs<Config>('app', () => {
  const config: ConfigStruct<Config> = {
    port: {
      value: parseInt(process.env.PORT || '4001', 10),
      schema: z.number(),
    },
    logLevel: {
      value: process.env.LOG_LEVEL || 'info',
      schema: z.string(),
    },
    environment: {
      value: process.env.ENVIRONMENT,
      schema: z.enum([
        EnvironmentName.LOCAL,
        EnvironmentName.TEST,
        EnvironmentName.PRODUCTION,
      ]),
    },
    isLocalEnvironment: {
      value: process.env.ENVIRONMENT === EnvironmentName.LOCAL,
      schema: z.boolean(),
    },
    isTestEnvironment: {
      value: process.env.ENVIRONMENT === EnvironmentName.TEST,
      schema: z.boolean(),
    },
    isProductionEnvironment: {
      value: process.env.ENVIRONMENT === EnvironmentName.PRODUCTION,
      schema: z.boolean(),
    },
  };

  return validateSchema(config);
});
