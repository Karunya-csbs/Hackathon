import React, { useRef, useEffect } from 'react';

/**
 * Gesture Drop Zone
 * Visual area on the canvas where components can be dropped via hand gestures
 * Provides visual feedback when hand hovers over it
 */
const GestureDropZone = ({ 
  isDragTarget = false, 
  isHovering = false,
  canvasRef,
  onPositionUpdate
}) => {
  const dropZoneRef = useRef(null);

  useEffect(() => {
    if (dropZoneRef.current && onPositionUpdate) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      onPositionUpdate({
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        centerX: (rect.left + rect.right) / 2,
        centerY: (rect.top + rect.bottom) / 2
      });
    }
  }, [onPositionUpdate]);

  return (
    <div
      ref={dropZoneRef}
      className={`
        w-full min-h-[500px] bg-white border-4 rounded transition-all
        ${isDragTarget 
          ? 'border-red-500 bg-red-50 shadow-lg' 
          : isHovering
          ? 'border-blue-500 border-dashed bg-blue-50 shadow-md'
          : 'border-gray-300 border-dashed'
        }
      `}
      style={{
        backgroundColor: isDragTarget ? 'rgba(239, 68, 68, 0.05)' : isHovering ? 'rgba(59, 130, 246, 0.05)' : 'white'
      }}
    >
      <div className="h-full flex flex-col items-center justify-center">
        {isDragTarget && (
          <div className="text-center">
            <p className="text-2xl mb-2 animate-bounce">📥</p>
            <p className="text-red-600 font-semibold">Drop component here</p>
            <p className="text-sm text-red-500">Release gesture to place</p>
          </div>
        )}
        {isHovering && !isDragTarget && (
          <div className="text-center">
            <p className="text-2xl mb-2">👆</p>
            <p className="text-blue-600 font-semibold">Drop zone detected</p>
          </div>
        )}
        {!isDragTarget && !isHovering && (
          <div className="text-center">
            <p className="text-gray-400 text-lg">Drop components here</p>
            <p className="text-gray-400 text-sm">Drag from library using hand gestures</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestureDropZone;
