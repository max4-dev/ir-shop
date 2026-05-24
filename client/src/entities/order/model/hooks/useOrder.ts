import { useQuery } from "@tanstack/react-query";

import { orderQuery } from "../../api";
import { OrderStatus } from "../../api";

type UseOrderOptions = {
  refetchInterval?: number | false;
};

export const useOrder = (id: string, options?: UseOrderOptions) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderQuery.getById(id),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      if (options?.refetchInterval === false) return false;
      if (options?.refetchInterval) return options.refetchInterval;

      return query.state.data?.status === OrderStatus.PENDING_PAYMENT ? 3000 : false;
    },
  });
