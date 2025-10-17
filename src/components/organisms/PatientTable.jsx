import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { toast } from "react-toastify";
import patientService from "@/services/api/patientService";

const PatientTable = ({ patients, onPatientUpdate, className }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [updatingPatients, setUpdatingPatients] = useState(new Set());

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleStatusUpdate = async (patient, newStatus) => {
    setUpdatingPatients(prev => new Set(prev).add(patient.Id));
    
    try {
      await patientService.updateStatus(patient.Id, newStatus);
      toast.success(`Patient ${newStatus.replace('-', ' ')}`);
      onPatientUpdate?.();
    } catch (error) {
      toast.error("Failed to update patient status");
    } finally {
      setUpdatingPatients(prev => {
        const newSet = new Set(prev);
        newSet.delete(patient.Id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ApperIcon 
          name={sortField === field 
            ? (sortDirection === "asc" ? "ChevronUp" : "ChevronDown")
            : "ChevronsUpDown"
          } 
          className="w-4 h-4" 
        />
      </div>
    </th>
  );

  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Users" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
        <p className="text-gray-600 mb-4">Get started by adding your first patient.</p>
        <Button icon="UserPlus">Add New Patient</Button>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <SortableHeader field="firstName">Name</SortableHeader>
              <SortableHeader field="phone">Contact</SortableHeader>
              <SortableHeader field="dateOfBirth">Age</SortableHeader>
              <SortableHeader field="bloodType">Blood Type</SortableHeader>
              <SortableHeader field="currentStatus">Status</SortableHeader>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPatients.map((patient) => {
              const isUpdating = updatingPatients.has(patient.Id);
              
              return (
                <tr 
                  key={patient.Id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/patients/${patient.Id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-xs text-gray-500">ID: {patient.Id}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.phone}</div>
                    <div className="text-xs text-gray-500">{patient.email}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} yrs
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(patient.dateOfBirth)}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gradient-to-r from-info to-blue-600 text-white text-xs font-medium rounded-full">
                      {patient.bloodType}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-xs text-gray-500">Updating...</span>
                      </div>
                    ) : (
                      <StatusIndicator status={patient.currentStatus} />
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {patient.currentStatus === "waiting" && !isUpdating && (
                        <Button
                          size="sm"
                          variant="accent"
                          icon="UserCheck"
                          onClick={() => handleStatusUpdate(patient, "in-consultation")}
                        >
                          Check In
                        </Button>
                      )}
                      
                      {patient.currentStatus === "in-consultation" && !isUpdating && (
                        <Button
                          size="sm"
                          variant="primary"
                          icon="UserMinus"
                          onClick={() => handleStatusUpdate(patient, "completed")}
                        >
                          Check Out
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Eye"
                        onClick={() => navigate(`/patients/${patient.Id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;