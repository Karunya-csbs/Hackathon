import React from 'react';

const ComponentItem = ({ component, onSelect, isSelected }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({ type: component.type }));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect && onSelect(component)}
      className={`
        p-3 border-2 rounded cursor-grab hover:shadow-md transition-all
        ${isSelected 
          ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-300' 
          : 'border-gray-200 bg-white hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center gap-2">
        {component.icon && <span className="text-lg">{component.icon}</span>}
        <div>
          <div className={`text-sm font-semibold ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>
            {component.name}
          </div>
          <div className="text-xs text-gray-500">Click or drag</div>
        </div>
        {isSelected && (
          <span className="ml-auto text-green-600 font-bold text-lg">✓</span>
        )}
      </div>
    </div>
  );
};

export default ComponentItem;