import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to isolate the User object attached to req that
 * we get back from our JWT
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
