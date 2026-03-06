import React from 'react';

const CodeViewer = ({ code = '' }) => {
  return (
    <div className="border rounded p-2 bg-gray-900 text-gray-100 font-mono text-xs overflow-auto">
      <pre>{code || '// Generated code will appear here'}</pre>
    </div>
  );
};

export default CodeViewer;