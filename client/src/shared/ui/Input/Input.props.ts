import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react";

interface BaseInputProps {
  label?: string;
  icon?: ReactNode;
  errorMessage?: string;
}

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  BaseInputProps;

export type PasswordInputProps = React.ComponentProps<typeof PasswordToggleField.Input> &
  BaseInputProps;
