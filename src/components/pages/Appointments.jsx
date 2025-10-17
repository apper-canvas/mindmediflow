import { useEffect, useState } from "react";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import appointmentService from "@/services/api/appointmentService";
import doctorService from "@/services/api/doctorService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [appointmentsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        doctorService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNewAppointment = () => {
    toast.info("New appointment booking modal would open here");
  };

  const handleExport = () => {
    toast.info("Appointment schedule export would start here");
  };

  const getAppointmentStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(a => a.scheduledDate === today);
    
    return {
      total: appointments.length,
      today: todaysAppointments.length,
      scheduled: appointments.filter(a => a.status === "scheduled").length,
      completed: appointments.filter(a => a.status === "completed").length,
      inProgress: appointments.filter(a => a.status === "in-progress").length,
      cancelled: appointments.filter(a => a.status === "cancelled").length
    };
  };

  if (loading) {
    return <Loading rows={4} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const stats = getAppointmentStats();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and schedule patient appointments
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={handleExport}
          >
            Export Schedule
          </Button>
          <Button
            variant="primary"
            icon="CalendarPlus"
            onClick={handleNewAppointment}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { key: "today", label: "Today", value: stats.today, gradient: "from-primary to-primary-600" },
          { key: "scheduled", label: "Scheduled", value: stats.scheduled, gradient: "from-info to-blue-600" },
          { key: "inProgress", label: "In Progress", value: stats.inProgress, gradient: "from-warning to-orange-600" },
          { key: "completed", label: "Completed", value: stats.completed, gradient: "from-success to-green-600" },
          { key: "cancelled", label: "Cancelled", value: stats.cancelled, gradient: "from-gray-400 to-gray-500" },
          { key: "total", label: "Total", value: stats.total, gradient: "from-accent to-green-600" }
        ].map((stat) => (
          <Card key={stat.key} className="p-4">
            <div className="text-center">
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-48">
            <Select
              label="Filter by Doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="all">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.Id} value={doctor.Id}>
                  {doctor.name}
                </option>
              ))}
            </Select>
          </div>
          
          <div className="md:w-48">
            <Select
              label="Filter by Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
          
          {(selectedDoctor !== "all" || selectedStatus !== "all") && (
            <div className="flex items-end">
              <Button
                variant="outline"
                icon="X"
                onClick={() => {
                  setSelectedDoctor("all");
                  setSelectedStatus("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-200 cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CalendarPlus" className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Book New Appointment</h3>
          <p className="text-sm text-gray-600 mb-4">Schedule a new patient appointment</p>
          <Button variant="primary" size="sm" onClick={handleNewAppointment}>
            Book Now
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-200 cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Clock" className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Check Availability</h3>
          <p className="text-sm text-gray-600 mb-4">View doctor schedules and availability</p>
          <Button variant="accent" size="sm">
            Check Now
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-200 cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-r from-info to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Schedule</h3>
          <p className="text-sm text-gray-600 mb-4">Update appointments and reschedule</p>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </Card>
      </div>

      {/* Calendar view */}
      <AppointmentCalendar />
    </div>
  );
};

export default Appointments;