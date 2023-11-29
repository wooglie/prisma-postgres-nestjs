import { getRequestFromExecutionContext } from '@/utils/context';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    return getRequestFromExecutionContext(context);
  }
}
