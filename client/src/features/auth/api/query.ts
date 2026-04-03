import { client } from "@/src/shared/api";

import { LoginDTO, LoginResponse, RegisterDTO, RegisterResponse } from "../model";

import { authApi } from "./api";

const login = (data: LoginDTO) => {
  try {
    const response = client.post<LoginResponse>(authApi.login, { json: data }).json();

    return response;
  } catch (error) {
    console.log(error);
  }
};

const register = (data: RegisterDTO) => {
  try {
    const response = client.post<RegisterResponse>(authApi.register, { json: data }).json();

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const authQuery = {
  login,
  register,
};
