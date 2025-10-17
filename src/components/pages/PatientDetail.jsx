import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import visitService from "@/services/api/visitService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  const loadPatientData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [patientData, appointmentsData, visitsData] = await Promise.all([
        patientService.getById(patientId),
        appointmentService.getByPatient(patientId),
        visitService.getByPatient(patientId)
      ]);
      
      setPatient(patientData);
      setAppointments(appointmentsData);
      setVisits(visitsData);
    } catch (err) {
      setError(err.message || "Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await patientService.updateStatus(patientId, newStatus);
      setPatient({ ...patient, currentStatus: newStatus });
      toast.success(`Patient status updated to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      toast.error("Failed to update patient status");
    }
  };

  const handleScheduleAppointment = () => {
    toast.info("Schedule appointment modal would open here");
  };

  const handleAddVisitNote = () => {
    toast.info("Add visit note modal would open here");
  };

  if (loading) {
    return <Loading rows={4} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPatientData} />;
  }

  if (!patient) {
    return <Error message="Patient not found" />;
  }

  const tabs = [
    { id: "info", label: "Patient Info", icon: "User" },
    { id: "history", label: "Medical History", icon: "FileText" },
    { id: "appointments", label: "Appointments", icon: "Calendar" },
    { id: "visits", label: "Visit Notes", icon: "Stethoscope" }
  ];

  const getAge = () => {
    return new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate("/patients")}
          >
            Back to Patients
          </Button>
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-gray-600">Patient ID: {patient.Id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <StatusIndicator status={patient.currentStatus} />
          <Button
            variant="outline"
            icon="Calendar"
            onClick={handleScheduleAppointment}
          >
            Schedule Appointment
          </Button>
          {patient.currentStatus === "waiting" && (
            <Button
              variant="accent"
              icon="UserCheck"
              onClick={() => handleStatusUpdate("in-consultation")}
            >
              Check In
            </Button>
          )}
          {patient.currentStatus === "in-consultation" && (
            <Button
              variant="primary"
              icon="UserMinus"
              onClick={() => handleStatusUpdate("completed")}
            >
              Check Out
            </Button>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{getAge()}</div>
          <div className="text-sm text-gray-600">Years Old</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">{appointments.length}</div>
          <div className="text-sm text-gray-600">Appointments</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-info mb-1">{visits.length}</div>
          <div className="text-sm text-gray-600">Visits</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">{patient.allergies?.length || 0}</div>
          <div className="text-sm text-gray-600">Allergies</div>
        </Card>
      </div>

      {/* Tab navigation */}
      <Card className="p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ApperIcon name="User" className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Full Name:</span>
                      <span className="ml-2 text-sm text-gray-900">{patient.firstName} {patient.lastName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Calendar" className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Date of Birth:</span>
                      <span className="ml-2 text-sm text-gray-900">{formatDate(patient.dateOfBirth)} ({getAge()} years old)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Users" className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Gender:</span>
                      <span className="ml-2 text-sm text-gray-900">{patient.gender}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Droplet" className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Blood Type:</span>
                      <Badge variant="info" className="ml-2">{patient.bloodType}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Phone" className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Phone:</span>
                      <span className="ml-2 text-sm text-gray-900">{patient.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Mail" className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-sm text-gray-900">{patient.email}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ApperIcon name="MapPin" className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Address:</span>
                      <span className="ml-2 text-sm text-gray-900">{patient.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {patient.emergencyContact && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="User" className="w-4 h-4 text-red-500" />
                      <div>
                        <span className="text-sm font-medium text-red-700">Name:</span>
                        <span className="ml-2 text-sm text-red-900">{patient.emergencyContact.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Heart" className="w-4 h-4 text-red-500" />
                      <div>
                        <span className="text-sm font-medium text-red-700">Relationship:</span>
                        <span className="ml-2 text-sm text-red-900">{patient.emergencyContact.relationship}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Phone" className="w-4 h-4 text-red-500" />
                      <div>
                        <span className="text-sm font-medium text-red-700">Phone:</span>
                        <span className="ml-2 text-sm text-red-900">{patient.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Allergies */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
              {patient.allergies && patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="warning">
                      <ApperIcon name="AlertTriangle" className="w-3 h-3" />
                      {allergy}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No known allergies</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
              <Button variant="primary" icon="Plus" size="sm">
                Add Record
              </Button>
            </div>
            
            {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
              <div className="space-y-4">
                {patient.medicalHistory.map((record, index) => (
                  <Card key={index} className="p-4 border-l-4 border-l-info">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{record.condition}</h4>
                        <p className="text-sm text-gray-600 mb-2">{record.notes}</p>
                        <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                      </div>
                      <ApperIcon name="FileText" className="w-5 h-5 text-info" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No medical history records found</p>
                <Button variant="primary" icon="Plus" className="mt-4">
                  Add First Record
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
              <Button variant="primary" icon="Calendar" size="sm" onClick={handleScheduleAppointment}>
                Schedule New
              </Button>
            </div>
            
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.Id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center">
                          <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.reason}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.scheduledDate)} at {appointment.startTime}
                          </p>
                          {appointment.notes && (
                            <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <StatusIndicator status={appointment.status} />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments scheduled</p>
                <Button variant="primary" icon="Calendar" className="mt-4" onClick={handleScheduleAppointment}>
                  Schedule First Appointment
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "visits" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Visit Notes</h3>
              <Button variant="primary" icon="Plus" size="sm" onClick={handleAddVisitNote}>
                Add Visit Note
              </Button>
            </div>
            
            {visits.length > 0 ? (
              <div className="space-y-4">
                {visits.map((visit) => (
                  <Card key={visit.Id} className="p-6 border-l-4 border-l-accent">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">
                          Visit on {formatDate(visit.visitDate)}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {visit.checkInTime} - {visit.checkOutTime}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Symptoms:</span>
                          <p className="text-sm text-gray-900 mt-1">{visit.symptoms}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Diagnosis:</span>
                          <p className="text-sm text-gray-900 mt-1">{visit.diagnosis}</p>
                        </div>
                      </div>
                      
                      {visit.prescriptions && visit.prescriptions.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Prescriptions:</span>
                          <div className="mt-2 space-y-2">
                            {visit.prescriptions.map((prescription, index) => (
                              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="font-medium text-blue-900">{prescription.medication}</div>
                                <div className="text-sm text-blue-700">{prescription.dosage}</div>
                                <div className="text-xs text-blue-600">Duration: {prescription.duration}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {visit.notes && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Notes:</span>
                          <p className="text-sm text-gray-900 mt-1">{visit.notes}</p>
                        </div>
                      )}
                      
                      {visit.followUpRequired && (
                        <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Calendar" className="w-4 h-4 text-warning-600" />
                            <span className="text-sm font-medium text-warning-800">Follow-up required</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Stethoscope" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No visit notes recorded</p>
                <Button variant="primary" icon="Plus" className="mt-4" onClick={handleAddVisitNote}>
                  Add First Visit Note
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientDetail;