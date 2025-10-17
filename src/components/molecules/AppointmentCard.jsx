import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AppointmentCard = ({ 
  appointment, 
  patient,
  doctor,
  className,
  onReschedule,
  onCancel,
  onStart,
  onComplete
}) => {
  const formatTime = (time) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, "h:mm a");
    } catch {
      return time;
    }
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
      className={cn("p-6 transition-all duration-200 hover:shadow-card-hover", className)}
      hover={false}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center">
            <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
            </h3>
            <p className="text-sm text-gray-600">{formatDate(appointment.scheduledDate)}</p>
          </div>
        </div>
        <StatusIndicator status={appointment.status} />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <ApperIcon name="User" className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">
            {patient ? `${patient.firstName} ${patient.lastName}` : `Patient ID: ${appointment.patientId}`}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <ApperIcon name="Stethoscope" className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {doctor ? doctor.name : `Doctor ID: ${appointment.doctorId}`}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <ApperIcon name="FileText" className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{appointment.reason}</span>
        </div>
        
        {appointment.notes && (
          <div className="flex items-start gap-2">
            <ApperIcon name="MessageSquare" className="w-4 h-4 text-gray-500 mt-0.5" />
            <span className="text-gray-600 text-sm">{appointment.notes}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        {appointment.status === "scheduled" && (
          <>
            <Button
              size="sm"
              variant="outline"
              icon="Calendar"
              onClick={() => onReschedule?.(appointment)}
            >
              Reschedule
            </Button>
            <Button
              size="sm"
              variant="accent"
              icon="Play"
              onClick={() => onStart?.(appointment)}
            >
              Start
            </Button>
          </>
        )}
        
        {appointment.status === "in-progress" && (
          <Button
            size="sm"
            variant="primary"
            icon="CheckCircle"
            onClick={() => onComplete?.(appointment)}
          >
            Complete
          </Button>
        )}
        
        {["scheduled", "in-progress"].includes(appointment.status) && (
          <Button
            size="sm"
            variant="danger"
            icon="X"
            onClick={() => onCancel?.(appointment)}
          >
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AppointmentCard;