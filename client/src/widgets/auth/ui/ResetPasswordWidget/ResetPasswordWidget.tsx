import cn from "classnames";

import { ResetPasswordForm } from "@/src/features/auth/ui";

import { ResetPasswordWidgetProps } from "./ResetPasswordWidget.props";

export const ResetPasswordWidget = ({ className, token }: ResetPasswordWidgetProps) => {
  return <ResetPasswordForm className={cn(className)} token={token} />;
};
