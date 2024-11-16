import * as Joi from 'joi';
import { IConfig } from './config.interface';

export const validationSchema = Joi.object<IConfig>({
  node_env: Joi.string().valid('development', 'production'),
  port: Joi.number().default(9090),
  api: {
    apiUrl: Joi.string().required(),
    globalPrefix: Joi.string().required(),
  },
  jwt: {
    secret: Joi.string().required(),
    expiresIn: Joi.string().required(),
  },
  mongodb: {
    database: {
      connectionString: Joi.string().required(),
      databaseName: Joi.string().required(),
    },
  },
  files: {
    uploads: {
      destination: Joi.string().required(),
    },
  },
  emailer: {
    host: Joi.string().required(),
    port: Joi.number().default(787).required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
  },
});
