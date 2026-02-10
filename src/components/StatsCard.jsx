import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  color = 'purple' 
}) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const bgColorClasses = {
    purple: 'bg-purple-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
  };

  return (
    <div className={`${bgColorClasses[color]} rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}%
              </span>
              <span className="text-gray-500 text-sm ml-1">so với hôm qua</span>
            </div>
          )}
        </div>
        
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-md`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
