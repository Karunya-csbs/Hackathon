import React from 'react';

const CenterPanel = ({ children }) => {
  // expand canvas area by increasing flex growth
  return <div className="flex-2 p-2 border-r overflow-auto">{children}</div>;
};

export default CenterPanel;