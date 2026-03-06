import React from 'react';

/**
 * Virtual Mouse Cursor
 * Shows the hand position as a cursor on the screen
 * Provides visual feedback for gesture-based interactions
 */
const VirtualMouseCursor = ({
  position,
  isActive = false,
  isDragging = false,
  gesture = 'none',
  draggedComponentType = null,
  isItemSelected = false,
  selectedItemIndex = null
}) => {
  console.log('VirtualMouseCursor called with position:', position, 'isActive:', isActive);

  // Show cursor whenever we have a valid numeric position
  if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
    console.log('VirtualMouseCursor: No valid position, not rendering');
    return null;
  }

  console.log('VirtualMouseCursor rendering at:', position, 'gesture:', gesture, 'dragging:', isDragging, 'itemSelected:', isItemSelected);

  // Determine cursor color and size based on state
  let cursorClass = "fixed pointer-events-none z-60 rounded-full border-2 border-white shadow-lg";
  let cursorSize = "w-6 h-6";

  if (isItemSelected) {
    cursorClass += " bg-red-600"; // Red when item is selected
    cursorSize = "w-8 h-8";
  } else if (isDragging) {
    cursorClass += " bg-orange-500"; // Orange when dragging
    cursorSize = "w-7 h-7";
  } else {
    cursorClass += " bg-blue-500"; // Blue when pointing
  }

  return (
    <>
      {/* Test element - remove after confirming cursor works */}
      <div
        className="fixed top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded text-xs z-60"
        style={{ pointerEvents: 'none' }}
      >
        Cursor: {position ? `x:${Math.round(position.x)} y:${Math.round(position.y)}` : 'NO POSITION'}
      </div>

      {/* Main cursor circle */}
      <div
        className={`${cursorClass} ${cursorSize}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Inner dot */}
        <div className="absolute inset-1 bg-white rounded-full opacity-70" />
      </div>

      {/* Position debug info */}
      <div
        className="fixed pointer-events-none z-60 bg-black text-white px-2 py-1 rounded text-xs"
        style={{
          left: `${position.x + 30}px`,
          top: `${position.y - 30}px`,
        }}
      >
        x:{Math.round(position.x)} y:{Math.round(position.y)}
      </div>

      {/* Selection indicator */}
      {isItemSelected && selectedItemIndex !== null && (
        <div
          className="fixed pointer-events-none z-60 bg-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
          style={{
            left: `${position.x}px`,
            top: `${position.y - 40}px`,
            transform: 'translate(-50%, 0)',
          }}
        >
          Item {selectedItemIndex + 1} Selected
        </div>
      )}

      {/* Gesture indicator */}
      {gesture !== 'none' && (
        <div
          className="fixed pointer-events-none z-60 bg-purple-600 text-white px-2 py-1 rounded text-xs"
          style={{
            left: `${position.x}px`,
            top: `${position.y + 25}px`,
            transform: 'translate(-50%, 0)',
          }}
        >
          {gesture}
        </div>
      )}

      {/* Drag indicator */}
      {isDragging && draggedComponentType && (
        <div
          className="fixed pointer-events-none z-60 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
          style={{
            left: `${position.x + 20}px`,
            top: `${position.y}px`,
            transform: 'translate(0, -50%)',
          }}
        >
          {draggedComponentType}
        </div>
      )}
    </>
  );
};

export default VirtualMouseCursor;
