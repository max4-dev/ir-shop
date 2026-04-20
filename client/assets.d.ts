declare module "*.css";

declare module "*.svg" {
  import { FC, SVGProps } from "react";

  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  const content: unknown;
  export default content;
}

declare module "*.png" {
  const content: import("../dist/shared/lib/image-external").StaticImageData;

  export default content;
}

declare module "*.jpg" {
  const content: import("../dist/shared/lib/image-external").StaticImageData;

  export default content;
}

declare module "*.jpeg" {
  const content: import("../dist/shared/lib/image-external").StaticImageData;

  export default content;
}

declare module "*.gif" {
  const content: import("../dist/shared/lib/image-external").StaticImageData;

  export default content;
}

declare module "*.webp" {
  const content: import("../dist/shared/lib/image-external").StaticImageData;

  export default content;
}

declare module "*.avif" {
  const content: import("../dist/shared/lib/image-external").StaticImageData;

  export default content;
}

declare module "*.ico" {
  const content: import("../dist/shared/lib/image-external").StaticImageData;

  export default content;
}

declare module "*.bmp" {
  const content: import("../dist/shared/lib/image-external").StaticImageData;

  export default content;
}
