import { useQuery } from "@tanstack/react-query";

import { orderQuery, OrdersQueryParams } from "../../api";

export const useOrders = (params?: OrdersQueryParams) =>
  useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderQuery.getAll(params),
  });
