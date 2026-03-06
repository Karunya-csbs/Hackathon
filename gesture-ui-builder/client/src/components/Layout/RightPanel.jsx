import React from 'react';

const RightPanel = ({ children }) => {
  // shrink width a bit so canvas gets more horizontal space
  return <div className="w-1/5 p-2 border-l overflow-auto">{children}</div>;
};

export default RightPanel;