import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
      exact: true
    },
    {
      name: "Patients",
      href: "/patients",
      icon: "Users"
    },
    {
      name: "Appointments",
      href: "/appointments",
      icon: "Calendar"
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Desktop sidebar - static positioning */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm z-30">
        <div className="flex flex-col flex-1">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                MediFlow
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive(item)
                    ? "bg-gradient-to-r from-primary to-primary-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary"
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive(item) 
                      ? "text-white" 
                      : "text-gray-500 group-hover:text-primary group-hover:scale-110"
                  )} 
                />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Heart" className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Healthcare</div>
                <div className="text-xs text-gray-500">Management System</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar - transform-based overlay */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                MediFlow
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive(item)
                    ? "bg-gradient-to-r from-primary to-primary-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary"
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive(item) 
                      ? "text-white" 
                      : "text-gray-500 group-hover:text-primary group-hover:scale-110"
                  )} 
                />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;