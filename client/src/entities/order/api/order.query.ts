import { client } from "@/src/shared/api";

import { orderApi } from "./order.api";
import {
  CreateOrderBody,
  CreateOrderResult,
  Order,
  OrdersQueryParams,
  PaginatedOrders,
} from "./types/order.types";

export const orderQuery = {
  create: (body: CreateOrderBody) =>
    client.post<CreateOrderResult>(orderApi.root, { json: body }).json(),
  getAll: (params?: OrdersQueryParams) =>
    client.get<PaginatedOrders>(orderApi.root, { searchParams: params }).json(),
  getById: (id: string) => client.get<Order>(orderApi.byId(id)).json(),
  cancel: (id: string) => client.post<Order>(orderApi.cancel(id)).json(),
};
