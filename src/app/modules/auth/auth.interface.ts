export interface IAuth {
  email: string;
  password: string;
}

export interface IToken {
  accessToken: string;
  refreshToken?: string;
}
