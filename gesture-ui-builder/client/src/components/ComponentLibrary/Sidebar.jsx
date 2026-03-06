import React from 'react';
import ComponentItem from './ComponentItem';

const componentList = [
  { id: 'btn', name: 'Button', type: 'button', icon: '🔘' },
  { id: 'card', name: 'Card', type: 'card', icon: '📇' },
  { id: 'navbar', name: 'Navbar', type: 'navbar', icon: '📶' },
  { id: 'input', name: 'Input', type: 'input', icon: '📝' },
  { id: 'grid', name: 'Grid', type: 'grid', icon: '⌗' },
  { id: 'form', name: 'Form', type: 'form', icon: '📋' },
  { id: 'modal', name: 'Modal', type: 'modal', icon: '🪟' },
  { id: 'image', name: 'Image', type: 'image', icon: '🖼️' },
];

const Sidebar = ({ onComponentSelect, selectedComponent }) => {
  return (
    <div className="bg-white border rounded p-3">
      <h3 className="font-bold mb-3 flex items-center">
        📦 Components Library
      </h3>
      <div className="space-y-2">
        {componentList.map((comp) => (
          <ComponentItem
            key={comp.id}
            component={comp}
            onSelect={onComponentSelect}
            isSelected={selectedComponent?.type === comp.type}
          />
        ))}
      </div>
      
      {/* Instructions */}
      <div className="mt-4 p-2 bg-blue-50 rounded text-xs border border-blue-200">
        <p className="font-semibold text-blue-700 mb-1">✌️ How to Use:</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-600">
          <li>Click to select a component</li>
          <li>Press "Add Component" button</li>
          <li>Or use 👍 Thumbs Up gesture</li>
          <li>Drag on canvas with ✌️ Two Fingers</li>
        </ol>
      </div>
    </div>
  );
};

export default Sidebar;