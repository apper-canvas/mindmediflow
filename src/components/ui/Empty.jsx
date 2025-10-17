import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  title = "No data found",
  message = "There are no items to display at the moment.",
  actionLabel,
  onAction,
  icon = "Search"
}) => {
  return (
    <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
      <Card className="p-8 text-center max-w-md mx-auto" gradient>
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name={icon} className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            icon="Plus"
            className="mx-auto"
          >
            {actionLabel}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Empty;