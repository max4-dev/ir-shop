import {
  authQuery,
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResendVerificationDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
} from "../../api";

export const authService = {
  async initialize() {
    await authQuery.me();
    return true;
  },

  async login(data: LoginDTO) {
    await authQuery.login(data);
    return true;
  },

  async register(data: RegisterDTO) {
    return authQuery.register(data);
  },

  async verifyEmail(data: VerifyEmailDTO) {
    return authQuery.verifyEmail(data);
  },

  async resendVerification(data: ResendVerificationDTO) {
    return authQuery.resendVerification(data);
  },

  async forgotPassword(data: ForgotPasswordDTO) {
    return authQuery.forgotPassword(data);
  },

  async resetPassword(data: ResetPasswordDTO) {
    return authQuery.resetPassword(data);
  },

  async logout() {
    await authQuery.logout();
    return true;
  },
};
