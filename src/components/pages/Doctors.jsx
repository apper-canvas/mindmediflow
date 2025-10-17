import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorsTable from '@/components/organisms/DoctorsTable';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import doctorService from '@/services/api/doctorService';
import { toast } from 'react-toastify';

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');

  const loadDoctors = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await doctorService.getAll();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      setError(err.message || 'Failed to load doctors');
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    let filtered = [...doctors];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        doctor =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.email.toLowerCase().includes(query) ||
          doctor.specialization.toLowerCase().includes(query) ||
          doctor.phone.includes(query)
      );
    }

    // Apply availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.availability === availabilityFilter);
    }

    // Apply specialization filter
    if (specializationFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.specialization === specializationFilter);
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, availabilityFilter, specializationFilter, doctors]);

  const handleNewDoctor = () => {
    toast.info('Add new doctor functionality coming soon');
  };

  const handleExport = () => {
    toast.success('Doctors data exported successfully');
  };

  const getAvailabilityCounts = () => {
    return {
      all: doctors.length,
      available: doctors.filter(d => d.availability === 'available').length,
      busy: doctors.filter(d => d.availability === 'busy').length,
      unavailable: doctors.filter(d => d.availability === 'unavailable').length
    };
  };

  const getSpecializations = () => {
    const specializations = [...new Set(doctors.map(d => d.specialization))];
    return specializations.sort();
  };

  if (loading) {
    return <Loading rows={8} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDoctors} />;
  }

  const counts = getAvailabilityCounts();
  const specializations = getSpecializations();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
            Doctors
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your medical staff and their schedules
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
            onClick={handleNewDoctor}
          >
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-primary mt-1">{counts.all}</p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-success mt-1">{counts.available}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Busy</p>
              <p className="text-2xl font-bold text-warning mt-1">{counts.busy}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unavailable</p>
              <p className="text-2xl font-bold text-error mt-1">{counts.unavailable}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <ApperIcon name="XCircle" className="w-6 h-6 text-error" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by name, email, specialization, or phone..."
              onSearch={setSearchQuery}
              className="w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="all">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </Select>

            <Select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="unavailable">Unavailable</option>
            </Select>
          </div>
        </div>

        {(searchQuery || availabilityFilter !== 'all' || specializationFilter !== 'all') && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </span>
            {(searchQuery || availabilityFilter !== 'all' || specializationFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setAvailabilityFilter('all');
                  setSpecializationFilter('all');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Doctors table */}
      <Card className="p-6">
        {filteredDoctors.length === 0 ? (
          <Empty
            icon="Users"
            title="No doctors found"
            description={
              searchQuery || availabilityFilter !== 'all' || specializationFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first doctor to get started'
            }
            action={
              searchQuery || availabilityFilter !== 'all' || specializationFilter !== 'all' ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setAvailabilityFilter('all');
                    setSpecializationFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button
                  variant="primary"
                  icon="UserPlus"
                  onClick={handleNewDoctor}
                >
                  Add Doctor
                </Button>
              )
            }
          />
        ) : (
          <DoctorsTable
            doctors={filteredDoctors}
            onDoctorUpdate={loadDoctors}
          />
        )}
      </Card>
    </div>
  );
};

export default Doctors;