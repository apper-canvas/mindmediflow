import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import appointmentService from "@/services/api/appointmentService";
import patientService from "@/services/api/patientService";
import doctorService from "@/services/api/doctorService";
import { format, addDays, subDays } from "date-fns";

const AppointmentCalendar = ({ className }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("day"); // day, week, month

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getByDate(dateString),
        patientService.getAll(),
        doctorService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const getPatientById = (patientId) => {
    return patients.find(p => p.Id === patientId);
  };

  const getDoctorById = (doctorId) => {
    return doctors.find(d => d.Id === doctorId);
  };

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  if (loading) {
    return <Loading rows={3} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Calendar header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h2>
            {format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && (
              <span className="px-3 py-1 bg-gradient-to-r from-accent to-green-600 text-white text-xs font-medium rounded-full">
                Today
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                icon="ChevronLeft"
                onClick={handlePreviousDay}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="ChevronRight"
                onClick={handleNextDay}
              />
            </div>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["day", "week", "month"].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 capitalize",
                    view === viewType
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {viewType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick stats for the day */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {appointments.length}
            </div>
            <div className="text-sm text-gray-600">Total Appointments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {appointments.filter(a => a.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {appointments.filter(a => a.status === "in-progress").length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-info mb-1">
              {appointments.filter(a => a.status === "scheduled").length}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
        </div>
      </Card>

      {/* Appointments list */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <Empty
            title="No appointments scheduled"
            message={`No appointments found for ${format(selectedDate, "MMMM d, yyyy")}`}
            actionLabel="Schedule Appointment"
            icon="Calendar"
          />
        ) : (
          appointments
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((appointment) => (
              <AppointmentCard
                key={appointment.Id}
                appointment={appointment}
                patient={getPatientById(appointment.patientId)}
                doctor={getDoctorById(appointment.doctorId)}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendar;