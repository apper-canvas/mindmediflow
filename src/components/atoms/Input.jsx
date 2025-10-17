import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  label,
  required = false,
  ...props 
}, ref) => {
  const baseStyles = "flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50";
  
  const errorStyles = error ? "border-error focus:border-error focus:ring-error-100" : "";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(baseStyles, errorStyles, className)}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;