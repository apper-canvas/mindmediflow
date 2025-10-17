import { useEffect, useState } from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import doctorService from "@/services/api/doctorService";

const DashboardStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [patients, appointments, doctors] = await Promise.all([
        patientService.getAll(),
        appointmentService.getTodaysAppointments(),
        doctorService.getAll()
      ]);

      const todayDate = new Date().toISOString().split('T')[0];
      
      setStats({
        totalPatients: patients.length,
        todaysAppointments: appointments.length,
        waitingPatients: patients.filter(p => p.currentStatus === "waiting").length,
        inConsultation: patients.filter(p => p.currentStatus === "in-consultation").length,
        completedToday: appointments.filter(a => a.status === "completed").length,
        availableDoctors: doctors.length
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <Loading rows={2} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStats} />;
  }

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: "Users",
      gradient: "from-primary to-primary-600",
      change: "+12% this month"
    },
    {
      title: "Today's Appointments",
      value: stats.todaysAppointments,
      icon: "Calendar",
      gradient: "from-accent to-green-600",
      change: `${stats.completedToday} completed`
    },
    {
      title: "Waiting Patients",
      value: stats.waitingPatients,
      icon: "Clock",
      gradient: "from-warning to-orange-600",
      change: "Current queue"
    },
    {
      title: "In Consultation",
      value: stats.inConsultation,
      icon: "Activity",
      gradient: "from-info to-blue-600",
      change: "Active now"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card 
          key={stat.title}
          className="p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
          gradient
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-md`}>
              <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;