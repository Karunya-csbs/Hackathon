import React from 'react';
import DraggableComponent from './DraggableComponent';

const Canvas = ({ layout = [] }) => {
  return (
    <div className="w-full h-full bg-white border rounded p-4 min-h-96">
      <div className="grid grid-cols-1 gap-4">
        {layout.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            Drop components here to build
          </div>
        ) : (
          layout.map((component, index) => (
            <DraggableComponent key={index} component={component} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default Canvas;