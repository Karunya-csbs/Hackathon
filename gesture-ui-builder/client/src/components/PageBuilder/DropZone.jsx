import React from 'react';

const DropZone = ({ onDrop }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    const data = e.dataTransfer.getData('application/json');
    if (data && onDrop) {
      onDrop(JSON.parse(data));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="min-h-96 border-2 border-dashed border-gray-300 rounded p-4 transition"
    >
      <div className="text-center text-gray-400">Drop components here</div>
    </div>
  );
};

export default DropZone;