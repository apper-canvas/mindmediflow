import { useEffect, useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import appointmentService from "@/services/api/appointmentService";
import patientService from "@/services/api/patientService";
import doctorService from "@/services/api/doctorService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sendingReminder, setSendingReminder] = useState(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError("");
    
    try {
      const upcomingAppointments = appointmentService.getUpcomingReminders(24);
      const [patients, doctors] = await Promise.all([
        patientService.getAll(),
        doctorService.getAll()
      ]);

      const enrichedNotifications = upcomingAppointments.map(appointment => {
        const patient = patients.find(p => p.Id === appointment.patientId);
        const doctor = doctors.find(d => d.Id === appointment.doctorId);
        
        return {
          Id: appointment.Id,
          appointmentId: appointment.Id,
          patientName: patient?.name || "Unknown",
          patientEmail: patient?.email || "",
          doctorName: doctor?.name || "Unknown",
          scheduledDate: appointment.scheduledDate,
          scheduledTime: appointment.scheduledTime,
          status: "pending",
          type: "reminder",
          createdAt: new Date().toISOString()
        };
      });

      setNotifications(enrichedNotifications);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleSendReminder = async (notification, notificationType = 'patient') => {
    setSendingReminder(notification.Id);
    
    try {
      await appointmentService.sendReminder(notification.appointmentId, notificationType);
      
      setNotifications(prev =>
        prev.map(n =>
          n.Id === notification.Id
            ? { ...n, status: "sent", sentAt: new Date().toISOString() }
            : n
        )
      );
      
      toast.success(`${notificationType === 'staff' ? 'Staff notification' : 'Patient reminder'} sent successfully`);
    } catch (error) {
      setNotifications(prev =>
        prev.map(n =>
          n.Id === notification.Id
            ? { ...n, status: "failed", error: error.message }
            : n
        )
      );
      
      toast.error(error.message || "Failed to send notification");
    } finally {
      setSendingReminder(null);
    }
  };

  const handleSendAllReminders = async () => {
    const pendingNotifications = notifications.filter(n => n.status === "pending");
    
    if (pendingNotifications.length === 0) {
      toast.info("No pending notifications to send");
      return;
    }

    for (const notification of pendingNotifications) {
      await handleSendReminder(notification);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getFilteredNotifications = () => {
    if (filterType === "all") return notifications;
    return notifications.filter(n => n.status === filterType);
  };

  const getNotificationStats = () => {
    return {
      total: notifications.length,
      pending: notifications.filter(n => n.status === "pending").length,
      sent: notifications.filter(n => n.status === "sent").length,
      failed: notifications.filter(n => n.status === "failed").length
    };
  };

  if (loading) {
    return <Loading rows={3} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadNotifications} />;
  }

  const stats = getNotificationStats();
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-gray-600 mt-1">
            Manage appointment reminders and notifications
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="RefreshCw"
            onClick={loadNotifications}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon="Send"
            onClick={handleSendAllReminders}
            disabled={stats.pending === 0}
          >
            Send All Pending
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: "total", label: "Total", value: stats.total, gradient: "from-primary to-primary-600", icon: "Bell" },
          { key: "pending", label: "Pending", value: stats.pending, gradient: "from-warning to-orange-600", icon: "Clock" },
          { key: "sent", label: "Sent", value: stats.sent, gradient: "from-success to-green-600", icon: "CheckCircle" },
          { key: "failed", label: "Failed", value: stats.failed, gradient: "from-error to-red-600", icon: "XCircle" }
        ].map((stat) => (
          <Card key={stat.key} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Select
            label="Filter by Status"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-48"
          >
            <option value="all">All Notifications</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </Select>
          
          {filterType !== "all" && (
            <Button
              variant="ghost"
              icon="X"
              onClick={() => setFilterType("all")}
              className="mt-6"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </Card>

      {filteredNotifications.length === 0 ? (
        <Empty
          icon="Bell"
          title="No notifications found"
          description="There are no notifications matching your filter criteria"
        />
      ) : (
        <div className="grid gap-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification.Id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-600 flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="Bell" className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          Appointment Reminder
                        </h3>
                        <Badge
                          variant={
                            notification.status === "sent"
                              ? "success"
                              : notification.status === "failed"
                              ? "error"
                              : "warning"
                          }
                        >
                          {notification.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <ApperIcon name="User" size={14} />
                          <span>Patient: {notification.patientName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Mail" size={14} />
                          <span>{notification.patientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Stethoscope" size={14} />
                          <span>Doctor: {notification.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Calendar" size={14} />
                          <span>
                            {format(new Date(notification.scheduledDate), "PPP")} at{" "}
                            {notification.scheduledTime}
                          </span>
                        </div>
                        {notification.sentAt && (
                          <div className="flex items-center gap-2 text-success">
                            <ApperIcon name="CheckCircle" size={14} />
                            <span>
                              Sent: {format(new Date(notification.sentAt), "PPp")}
                            </span>
                          </div>
                        )}
                        {notification.error && (
                          <div className="flex items-center gap-2 text-error">
                            <ApperIcon name="AlertCircle" size={14} />
                            <span>{notification.error}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {notification.status === "pending" || notification.status === "failed" ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        icon="Send"
                        onClick={() => handleSendReminder(notification, 'patient')}
                        disabled={sendingReminder === notification.Id}
                      >
                        {sendingReminder === notification.Id ? "Sending..." : "Send to Patient"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Users"
                        onClick={() => handleSendReminder(notification, 'staff')}
                        disabled={sendingReminder === notification.Id}
                      >
                        Notify Staff
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="RotateCw"
                      onClick={() => handleSendReminder(notification, 'patient')}
                      disabled={sendingReminder === notification.Id}
                    >
                      Resend
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;