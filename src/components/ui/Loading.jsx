import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 5 }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48"></div>
        <div className="h-10 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg w-32"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
        <div className="space-y-4">
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            ))}
          </div>
          
          {/* Table rows */}
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 py-3 border-t border-gray-100">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Additional cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
            <div className="space-y-3">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
              <div className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;