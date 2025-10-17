import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-300 shadow-md hover:shadow-lg transform hover:scale-105",
    secondary: "bg-gradient-to-r from-secondary to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-300 shadow-md hover:shadow-lg transform hover:scale-105",
    accent: "bg-gradient-to-r from-accent to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-300 shadow-md hover:shadow-lg transform hover:scale-105",
    outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white focus:ring-primary-300 transform hover:scale-105",
    ghost: "text-primary hover:bg-primary-50 focus:ring-primary-300 transform hover:scale-105",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-300 shadow-md hover:shadow-lg transform hover:scale-105"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[32px]",
    md: "px-4 py-2 text-sm min-h-[40px]",
    lg: "px-6 py-3 text-base min-h-[48px]",
    xl: "px-8 py-4 text-lg min-h-[56px]"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" className="animate-spin" size={16} />}
      {!loading && icon && iconPosition === "left" && <ApperIcon name={icon} size={16} />}
      {children}
      {!loading && icon && iconPosition === "right" && <ApperIcon name={icon} size={16} />}
    </button>
  );
});

Button.displayName = "Button";

export default Button;