import React from 'react';

const ConfidenceMeter = ({ confidence = 0 }) => {
  const percentage = confidence * 100;
  const barColor = percentage < 40 ? 'bg-red-500' : percentage < 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="p-4 border rounded">
      <h4 className="text-sm font-bold mb-2">Confidence Level</h4>
      <div className="w-full h-4 bg-gray-200 rounded">
        <div className={`h-full ${barColor} rounded`} style={{ width: `${percentage}%` }} />
      </div>
      <div className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}%</div>
    </div>
  );
};

export default ConfidenceMeter;