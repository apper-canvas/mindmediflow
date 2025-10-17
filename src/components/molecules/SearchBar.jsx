import { useState } from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  className,
  placeholder = "Search...",
  onSearch,
  onClear,
  value = "",
  onChange
}) => {
  const [searchValue, setSearchValue] = useState(value);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (onChange) {
      onChange("");
    }
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-lg bg-white text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary-100"
        />
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;