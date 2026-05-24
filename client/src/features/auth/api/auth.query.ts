import { client } from "@/src/shared/api";

import { authApi } from "./auth.api";
import { ForgotPasswordDTO } from "./types/forgot-password.dto";
import { LoginDTO, LoginResponse } from "./types/login.dto";
import { MessageResponse } from "./types/message.dto";
import { RegisterDTO, RegisterResponse } from "./types/register.dto";
import { ResendVerificationDTO } from "./types/resend-verification.dto";
import { ResetPasswordDTO } from "./types/reset-password.dto";
import { VerifyEmailDTO } from "./types/verify-email.dto";

export const authQuery = {
  login: (data: LoginDTO) => client.post<LoginResponse>(authApi.login, { json: data }).json(),
  register: (data: RegisterDTO) =>
    client.post<RegisterResponse>(authApi.register, { json: data }).json(),
  verifyEmail: (data: VerifyEmailDTO) =>
    client.post<MessageResponse>(authApi.verifyEmail, { json: data }).json(),
  resendVerification: (data: ResendVerificationDTO) =>
    client.post<MessageResponse>(authApi.resendVerification, { json: data }).json(),
  forgotPassword: (data: ForgotPasswordDTO) =>
    client.post<MessageResponse>(authApi.forgotPassword, { json: data }).json(),
  resetPassword: (data: ResetPasswordDTO) =>
    client.post<MessageResponse>(authApi.resetPassword, { json: data }).json(),
  logout: () => client.post(authApi.logout),
  me: () => client.get(authApi.me).json(),
};
