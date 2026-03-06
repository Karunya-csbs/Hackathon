import { useState, useCallback, useRef } from 'react';

/**
 * Hook for gesture-based drag and drop operations
 * Uses hand position tracking to enable dragging when "two_fingers" gesture is detected
 */
const useGestureDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponentId, setDraggedComponentId] = useState(null);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState(null);
  const trackingRef = useRef(false);

  /**
   * Start dragging a component based on hand gesture
   * Called when "two_fingers" gesture is detected
   */
  const startGestureDrag = useCallback((componentId, centerPoint = null) => {
    setIsDragging(true);
    setDraggedComponentId(componentId);
    trackingRef.current = true;
    
    if (centerPoint) {
      setDragStart(centerPoint);
      setHandPosition(centerPoint);
    }
  }, []);

  /**
   * Update hand position during drag (called continuously with landmarks)
   */
  const updateHandPosition = useCallback((landmarks) => {
    if (!trackingRef.current || !landmarks) return;

    try {
      // Get palm center point (average of key landmarks)
      const palmPoints = [0, 5, 9, 13, 17]; // wrist, thumb, index, middle, ring
      let x = 0;
      let y = 0;

      palmPoints.forEach(idx => {
        if (landmarks[idx]) {
          x += landmarks[idx][0];
          y += landmarks[idx][1];
        }
      });

      x = x / palmPoints.length;
      y = y / palmPoints.length;

      setHandPosition({ x, y });
    } catch (error) {
      console.error('Error updating hand position:', error);
    }
  }, []);

  /**
   * Calculate delta movement from drag start
   */
  const getDeltaPosition = useCallback(() => {
    return {
      deltaX: handPosition.x - dragStart.x,
      deltaY: handPosition.y - dragStart.y,
      x: handPosition.x,
      y: handPosition.y
    };
  }, [handPosition, dragStart]);

  /**
   * End gesture drag
   */
  const endGestureDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedComponentId(null);
    setDropTarget(null);
    trackingRef.current = false;
    setDragStart({ x: 0, y: 0 });
  }, []);

  /**
   * Set current drop target
   */
  const setCurrentDropTarget = useCallback((targetId) => {
    setDropTarget(targetId);
  }, []);

  /**
   * Clear drop target
   */
  const clearDropTarget = useCallback(() => {
    setDropTarget(null);
  }, []);

  return {
    // State
    isDragging,
    draggedComponentId,
    handPosition,
    dropTarget,
    
    // Methods
    startGestureDrag,
    updateHandPosition,
    endGestureDrag,
    getDeltaPosition,
    setCurrentDropTarget,
    clearDropTarget
  };
};

export default useGestureDrag;
