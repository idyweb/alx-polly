import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm dark:border-gray-800 dark:bg-black dark:text-gray-100",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div className={cn("p-6 pb-0", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3 className={cn("text-lg font-semibold", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: CardProps) {
  return (
    <p className={cn("text-sm text-gray-600 dark:text-gray-400", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props} />
  );
}


