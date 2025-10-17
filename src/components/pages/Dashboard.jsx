import DashboardStats from "@/components/organisms/DashboardStats";
import PatientTable from "@/components/organisms/PatientTable";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentPatients, setRecentPatients] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [allPatients, appointments] = await Promise.all([
        patientService.getAll(),
        appointmentService.getTodaysAppointments()
      ]);
      
      // Get recent patients (last 5 based on creation date)
      const sortedPatients = allPatients
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setRecentPatients(sortedPatients);
      setTodaysAppointments(appointments);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading rows={4} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening at your clinic today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="Users"
            onClick={() => navigate("/patients")}
          >
            View All Patients
          </Button>
          <Button
            variant="primary"
            icon="Calendar"
            onClick={() => navigate("/appointments")}
          >
            View Schedule
          </Button>
        </div>
      </div>

      {/* Dashboard statistics */}
      <DashboardStats />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent patients */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="Users" className="w-5 h-5 text-primary" />
                Recent Patients
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon="ArrowRight"
                onClick={() => navigate("/patients")}
              >
                View All
              </Button>
            </div>
            
            <PatientTable 
              patients={recentPatients}
              onPatientUpdate={loadDashboardData}
            />
          </Card>
        </div>

        {/* Quick actions & today's summary */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Zap" className="w-5 h-5 text-accent" />
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="accent"
                className="w-full justify-start"
                icon="UserPlus"
              >
                Add New Patient
              </Button>
              <Button
                variant="primary"
                className="w-full justify-start"
                icon="CalendarPlus"
              >
                Schedule Appointment
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Search"
                onClick={() => navigate("/patients")}
              >
                Search Patients
              </Button>
            </div>
          </Card>

          {/* Today's summary */}
          <Card className="p-6 bg-gradient-to-br from-primary-50 to-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
              Today's Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-blue-100">
                <span className="text-gray-600">Appointments</span>
                <span className="font-semibold text-primary">
                  {todaysAppointments.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-blue-100">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-accent">
                  {todaysAppointments.filter(a => a.status === "completed").length}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Remaining</span>
                <span className="font-semibold text-warning">
                  {todaysAppointments.filter(a => ["scheduled", "in-progress"].includes(a.status)).length}
                </span>
              </div>
            </div>
          </Card>

          {/* System status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Activity" className="w-5 h-5 text-success" />
              System Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-success font-medium">Online</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Storage Used</span>
                <span className="text-sm text-gray-500">45% of 100GB</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;