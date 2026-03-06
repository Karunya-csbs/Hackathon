import React, { useRef, useEffect } from 'react';

/**
 * Gesture-draggable UI component on the canvas
 * Supports both mouse drag and gesture-based drag
 */
const GestureDraggableComponent = ({
  component,
  index,
  isDragging,
  isDropTarget,
  handPosition,
  onGestureDragStart,
  onRemove,
  onUpdate
}) => {
  const ref = useRef(null);
  const [localPosition, setLocalPosition] = React.useState({ top: 0, left: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  // Handle gesture drag visualization
  useEffect(() => {
    if (!isDragging || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate offset from component center
    const offsetX = handPosition.x - (rect.left + centerX);
    const offsetY = handPosition.y - (rect.top + centerY);

    setLocalPosition({
      offsetX,
      offsetY,
      scale: 1.05
    });
  }, [isDragging, handPosition]);

  const componentTypeColor = {
    button: 'bg-blue-100 border-blue-300',
    card: 'bg-green-100 border-green-300',
    navbar: 'bg-purple-100 border-purple-300',
    input: 'bg-yellow-100 border-yellow-300',
    grid: 'bg-indigo-100 border-indigo-300',
    form: 'bg-pink-100 border-pink-300',
    modal: 'bg-orange-100 border-orange-300',
    image: 'bg-red-100 border-red-300'
  };

  const colorClass = componentTypeColor[component?.type] || 'bg-gray-100 border-gray-300';

  return (
    <div
      ref={ref}
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', index);
        if (onGestureDragStart) {
          onGestureDragStart(index, {
            x: e.clientX,
            y: e.clientY
          });
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => {
        if (onGestureDragStart) {
          onGestureDragStart(index, {
            x: e.clientX,
            y: e.clientY
          });
        }
      }}
      className={`
        relative p-4 rounded border-2 cursor-move transition-all
        ${colorClass}
        ${isDragging ? 'opacity-50 scale-105 shadow-lg' : 'hover:shadow-md'}
        ${isDropTarget ? 'ring-4 ring-green-500' : ''}
        ${isHovered ? 'scale-102' : ''}
      `}
      style={
        isDragging
          ? {
              transform: `translate(${localPosition.offsetX}px, ${localPosition.offsetY}px) scale(${localPosition.scale || 1})`,
              zIndex: 50
            }
          : {}
      }
    >
      {/* Component Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold capitalize text-gray-700">
          {component?.type || 'Component'}
        </span>
        <button
          onClick={() => onRemove && onRemove(index)}
          className="text-red-500 hover:text-red-700 text-lg leading-none"
          title="Delete component (Closed Fist gesture)"
        >
          ✕
        </button>
      </div>

      {/* Component Preview */}
      <div className="text-sm text-gray-600 mb-2">
        {component?.type === 'button' && (
          <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs disabled opacity-60">
            Click Me
          </button>
        )}
        {component?.type === 'card' && (
          <div className="bg-white p-2 rounded border text-xs">
            <p className="font-semibold">Card Title</p>
            <p className="text-gray-500">Card content</p>
          </div>
        )}
        {component?.type === 'input' && (
          <input
            type="text"
            placeholder="Input field"
            className="w-full px-2 py-1 border rounded text-xs"
            disabled
          />
        )}
        {component?.type === 'navbar' && (
          <nav className="bg-gray-800 text-white px-2 py-1 rounded text-xs flex gap-2">
            <span>Logo</span>
            <span>Link 1</span>
            <span>Link 2</span>
          </nav>
        )}
        {component?.type === 'grid' && (
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-gray-300 h-8 rounded"></div>
            <div className="bg-gray-300 h-8 rounded"></div>
            <div className="bg-gray-300 h-8 rounded"></div>
            <div className="bg-gray-300 h-8 rounded"></div>
          </div>
        )}
        {component?.type === 'form' && (
          <div className="space-y-1">
            <input type="text" placeholder="Field 1" className="w-full px-2 py-1 border rounded text-xs" disabled />
            <input type="text" placeholder="Field 2" className="w-full px-2 py-1 border rounded text-xs" disabled />
          </div>
        )}
        {component?.type === 'image' && (
          <div className="bg-gray-300 h-12 rounded flex items-center justify-center text-xs">
            [Image]
          </div>
        )}
        {component?.type === 'modal' && (
          <div className="border rounded bg-white p-2 text-xs">
            <p className="font-semibold mb-1">Modal Title</p>
            <p className="text-gray-600 text-xs mb-2">Modal content goes here</p>
            <div className="flex gap-1">
              <button className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs disabled opacity-60">OK</button>
              <button className="flex-1 bg-gray-300 px-2 py-1 rounded text-xs disabled opacity-60">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Gesture Info */}
      {isDragging && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          🖐️ Dragging...
        </div>
      )}
    </div>
  );
};

export default GestureDraggableComponent;
