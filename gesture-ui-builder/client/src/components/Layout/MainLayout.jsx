import React from 'react';

const MainLayout = ({ children }) => {
  return <div className="min-h-screen flex flex-col">{children}</div>;
};

export default MainLayout;