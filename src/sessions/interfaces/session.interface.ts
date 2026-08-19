export interface IIssuedSession {
  rawToken: string;
  familyId: string;
}

export interface IRotatedSession {
  userId: string;
  rawToken: string;
  familyId: string;
}
