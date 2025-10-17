import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import StatusIndicator from '@/components/molecules/StatusIndicator';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import doctorService from '@/services/api/doctorService';

const DoctorsTable = ({ doctors, onDoctorUpdate, className }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (doctor) => {
    navigate(`/doctors/${doctor.Id}`);
  };

  const handleAvailabilityUpdate = async (doctor, newAvailability) => {
    try {
      await doctorService.update(doctor.Id, { availability: newAvailability });
      toast.success(`Dr. ${doctor.name}'s availability updated to ${newAvailability}`);
      if (onDoctorUpdate) {
        onDoctorUpdate();
      }
    } catch (error) {
      toast.error(`Failed to update availability: ${error.message}`);
    }
  };

  const getAvailabilityVariant = (availability) => {
    switch (availability) {
      case 'available':
        return 'success';
      case 'busy':
        return 'warning';
      case 'unavailable':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAvailabilityLabel = (availability) => {
    return availability.charAt(0).toUpperCase() + availability.slice(1);
  };

  const sortedDoctors = [...doctors].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'name' || sortField === 'specialization') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          <ApperIcon
            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
            size={14}
            className="text-primary"
          />
        )}
      </div>
    </th>
  );

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader field="name">Doctor Name</SortableHeader>
            <SortableHeader field="specialization">Specialization</SortableHeader>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <SortableHeader field="availability">Availability</SortableHeader>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedDoctors.map((doctor) => (
            <tr
              key={doctor.Id}
              onClick={() => handleRowClick(doctor)}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="Stethoscope" size={20} className="text-primary" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Dr. {doctor.name}
                    </div>
                    <div className="text-sm text-gray-500">ID: {doctor.Id}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Briefcase" size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">{doctor.specialization}</span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <ApperIcon name="Mail" size={14} className="text-gray-400" />
                    {doctor.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ApperIcon name="Phone" size={14} className="text-gray-400" />
                    {doctor.phone}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <StatusIndicator
                  status={doctor.availability}
                  variant={getAvailabilityVariant(doctor.availability)}
                  label={getAvailabilityLabel(doctor.availability)}
                />
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Eye"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/doctors/${doctor.Id}`);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Edit doctor functionality coming soon');
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsTable;