import { useState, useCallback } from 'react';

const useDragDrop = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZoneActive, setDropZoneActive] = useState(false);

  const handleDragStart = useCallback((item) => {
    setDraggedItem(item);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDropZoneActive(false);
  }, []);

  const handleDragOver = useCallback(() => {
    setDropZoneActive(true);
  }, []);

  const handleDrop = useCallback((onDrop) => {
    return (item) => {
      if (onDrop) {
        onDrop(item);
      }
      setDraggedItem(null);
      setDropZoneActive(false);
    };
  }, []);

  return {
    draggedItem,
    dropZoneActive,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop
  };
};

export default useDragDrop;