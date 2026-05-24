import { useQuery } from "@tanstack/react-query";

import { userQuery } from "../../api";
import { userQueryKeys } from "../constants/user.query-keys";

export const useUsers = () =>
  useQuery({
    queryKey: userQueryKeys.all,
    queryFn: () => userQuery.getAll(),
  });

export const useUser = (id: string | null) =>
  useQuery({
    queryKey: userQueryKeys.detail(id ?? ""),
    queryFn: () => userQuery.getById(id!),
    enabled: Boolean(id),
  });
