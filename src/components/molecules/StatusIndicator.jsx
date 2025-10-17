import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusIndicator = ({ status, className }) => {
  const statusConfig = {
    waiting: {
      label: "Waiting",
      icon: "Clock",
      variant: "waiting"
    },
    "in-consultation": {
      label: "In Consultation",
      icon: "UserCheck",
      variant: "in-consultation"
    },
    completed: {
      label: "Completed",
      icon: "CheckCircle",
      variant: "completed"
    },
    cancelled: {
      label: "Cancelled",
      icon: "XCircle",
      variant: "cancelled"
    },
    scheduled: {
      label: "Scheduled",
      icon: "Calendar",
      variant: "scheduled"
    },
    "in-progress": {
      label: "In Progress",
      icon: "Activity",
      variant: "in-consultation"
    }
  };

  const config = statusConfig[status] || statusConfig.scheduled;

  return (
    <Badge 
      variant={config.variant} 
      className={cn("", className)}
    >
      <ApperIcon name={config.icon} className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export default StatusIndicator;