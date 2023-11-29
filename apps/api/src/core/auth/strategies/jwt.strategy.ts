import { Configuration } from '@/core/config/configuration';
import { SupabaseService } from '@/core/supabase/supabase.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserResponse } from '@supabase/supabase-js';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

export type AuthUser = User & {
  authInfo: {
    auth: UserResponse['data']['user'];
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public configService: ConfigService<Configuration, true>,
    private readonly supabaseService: SupabaseService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('supabase.jwtSecret', { infer: true }),
    });
  }

  async authenticate(req: Request) {
    const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
    const idToken = extractor(req);

    if (!idToken) {
      this.fail('Unauthorized', 401);
      return;
    }

    try {
      const response = await this.supabaseService.client.auth.getUser(idToken);

      const user = await this.validate(response);

      if (!user) {
        this.fail('Unauthorized', 401);
        return;
      }

      this.success(user, { auth: response.data.user });
    } catch (err: unknown) {
      this.fail(err instanceof Error ? err.message : err, 401);
      return;
    }
  }

  async validate({ data }: UserResponse): Promise<User> {
    if (!data.user?.id) throw new Error('Invalid user data (missing id)');

    const { id, email } = data.user;
    return this.authService.validateUser(id, email!);
  }
}
