export enum Tokens {
  ACCESS = "accessToken",
  REFRESH = "refreshToken",
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
