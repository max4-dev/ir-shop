import { client } from "@src/shared/api";

import { orderApi } from "./order.api";
import type {
  Order,
  OrdersQueryParams,
  PaginatedOrders,
  UpdateOrderStatusDTO,
} from "./types/order.types";

export const orderQuery = {
  getAll: (params?: OrdersQueryParams) =>
    client.get<PaginatedOrders>(orderApi.admin, { searchParams: params }).json(),
  getById: (id: string) => client.get<Order>(orderApi.byId(id)).json(),
  updateStatus: (id: string, data: UpdateOrderStatusDTO) =>
    client.patch<Order>(orderApi.updateStatus(id), { json: data }).json(),
};
