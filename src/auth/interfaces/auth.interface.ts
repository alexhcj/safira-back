export interface IAuthLoginRO {
  id: string;
  accessToken: string;
  isEmailVerified: boolean;
}

export interface IAuthLoginWithSessionRO extends IAuthLoginRO {
  refreshToken: string;
}

export interface IRefreshRO {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export interface IMeRO {
  id: string;
}
