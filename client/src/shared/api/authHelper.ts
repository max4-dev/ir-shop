import ky from "ky";

import { ITokens } from "@/src/shared/api";

import { CONFIG } from "../config";

export const getIsRefreshSent = async () => {
  try {
    const response = await ky
      .post<ITokens>(`${CONFIG.API_URL}/auth/login/access-token`, {
        credentials: "include",
      })
      .json();
    if (response.accessToken) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error while checking refresh token:", error);
    return true;
  }
};

export const handleRefreshToken = async (): Promise<ITokens> => {
  try {
    const { accessToken, refreshToken } = await ky
      .post<ITokens>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/access-token`, {
        credentials: "include",
      })
      .json();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      `Произошла ошибка при обновлении accessToken и refreshToken - ${error}, токены не обновлены`
    );
  }
};
