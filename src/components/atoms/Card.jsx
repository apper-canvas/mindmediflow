import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className,
  hover = false,
  gradient = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl border border-gray-100 transition-all duration-200";
  
  const hoverStyles = hover ? "hover:shadow-card-hover hover:-translate-y-1 cursor-pointer" : "";
  
  const gradientStyles = gradient ? "bg-gradient-to-br from-white to-gray-50" : "";
  
  const shadowStyles = "shadow-card";

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        shadowStyles,
        hoverStyles,
        gradientStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;