import config from '.';
import { FileLogger } from '../utils/FileLogger';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',             
  host: 'localhost',            
  port: config.POSTGRES_PORT,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,   
  synchronize: false,           
  logging: true,   
  logger: new FileLogger(true, '/logs'),             
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], 
  migrations: ['src/migrations/*.ts'],
});

export default dataSource;