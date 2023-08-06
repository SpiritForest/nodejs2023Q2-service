import { DataSource } from 'typeorm';
import config from '../config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: config.POSTGRES_PORT,
        username: config.POSTGRES_USER,
        password: config.POSTGRES_PASSWORD,
        dropSchema: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      });

      return dataSource.initialize();
    },
    // useFactory: async () => {
    //   const dataSource = new DataSource({
    //     type: 'postgres',
    //     host: 'postgres',
    //     port: config.POSTGRES_PORT,
    //     username: config.POSTGRES_USER,
    //     password: config.POSTGRES_PASSWORD,
    //     dropSchema: true,
    //     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    //     synchronize: true,
    //     logging: false,
    //   });

    //   return dataSource.initialize();
    // },
  },
];
