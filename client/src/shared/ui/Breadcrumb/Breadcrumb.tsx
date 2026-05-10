import cn from "classnames";
import { Slot } from "radix-ui";

import { Icon } from "../../assets";

import styles from "./Breadcrumb.module.css";
import {
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from "./Breadcrumb.props";

export const Breadcrumb = ({ className, children, ...props }: BreadcrumbProps) => {
  return (
    <nav aria-label="breadcrumb" data-slot="breadcrumb" className={cn(className, styles.breadcrumb)} {...props}>
      {children}
    </nav>
  );
};

const BreadcrumbList = ({ className, ...props }: BreadcrumbListProps) => {
  return <ol data-slot="breadcrumb-list" className={cn(className, styles.list)} {...props} />;
};

const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => {
  return <li data-slot="breadcrumb-item" className={cn(className, styles.item)} {...props} />;
};

const BreadcrumbLink = ({ asChild, className, ...props }: BreadcrumbLinkProps) => {
  const Comp = asChild ? Slot.Root : "a";

  return <Comp data-slot="breadcrumb-link" className={cn(className, styles.link)} {...props} />;
};

const BreadcrumbPage = ({ className, ...props }: BreadcrumbPageProps) => {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(className, styles.page)}
      {...props}
    />
  );
};

const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(className, styles.separator)}
      {...props}
    >
      {children ?? <Icon.ChevronRight className={styles.icon} />}
    </li>
  );
};

Breadcrumb.List = BreadcrumbList;
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Link = BreadcrumbLink;
Breadcrumb.Page = BreadcrumbPage;
Breadcrumb.Separator = BreadcrumbSeparator;
