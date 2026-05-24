import { useQuery } from "@tanstack/react-query";

import { userQuery } from "../../api";

export const PROFILE_QUERY_KEY = ["user", "profile"] as const;

export const useProfile = (enabled = true) =>
  useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => userQuery.getProfile(),
    enabled,
  });
