import { DetailedHTMLProps, HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes } from "react";

export interface BreadcrumbProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> {}

export interface BreadcrumbListProps extends DetailedHTMLProps<
  OlHTMLAttributes<HTMLOListElement>,
  HTMLOListElement
> {}

export interface BreadcrumbItemProps extends DetailedHTMLProps<
  LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
> {}

export interface BreadcrumbLinkProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> {
  asChild?: boolean;
}

export interface BreadcrumbPageProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> {}

export interface BreadcrumbSeparatorProps extends DetailedHTMLProps<
  LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
> {}
