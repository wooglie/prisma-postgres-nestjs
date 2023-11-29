import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  externalId!: string;

  @Field(() => String)
  email!: string;
}
