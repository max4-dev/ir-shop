import { ComponentPropsWithoutRef } from "react";

export interface PaginationProps extends ComponentPropsWithoutRef<"nav"> {
  total: number;
  limit: number;
  page?: number;
  offset?: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}
