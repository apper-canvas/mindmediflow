import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry,
  title = "Error"
}) => {
  return (
    <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            icon="RefreshCw"
            className="mx-auto"
          >
            Try Again
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Error;