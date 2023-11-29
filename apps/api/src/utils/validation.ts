import { ZodSchema, ZodType, z } from 'zod';

type Config<T> = {
  value: T;
  schema: ZodType<T>;
};

export type ConfigStruct<T> = Record<keyof T, Config<unknown>>;

export const validateSchema = <T>(config: ConfigStruct<T>): T => {
  const schemaObj = get(config, 'schema') as Record<
    keyof T,
    ZodSchema<unknown>
  >;
  const schema = z.object(schemaObj);
  const values = get(config, 'value') as T;

  const result = schema.safeParse(values);

  if (!result.success) {
    console.info('\n');
    console.info('=========================================================');
    console.info('=========================================================');
    console.info('\n');
    console.info('Something is wrong in your .env file');
    console.info('Please take a look at the .env.example or consult the team.');
    console.info('\n');
    console.info('=========================================================');
    console.info('=========================================================');
    console.info('\n');

    throw new Error(
      `Invalid or missing configuration value detected.
      ${result.error.message}`,
    );
  }

  return values;
};

const get = <T>(
  config: ConfigStruct<T>,
  propName: keyof Config<unknown>,
): T | Record<keyof T, ZodSchema<unknown>> => {
  const arr: unknown[] = Object.keys(config).map((key) => {
    return {
      [key]: config[key as keyof T][propName],
    };
  });

  return Object.assign({}, ...arr);
};
