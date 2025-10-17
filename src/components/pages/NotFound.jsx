import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="p-8 text-center max-w-md mx-auto" gradient>
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="FileQuestion" className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="primary"
            icon="Home"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Go to Dashboard
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              icon="Users"
              onClick={() => navigate("/patients")}
              className="flex-1"
            >
              Patients
            </Button>
            <Button
              variant="outline"
              icon="Calendar"
              onClick={() => navigate("/appointments")}
              className="flex-1"
            >
              Appointments
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you think this is a mistake, please contact support.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;