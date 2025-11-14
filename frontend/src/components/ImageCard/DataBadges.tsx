import React from 'react';

interface DataBadgesProps {
  type: string;
  status: string;
}

const DataBadges: React.FC<DataBadgesProps> = ({ type, status }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {type}
      </span>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {status}
      </span>
    </div>
  );
};

export default DataBadges;
