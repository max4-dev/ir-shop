import { useQuery } from "@tanstack/react-query";

import { orderQuery } from "../../api";
import type { OrdersQueryParams } from "../../api";
import { orderQueryKeys } from "../constants/order.constants";

export const useOrders = (params?: OrdersQueryParams) =>
  useQuery({
    queryKey: orderQueryKeys.all(params),
    queryFn: () => orderQuery.getAll(params),
  });

export const useOrder = (id: string | null) =>
  useQuery({
    queryKey: orderQueryKeys.detail(id ?? ""),
    queryFn: () => orderQuery.getById(id!),
    enabled: Boolean(id),
  });
