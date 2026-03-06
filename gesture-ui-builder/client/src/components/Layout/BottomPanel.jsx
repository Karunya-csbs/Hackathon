import React from 'react';

const BottomPanel = ({ children }) => {
  // shrink code panel to give more room for canvas
  return <div className="h-1/4 p-2 border-t overflow-auto bg-gray-50">{children}</div>;
};

export default BottomPanel;