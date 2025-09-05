"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none",
  outline:
    "border border-gray-300 text-foreground hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none",
  ghost:
    "hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none",
  link: "underline underline-offset-4 text-foreground disabled:opacity-50 disabled:pointer-events-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;


