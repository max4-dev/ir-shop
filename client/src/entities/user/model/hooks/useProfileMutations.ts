import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userQuery, type UpdatePasswordBody, type UpdateProfileBody } from "../../api";
import { PROFILE_QUERY_KEY } from "./useProfile";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateProfileBody) => userQuery.updateProfile(body),
    onSuccess: (user) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, user);
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (body: UpdatePasswordBody) => userQuery.updatePassword(body),
  });
};
