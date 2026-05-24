import { useQuery } from "@tanstack/react-query";

import { cartQuery } from "../../api";

export const useCart = () =>
  useQuery({
    queryKey: ["cart"],
    queryFn: () => cartQuery.get(),
  });
