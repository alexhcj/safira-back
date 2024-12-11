import { IConfig } from './config.interface';

export default (): IConfig => ({
  node_env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 9090,
  api: {
    apiUrl: process.env.API_URL,
    globalPrefix: process.env.GLOBAL_PREFIX,
  },
  client: {
    clientUrl: process.env.CLIENT_URL,
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
  files: {
    uploads: {
      destination: process.env.UPLOADED_FILES_DESTINATION,
    },
  },
  emailer: {
    brevoApiKey: process.env.BREVO_API_KEY,
    senderName: process.env.BREVO_SENDER_NAME,
    senderEmail: process.env.BREVO_SENDER_EMAIL,
  },
  redis: {
    connection: {
      host: process.env.REDIS_HOST || 'redis',
      port: parseInt(process.env.REDIS_PORT) || 6379,
    },
  },
});
