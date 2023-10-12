interface IApi {
  apiUrl: string;
  globalPrefix: string;
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

export interface IConfig {
  node_env: string;
  port: number;
  api: IApi;
  jwt: IJwt;
  mongodb: IMongodb;
}
