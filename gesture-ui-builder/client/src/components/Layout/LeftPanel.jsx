import React from 'react';

const LeftPanel = ({ children }) => {
  // slightly narrower to leave more room for canvas preview
  return <div className="w-1/5 p-2 border-r">{children}</div>;
};

export default LeftPanel;