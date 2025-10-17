import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import patientService from "@/services/api/patientService";
import { toast } from "react-toastify";

const Header = ({ onMobileMenuToggle }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await patientService.search(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      toast.error("Search failed. Please try again.");
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePatientSelect = (patient) => {
    navigate(`/patients/${patient.Id}`);
    setShowResults(false);
    setSearchResults([]);
  };

  const handleNewPatient = () => {
    // This would open a new patient modal in a real app
    toast.info("New patient form would open here");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          />
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
              MediFlow
            </h1>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4 relative">
          <SearchBar
            placeholder="Search patients by name, phone, or email..."
            onSearch={handleSearch}
            className="w-full"
          />
          
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mx-auto mb-2" />
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((patient) => (
                    <button
                      key={patient.Id}
                      onClick={() => handlePatientSelect(patient)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {patient.phone} • {patient.email}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No patients found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="accent"
            size="sm"
            icon="UserPlus"
            onClick={handleNewPatient}
            className="hidden md:flex"
          >
            New Patient
          </Button>
          
          <Button
            variant="accent"
            size="sm"
            icon="UserPlus"
            onClick={handleNewPatient}
            className="md:hidden"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;