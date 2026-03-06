import { useState, useCallback, useRef } from 'react';

/**
 * Hook for gesture-based drag and drop from component library to canvas
 * Enables picking components from the library using hand gestures
 * and dropping them onto the canvas with gesture confirmation
 */
const useLibraryGestureDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [hoveredDropZone, setHoveredDropZone] = useState(null);
  const trackingRef = useRef(false);

  /**
   * Start dragging a component from the library
   * Called when hand gesture hovers over and activates a library item
   */
  const startLibraryDrag = useCallback((component, startPosition) => {
    setIsDragging(true);
    setDraggedComponent(component);
    setDragStartPosition(startPosition);
    setCurrentPosition(startPosition);
    trackingRef.current = true;
  }, []);

  /**
   * Update current hand position while dragging
   */
  const updatePosition = useCallback((position) => {
    if (!trackingRef.current) return;
    setCurrentPosition(position);
  }, []);

  /**
   * Calculate drag delta (how far the hand has moved)
   */
  const getDragDelta = useCallback(() => {
    return {
      deltaX: currentPosition.x - dragStartPosition.x,
      deltaY: currentPosition.y - dragStartPosition.y,
      distance: Math.sqrt(
        Math.pow(currentPosition.x - dragStartPosition.x, 2) +
        Math.pow(currentPosition.y - dragStartPosition.y, 2)
      )
    };
  }, [currentPosition, dragStartPosition]);

  /**
   * Check if current position is over a drop zone
   */
  const checkDropZone = useCallback((dropZoneRect) => {
    if (!isDragging || !dropZoneRect) return false;
    
    return (
      currentPosition.x >= dropZoneRect.left &&
      currentPosition.x <= dropZoneRect.right &&
      currentPosition.y >= dropZoneRect.top &&
      currentPosition.y <= dropZoneRect.bottom
    );
  }, [isDragging, currentPosition]);

  /**
   * Complete the drag operation and return dropped component
   */
  const endDrag = useCallback(() => {
    const droppedComponent = draggedComponent;
    setIsDragging(false);
    setDraggedComponent(null);
    setHoveredDropZone(null);
    trackingRef.current = false;
    
    return droppedComponent;
  }, [draggedComponent]);

  /**
   * Cancel the drag operation
   */
  const cancelDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedComponent(null);
    setHoveredDropZone(null);
    trackingRef.current = false;
  }, []);

  /**
   * Set which drop zone is currently being hovered
   */
  const setCurrentDropZone = useCallback((zoneId) => {
    setHoveredDropZone(zoneId);
  }, []);

  return {
    // State
    isDragging,
    draggedComponent,
    currentPosition,
    dragStartPosition,
    hoveredDropZone,
    
    // Actions
    startLibraryDrag,
    updatePosition,
    endDrag,
    cancelDrag,
    setCurrentDropZone,
    
    // Calculations
    getDragDelta,
    checkDropZone
  };
};

export default useLibraryGestureDrag;
