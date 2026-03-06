import React, { useCallback, useRef, useImperativeHandle, useState, useEffect } from 'react';
import GestureDraggableComponent from './GestureDraggableComponent';

/**
 * Gesture-aware canvas for building UI layouts
 * Supports gesture-based drag and drop with visual feedback
 * Also supports drag and drop from component library via gestures
 */
const GestureCanvas = React.forwardRef(({
  layout = [],
  gesture = { gesture: 'none', confidence: 0 },
  landmarks = null,
  onLayoutChange,
  isDragging = false,
  draggedComponentId = null,
  handPosition = { x: 0, y: 0 },
  fingerPosition = null,
  onGestureDragStart,
  onGestureDragEnd,
  isLibraryDragging = false,
  draggedLibraryComponent = null,
  onDropZoneUpdate = null
}, ref) => {
  const canvasRef = useRef(null);
  const [hoveredZoneIndex, setHoveredZoneIndex] = useState(null);
  const [isMouseOverCanvas, setIsMouseOverCanvas] = useState(false);

  useImperativeHandle(ref, () => canvasRef.current);

  // Notify parent of drop zone bounds for library drag
  useEffect(() => {
    if (canvasRef.current && onDropZoneUpdate) {
      const rect = canvasRef.current.getBoundingClientRect();
      onDropZoneUpdate({
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom
      });
    }
  }, [onDropZoneUpdate]);

  // Handle drop zone hover
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // Calculate which drop zone the cursor is over
    const itemHeight = rect.height / (layout.length || 1);
    const zone = Math.floor(y / itemHeight);
    
    setHoveredZoneIndex(zone >= 0 && zone < layout.length ? zone : null);
  }, [isDragging, layout.length]);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let draggedId = draggedComponentId;
    if (!isDragging || draggedId === null) {
      // Mouse drag fallback
      try {
        draggedId = parseInt(e.dataTransfer.getData('text/plain'));
      } catch (err) {
        draggedId = null;
      }
    }
    
    if (draggedId === null || !canvasRef.current) {
      setHoveredZoneIndex(null);
      if (onGestureDragEnd) onGestureDragEnd();
      return;
    }
    
    if (hoveredZoneIndex !== null && hoveredZoneIndex !== draggedId) {
      // Reorder components
      const newLayout = [...layout];
      const draggedItem = newLayout[draggedId];
      newLayout.splice(draggedId, 1);
      newLayout.splice(hoveredZoneIndex, 0, draggedItem);
      
      console.log(`Dropped component ${draggedId} at zone ${hoveredZoneIndex}`);
      if (onLayoutChange) {
        onLayoutChange(newLayout);
      }
    }
    
    setHoveredZoneIndex(null);
    if (onGestureDragEnd) {
      onGestureDragEnd();
    }
  }, [isDragging, draggedComponentId, hoveredZoneIndex, layout, onLayoutChange, onGestureDragEnd, canvasRef]);

  const handleRemoveComponent = useCallback((index) => {
    const newLayout = layout.filter((_, i) => i !== index);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  }, [layout, onLayoutChange]);

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMouseOverCanvas(true);
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const itemHeight = rect.height / (layout.length || 1);
        const zone = Math.floor(y / itemHeight);
        setHoveredZoneIndex(zone >= 0 && zone < layout.length ? zone : null);
      }}
      onDragLeave={() => {
        setHoveredZoneIndex(null);
        setIsMouseOverCanvas(false);
      }}
      onMouseEnter={() => setIsMouseOverCanvas(true)}
      onMouseLeave={() => setIsMouseOverCanvas(false)}
      className={`
        w-full h-full min-h-[500px] rounded border-4 transition-all
        ${isLibraryDragging && isMouseOverCanvas 
          ? 'border-red-500 bg-red-50 shadow-lg' 
          : isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : isLibraryDragging
          ? 'border-red-300 border-dashed bg-white'
          : 'border-gray-300 bg-white'
        }
        p-4 overflow-auto
      `}
    >
      {/* Gesture Status Bar */}
      {gesture.gesture !== 'none' && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold">
              🖐️ Gesture: {gesture.gesture.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className="text-xs text-gray-600 ml-2">
              Confidence: {(gesture.confidence * 100).toFixed(0)}%
            </span>
          </div>
          {gesture.gesture === 'two_fingers' && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              ✓ Drag Mode Active
            </span>
          )}
        </div>
      )}

      {/* Canvas Title */}
      <h3 className="text-lg font-bold mb-4 text-gray-700">
        Canvas {layout.length > 0 && `(${layout.length} components)`}
      </h3>

      {/* Main Canvas Area */}
      <div className="space-y-3">
        {layout.length === 0 ? (
          <div className="text-center py-16">
            {isLibraryDragging && isMouseOverCanvas ? (
              <div className="text-red-600">
                <p className="text-3xl mb-2 animate-bounce">📥</p>
                <p className="text-2xl font-bold mb-1">{draggedLibraryComponent?.name}</p>
                <p className="text-lg">Drop to add component</p>
                <p className="text-sm text-red-500 mt-2">Release gesture to place</p>
              </div>
            ) : isLibraryDragging ? (
              <div className="text-orange-600">
                <p className="text-2xl mb-2">📦</p>
                <p className="text-lg font-semibold">{draggedLibraryComponent?.name}</p>
                <p className="text-sm">Move hand here to drop</p>
              </div>
            ) : (
              <div className="text-gray-400">
                <p className="text-2xl mb-2">🎨</p>
                <p className="text-lg font-semibold">Drop components here</p>
                <p className="text-sm mt-2">Drag from the component library using hand gestures</p>
                <div className="mt-4 text-xs space-y-1">
                  <p>👆 <strong>Point</strong> at a component to grab it</p>
                  <p>✌️ <strong>Two Fingers</strong> up to drag</p>
                  <p>Move hand to canvas and <strong>close fist</strong> to drop</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Dragging from library indicator */}
            {isLibraryDragging && isMouseOverCanvas && (
              <div className="p-4 bg-red-100 border-2 border-red-500 rounded mb-4 text-center">
                <p className="text-red-700 font-bold text-lg">📥 Drop {draggedLibraryComponent?.name} Here</p>
              </div>
            )}

            {/* Rendered Components */}
            {layout.map((component, index) => (
              <div
                key={index}
                onMouseEnter={() => isDragging && setHoveredZoneIndex(index)}
              >
                <GestureDraggableComponent
                  component={component}
                  index={index}
                  isDragging={isDragging && draggedComponentId === index}
                  isDropTarget={hoveredZoneIndex === index}
                  handPosition={handPosition}
                  onGestureDragStart={onGestureDragStart}
                  onRemove={handleRemoveComponent}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-gray-600">
        <p className="font-semibold mb-1">Gesture Controls:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>✊ <strong>Closed Fist:</strong> Fist on item selects it (library or canvas)</li>
          <li>🖐️ <strong>Open Palm:</strong> Drop selected component on canvas</li>
          <li>👍 <strong>Thumbs Up:</strong> Confirm / Add component (alternate)</li>
          <li>✌️ <strong>Two Fingers:</strong> Legacy drag mode for canvas</li>
          <li>👋 <strong>Wave:</strong> Scroll canvas</li>
        </ul>
      </div>
    </div>
  );
});

export default GestureCanvas;
