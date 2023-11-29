import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const getRequestFromExecutionContext = (
  context: ExecutionContext,
): Request | undefined => {
  switch (context.getType<string>()) {
    case 'http':
      return context.switchToHttp().getRequest();
    case 'graphql':
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
  }
  return;
};
