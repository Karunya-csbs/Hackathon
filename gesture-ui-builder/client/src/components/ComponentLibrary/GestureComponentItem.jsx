import React, { useRef, useEffect } from 'react';

/**
 * Gesture-aware Component Library Item
 * Supports both traditional drag-and-drop and gesture-based interaction
 * Can be activated by hand gestures from the webcam feed
 */
const GestureComponentItem = ({ 
  component, 
  onSelect, 
  isSelected,
  fingerPosition,
  gesture,
  isDragging,
  onGestureStart,
  isFingerhovered = false
}) => {
  const itemRef = useRef(null);
  const [isGestureHovered, setIsGestureHovered] = React.useState(false);

  // Check if finger is hovering over this component item
  useEffect(() => {
    if (!fingerPosition || !itemRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const isHovering = (
      fingerPosition.x >= rect.left &&
      fingerPosition.x <= rect.right &&
      fingerPosition.y >= rect.top &&
      fingerPosition.y <= rect.bottom
    );

    setIsGestureHovered(isHovering);
  }, [fingerPosition]);

  // if gesture is closed fist while hovering, select this component
  useEffect(() => {
    if (isGestureHovered && gesture === 'closed_fist' && !isSelected) {
      onSelect && onSelect(component);
      // also start a library drag so the cursor shows movement
      if (onGestureStart && fingerPosition) {
        onGestureStart(component, {
          x: fingerPosition.x,
          y: fingerPosition.y
        });
      }
    }
  }, [isGestureHovered, gesture, isSelected, component, onSelect, onGestureStart, fingerPosition]);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({ type: component.type }));
  };

  const handleGestureActivate = () => {
    if (isGestureHovered && onGestureStart) {
      onGestureStart(component, {
        x: fingerPosition.x,
        y: fingerPosition.y
      });
    }
  };

  React.useEffect(() => {
    if (isGestureHovered && fingerPosition) {
      handleGestureActivate();
    }
  }, [isGestureHovered, fingerPosition]);

  return (
    <div
      ref={itemRef}
      data-gesture-component
      data-comp-type={component.type}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect && onSelect(component)}
      className={`
        p-3 border-2 rounded cursor-grab hover:shadow-md transition-all
        ${isDragging && isSelected ? 'ring-4 ring-red-500 border-red-300 bg-red-50 shadow-lg' : ''}
        ${isGestureHovered && !isDragging ? 'ring-4 ring-yellow-400 border-yellow-300 bg-yellow-50 shadow-lg scale-110' : ''}
        ${isSelected && !isDragging && !isGestureHovered
          ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-300' 
          : !isSelected && !isDragging && !isGestureHovered
          ? 'border-gray-200 bg-white hover:bg-gray-50'
          : ''
        }
      `}
    >
      <div className="flex items-center gap-2">
        {component.icon && <span className="text-lg">{component.icon}</span>}
        <div>
          <div className={`text-sm font-semibold ${
            isDragging && isSelected ? 'text-red-700' :
            isGestureHovered ? 'text-yellow-700' :
            isSelected ? 'text-green-700' : 'text-gray-700'
          }`}>
            {component.name}
          </div>
          <div className="text-xs text-gray-500">
            {isGestureHovered ? '👆 Point to grab' : 'Click or drag'}
          </div>
        </div>
        {isSelected && !isGestureHovered && (
          <span className="ml-auto text-green-600 font-bold text-lg">✓</span>
        )}
        {isGestureHovered && (
          <span className="ml-auto text-yellow-500 font-bold text-lg animate-pulse">👆</span>
        )}
      </div>
    </div>
  );
};

export default GestureComponentItem;
