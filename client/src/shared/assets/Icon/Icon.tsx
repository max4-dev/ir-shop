import ArrowIcon from "@src/shared/assets/icons/arrow.svg";
import EyeClosed from "@src/shared/assets/icons/eye-closed.svg";
import EyeOpen from "@src/shared/assets/icons/eye-open.svg";

export const Icon = { ArrowIcon, EyeClosed, EyeOpen };

export type IconType = keyof typeof Icon;
