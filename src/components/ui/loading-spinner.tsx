import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
  centered?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  default: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({
  size = "default",
  centered = true,
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex",
        centered && "min-h-[100px] items-center justify-center",
        className,
      )}
      {...props}
    >
      <Loader2
        className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
      />
    </div>
  );
}
