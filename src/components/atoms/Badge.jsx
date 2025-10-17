import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  size = "md",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center gap-1 font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success to-green-600 text-white shadow-sm",
    warning: "bg-gradient-to-r from-warning to-orange-600 text-white shadow-sm",
    error: "bg-gradient-to-r from-error to-red-600 text-white shadow-sm",
    info: "bg-gradient-to-r from-info to-blue-600 text-white shadow-sm",
    primary: "bg-gradient-to-r from-primary to-primary-600 text-white shadow-sm",
    waiting: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
    "in-consultation": "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm",
    completed: "bg-gradient-to-r from-success to-green-600 text-white shadow-sm",
    cancelled: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm",
    scheduled: "bg-gradient-to-r from-primary to-primary-600 text-white shadow-sm"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;