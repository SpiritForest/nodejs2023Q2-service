import { DataSource } from 'typeorm';
import config from '../config';
import { FileLogger } from '../utils/FileLogger';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'postgres',
        port: config.POSTGRES_PORT,
        username: config.POSTGRES_USER,
        password: config.POSTGRES_PASSWORD,
        dropSchema: false,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
        logger: new FileLogger(true, '/logs'),
      });

      return dataSource.initialize();
    },
  },
];
