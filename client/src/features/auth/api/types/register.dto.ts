export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}
