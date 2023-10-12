import { IConfig } from './config.interface';

export default (): IConfig => ({
  node_env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 5000,
  api: {
    apiUrl: process.env.API_URL,
    globalPrefix: process.env.GLOBAL_PREFIX,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  mongodb: {
    database: {
      connectionString: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/?retryWrites=true&w=majority`,
      databaseName: process.env.DB_NAME,
    },
  },
});
