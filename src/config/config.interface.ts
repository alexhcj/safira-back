interface IApi {
  apiUrl: string;
  globalPrefix: string;
}

interface IClient {
  clientUrl: string;
}

interface IJwt {
  secret: string;
  expiresIn: string;
}

interface IMongodb {
  database: {
    connectionString: string;
    databaseName: string;
  };
}

interface IEmailerTimings {
  subscribedOnboard: number;
  subscribedAuthor: number;
  mostPopularProducts: number;
}

interface IEmailer {
  brevoApiKey: string;
  senderName: string;
  senderEmail: string;
  timings: IEmailerTimings;
}

interface IRedis {
  connection: {
    host: string;
    port: number;
  };
}

export interface IConfig {
  node_env: string;
  port: number;
  api: IApi;
  client: IClient;
  jwt: IJwt;
  mongodb: IMongodb;
  files: {
    uploads: {
      destination: string;
    };
  };
  emailer: IEmailer;
  redis: IRedis;
}
