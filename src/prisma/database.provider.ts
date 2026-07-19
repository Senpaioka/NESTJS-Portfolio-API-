import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import type { EnvironmentVariables } from '../config/env.interface';

export const PG_POOL = 'PG_POOL';

export const databaseProviders = [
  {
    provide: PG_POOL,
    inject: [ConfigService],
    useFactory: (config: ConfigService<EnvironmentVariables>) => {
      return new Pool({
        connectionString: config.getOrThrow('DATABASE_URL'),
      });
    },
  },
];
