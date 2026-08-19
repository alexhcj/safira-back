export interface IAuthLoginRO {
  id: string;
  accessToken: string;
}

export interface IAuthLoginWithSessionRO extends IAuthLoginRO {
  refreshToken: string;
}

export interface IRefreshRO {
  userId: string;
  accessToken: string;
  refreshToken: string;
}
