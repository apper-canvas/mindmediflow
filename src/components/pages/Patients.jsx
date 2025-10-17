import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientTable from "@/components/organisms/PatientTable";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import patientService from "@/services/api/patientService";
import { toast } from "react-toastify";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadPatients = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    let filtered = [...patients];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        patient.email.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(patient => patient.currentStatus === statusFilter);
    }

    setFilteredPatients(filtered);
  }, [patients, searchQuery, statusFilter]);

  const handleNewPatient = () => {
    toast.info("New patient registration form would open here");
  };

  const handleExport = () => {
    toast.info("Patient data export would start here");
  };

  const getStatusCounts = () => {
    return {
      all: patients.length,
      waiting: patients.filter(p => p.currentStatus === "waiting").length,
      "in-consultation": patients.filter(p => p.currentStatus === "in-consultation").length,
      completed: patients.filter(p => p.currentStatus === "completed").length,
      scheduled: patients.filter(p => p.currentStatus === "scheduled").length,
      cancelled: patients.filter(p => p.currentStatus === "cancelled").length
    };
  };

  if (loading) {
    return <Loading rows={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPatients} />;
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
            Patients
          </h1>
          <p className="text-gray-600 mt-1">
            Manage patient records and track their current status
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="primary"
            icon="UserPlus"
            onClick={handleNewPatient}
          >
            Add New Patient
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { key: "all", label: "All Patients", gradient: "from-primary to-primary-600" },
          { key: "waiting", label: "Waiting", gradient: "from-blue-500 to-blue-600" },
          { key: "in-consultation", label: "In Consultation", gradient: "from-warning to-orange-600" },
          { key: "completed", label: "Completed", gradient: "from-success to-green-600" },
          { key: "scheduled", label: "Scheduled", gradient: "from-info to-blue-600" },
          { key: "cancelled", label: "Cancelled", gradient: "from-gray-400 to-gray-500" }
        ].map((stat) => (
          <Card
            key={stat.key}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover ${
              statusFilter === stat.key ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
            onClick={() => setStatusFilter(stat.key)}
          >
            <div className="text-center">
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                {statusCounts[stat.key]}
              </div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search patients by name, phone, or email..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>
          
          <div className="md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">All Status</option>
              <option value="waiting">Waiting</option>
              <option value="in-consultation">In Consultation</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
          
          {(searchQuery || statusFilter !== "all") && (
            <Button
              variant="outline"
              icon="X"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Results */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ApperIcon name="Users" className="w-5 h-5 text-primary" />
            Patient Records ({filteredPatients.length})
          </h2>
          
          {filteredPatients.length > 0 && (
            <div className="text-sm text-gray-600">
              Showing {filteredPatients.length} of {patients.length} patients
            </div>
          )}
        </div>

        {filteredPatients.length === 0 && patients.length > 0 ? (
          <Empty
            title="No patients match your criteria"
            message="Try adjusting your search terms or filters to find patients."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
            icon="Search"
          />
        ) : filteredPatients.length === 0 ? (
          <Empty
            title="No patients registered"
            message="Get started by adding your first patient to the system."
            actionLabel="Add First Patient"
            onAction={handleNewPatient}
            icon="UserPlus"
          />
        ) : (
          <PatientTable 
            patients={filteredPatients}
            onPatientUpdate={loadPatients}
          />
        )}
      </Card>
    </div>
  );
};

export default Patients;