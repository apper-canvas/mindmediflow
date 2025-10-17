import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const PatientCard = ({ 
  patient, 
  className,
  onViewDetails,
  onCheckIn,
  onCheckOut,
  showActions = true
}) => {
  const getStatusColor = (status) => {
    const colors = {
      waiting: "border-l-blue-500",
      "in-consultation": "border-l-orange-500",
      completed: "border-l-success",
      cancelled: "border-l-gray-400",
      scheduled: "border-l-primary"
    };
    return colors[status] || colors.scheduled;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Card 
      className={cn(
        "p-6 border-l-4 transition-all duration-200 hover:shadow-card-hover",
        getStatusColor(patient.currentStatus),
        className
      )}
      hover={false}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-sm text-gray-600">ID: {patient.Id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Phone" className="w-4 h-4" />
              {patient.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Mail" className="w-4 h-4" />
              {patient.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              DOB: {formatDate(patient.dateOfBirth)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Droplet" className="w-4 h-4" />
              {patient.bloodType}
            </div>
          </div>
          
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Allergies:</p>
              <div className="flex flex-wrap gap-1">
                {patient.allergies.map((allergy, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-warning-50 text-warning-700 rounded-md text-xs"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <StatusIndicator status={patient.currentStatus} />
          
          {showActions && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                icon="Eye"
                onClick={() => onViewDetails?.(patient)}
              >
                Details
              </Button>
              
              {patient.currentStatus === "waiting" && (
                <Button
                  size="sm"
                  variant="accent"
                  icon="UserCheck"
                  onClick={() => onCheckIn?.(patient)}
                >
                  Check In
                </Button>
              )}
              
              {patient.currentStatus === "in-consultation" && (
                <Button
                  size="sm"
                  variant="primary"
                  icon="UserMinus"
                  onClick={() => onCheckOut?.(patient)}
                >
                  Check Out
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PatientCard;