import ArrowRight from "@src/shared/assets/icons/arrow-right.svg";
import Cart from "@src/shared/assets/icons/cart.svg";
import ChevronRight from "@src/shared/assets/icons/chevron-right.svg";
import EyeClosed from "@src/shared/assets/icons/eye-closed.svg";
import EyeOpen from "@src/shared/assets/icons/eye-open.svg";
import Favorite from "@src/shared/assets/icons/favorite.svg";
import Search from "@src/shared/assets/icons/search.svg";
import User from "@src/shared/assets/icons/user.svg";

export const Icon = { ArrowRight, ChevronRight, EyeClosed, EyeOpen, Search, Cart, Favorite, User };

export type IconType = keyof typeof Icon;
