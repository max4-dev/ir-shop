"use client";

import cn from "classnames";
import { Label, unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { useId } from "react";

import { Icon } from "../../assets";

import styles from "./Input.module.css";
import { InputProps, PasswordInputProps } from "./Input.props";

export const Input = ({ className, label, icon, errorMessage, ...props }: InputProps) => {
  const id = useId();
  return (
    <div className={cn(styles.inputBox, className)}>
      {label && (
        <Label.Root className={cn(styles.label)} htmlFor={id}>
          {label}
        </Label.Root>
      )}
      {icon && <span className={styles.icon}>{icon}</span>}
      <input
        className={cn(styles.input, { [styles.errorInput]: errorMessage, [styles.withIcon]: icon })}
        id={id}
        {...props}
      />
      {errorMessage && <span className={styles.error}>{errorMessage}</span>}
    </div>
  );
};

const PasswordInput = ({ className, label, errorMessage, ...props }: PasswordInputProps) => {
  const id = useId();
  return (
    <PasswordToggleField.Root>
      <div className={cn(styles.inputBox, className)}>
        {label && (
          <Label.Root className={cn(styles.label)} htmlFor={id}>
            {label}
          </Label.Root>
        )}
        <div className={styles.passwordBox}>
          <PasswordToggleField.Input
            className={cn(styles.input, styles.passwordInput, {
              [styles.errorInput]: errorMessage,
            })}
            id={id}
            {...props}
          />
          <PasswordToggleField.Toggle className={styles.passwordToggle}>
            <PasswordToggleField.Icon visible={<Icon.EyeOpen />} hidden={<Icon.EyeClosed />} />
          </PasswordToggleField.Toggle>
        </div>
        {errorMessage && <span className={styles.error}>{errorMessage}</span>}
      </div>
    </PasswordToggleField.Root>
  );
};

Input.Password = PasswordInput;
