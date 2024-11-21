import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="card p-6 hover:scale-[1.02]">
      <div className="flex items-center">
        <div className={`bg-gradient-to-br ${color} rounded-xl p-3 text-white shadow-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;