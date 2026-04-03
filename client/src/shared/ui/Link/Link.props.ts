import NextLink from "next/link";

export interface LinkProps extends React.ComponentProps<typeof NextLink> {
  size?: "small" | "medium" | "big";
  appearance?: "text" |"primary" | "ghost" | "disabled";
}
