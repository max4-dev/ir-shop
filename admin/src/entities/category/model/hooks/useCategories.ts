import { useQuery } from "@tanstack/react-query";

import { categoryQuery } from "../../api";
import { categoryQueryKeys } from "../constants/category.query-keys";

export const useCategories = () =>
  useQuery({
    queryKey: categoryQueryKeys.all,
    queryFn: () => categoryQuery.getAll(),
  });
