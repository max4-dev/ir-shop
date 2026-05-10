export interface TitleProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
> {
  size: "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}
