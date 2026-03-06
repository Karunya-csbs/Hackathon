import React from 'react';
import GestureComponentItem from './GestureComponentItem';

export const componentList = [
  { id: 'btn', name: 'Button', type: 'button', icon: '🔘' },
  { id: 'card', name: 'Card', type: 'card', icon: '📇' },
  { id: 'navbar', name: 'Navbar', type: 'navbar', icon: '📶' },
  { id: 'input', name: 'Input', type: 'input', icon: '📝' },
  { id: 'grid', name: 'Grid', type: 'grid', icon: '⌗' },
  { id: 'form', name: 'Form', type: 'form', icon: '📋' },
  { id: 'modal', name: 'Modal', type: 'modal', icon: '🪟' },
  { id: 'image', name: 'Image', type: 'image', icon: '🖼️' },
];

/**
 * Enhanced Component Library Sidebar
 * Supports both traditional click/drag and gesture-based interaction
 * Shows finger position feedback and visual highlighting for gesture interaction
 */
const GestureSidebar = ({ 
  onComponentSelect, 
  selectedComponent,
  fingerPosition,
  gesture,
  isDragging,
  draggedComponentType,
  onGestureComponentStart
}) => {
  return (
    <div className="bg-white border rounded p-3">
      <h3 className="font-bold mb-3 flex items-center">
        📦 Components Library
      </h3>
      <div className="space-y-2">
        {componentList.map((comp) => (
          <GestureComponentItem
            key={comp.id}
            component={comp}
            gesture={gesture}
            onSelect={onComponentSelect}
            isSelected={selectedComponent?.type === comp.type}
            fingerPosition={fingerPosition}
            isDragging={isDragging && draggedComponentType === comp.type}
            onGestureStart={onGestureComponentStart}
          />
        ))}
      </div>
      
      {/* Enhanced Instructions */}
      <div className="mt-4 p-2 bg-gradient-to-b from-blue-50 to-purple-50 rounded text-xs border border-blue-200">
        <p className="font-semibold text-blue-700 mb-2">🎮 Gesture Controls:</p>
        <div className="space-y-2 text-blue-600">
          <div className="flex items-start gap-2">
            <span className="text-sm">✊</span>
            <div>
              <p className="font-semibold">Closed Fist</p>
              <p className="text-gray-600">Make fist over a library item to select it</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm">🖐️</span>
            <div>
              <p className="font-semibold">Open Palm</p>
              <p className="text-gray-600">Open your hand over canvas to drop selected component</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm">👍</span>
            <div>
              <p className="font-semibold">Confirm</p>
              <p className="text-gray-600">Thumbs up can also add currently selected component</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestureSidebar;
