import { useQuery } from "@tanstack/react-query";

import { categoryQuery } from "../../api";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryQuery.getAll(),
  });
