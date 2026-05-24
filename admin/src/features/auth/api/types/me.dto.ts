import { UserRole } from "./role.types";

export interface MeResponse {
  user: {
    id: string;
    role: UserRole;
    tokenVersion: number;
  };
}
