# Virtual Mouse - Code Examples & Usage Patterns

## Complete Usage Example

### 1. Basic Hand Detection Flow

```javascript
// From WebcamFeed.jsx - Hand detection via MediaPipe
const handsRef = useRef(null);

useEffect(() => {
  handsRef.current = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });
  
  handsRef.current.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.5
  });

  handsRef.current.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const video = webcamRef.current.video;
      
      // Convert landmarks to screen coordinates
      const formattedLandmarks = landmarks.map(p => [
        p.x * video.videoWidth,
        p.y * video.videoHeight
      ]);
      
      // Calculate finger position (index tip point)
      const indexTip = formattedLandmarks[8];
      const screenX = videoRect.left + (videoRect.width - indexTip[0]);
      const screenY = videoRect.top + indexTip[1];
      
      onFingerPosition({ x: screenX, y: screenY });
    }
  });
}, []);
```

### 2. Component Hover Detection

```javascript
// From GestureComponentItem.jsx - Detect finger hover
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
  
  if (isHovering && onGestureStart) {
    onGestureStart(component, {
      x: fingerPosition.x,
      y: fingerPosition.y
    });
  }
}, [fingerPosition]);
```

### 3. Starting Library Drag

```javascript
// From Builder.jsx - Initiate drag from library
const handleGestureComponentStart = useCallback((component, startPosition) => {
  console.log('Starting gesture drag from library:', component, startPosition);
  startLibraryDrag(component, startPosition);
}, [startLibraryDrag]);

// Usage in GestureSidebar
<GestureComponentItem
  component={comp}
  onGestureStart={handleGestureComponentStart}
  fingerPosition={fingerPosition}
  isDragging={isLibraryDragging}
/>
```

### 4. Handling Drag Operations

```javascript
// From useLibraryGestureDrag.js - Complete hook
const startLibraryDrag = useCallback((component, startPosition) => {
  setIsDragging(true);
  setDraggedComponent(component);
  setDragStartPosition(startPosition);
  setCurrentPosition(startPosition);
  trackingRef.current = true;
}, []);

const updatePosition = useCallback((position) => {
  if (!trackingRef.current) return;
  setCurrentPosition(position);
}, []);

const checkDropZone = useCallback((dropZoneRect) => {
  if (!isDragging || !dropZoneRect) return false;
  
  return (
    currentPosition.x >= dropZoneRect.left &&
    currentPosition.x <= dropZoneRect.right &&
    currentPosition.y >= dropZoneRect.top &&
    currentPosition.y <= dropZoneRect.bottom
  );
}, [isDragging, currentPosition]);

const endDrag = useCallback(() => {
  const droppedComponent = draggedComponent;
  setIsDragging(false);
  setDraggedComponent(null);
  trackingRef.current = false;
  
  return droppedComponent;
}, [draggedComponent]);
```

### 5. Gesture Action Handling

```javascript
// From Builder.jsx - Handle gesture-triggered actions
useEffect(() => {
  const action = getGestureAction(gesture.gesture);
  
  switch(action.action) {
    case 'ENABLE_DRAG':
      if (gesture.confidence > 0.7 && fingerPosition && canvasRef.current) {
        // If dragging from library, complete the drop
        if (isLibraryDragging && dropZoneRect) {
          if (checkLibraryDropZone(dropZoneRect)) {
            // Add component to canvas
            const newComponent = draggedLibraryComponent;
            const newLayout = LayoutBuilder.addComponent(layout, newComponent);
            setLayout(newLayout);
            endLibraryDrag();
            setSelectedComponent(null);
            console.log('Component dropped on canvas:', newComponent);
          }
        }
      }
      break;
      
    case 'DELETE_COMPONENT':
      if (gesture.confidence > 0.8 && draggedComponentId !== null) {
        handleRemoveComponent(draggedComponentId);
        endGestureDrag();
      }
      break;
      
    default:
      break;
  }
}, [gesture, fingerPosition, isLibraryDragging, dropZoneRect]);
```

### 6. Virtual Cursor Display

```javascript
// From VirtualMouseCursor.jsx - Visual feedback
<div
  className={`
    fixed pointer-events-none z-50 rounded-full transition-all
    ${isDragging 
      ? 'w-8 h-8 bg-red-500 ring-4 ring-red-300 shadow-lg' 
      : 'w-6 h-6 bg-blue-500 ring-2 ring-blue-300 shadow-md'
    }
  `}
  style={{
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    opacity: isActive ? 0.8 : 0.6,
  }}
>
  {/* Inner dot */}
  <div className="absolute inset-1 bg-white rounded-full opacity-50" />
</div>

{/* Drag indicator with component type */}
{isDragging && draggedComponentType && (
  <div
    className="fixed pointer-events-none z-50 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
    style={{
      left: `${position.x + 20}px`,
      top: `${position.y - 20}px`,
    }}
  >
    {draggedComponentType}
  </div>
)}
```

### 7. Canvas Drop Zone Feedback

```javascript
// From GestureCanvas.jsx - Visual feedback for drop zones
<div
  className={`
    w-full h-full min-h-96 rounded border-4 transition-all
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
  {layout.length === 0 ? (
    <div className="text-center py-16">
      {isLibraryDragging && isMouseOverCanvas ? (
        <div className="text-red-600">
          <p className="text-3xl mb-2 animate-bounce">📥</p>
          <p className="text-2xl font-bold mb-1">{draggedLibraryComponent?.name}</p>
          <p className="text-lg">Drop to add component</p>
        </div>
      ) : (
        <div className="text-gray-400">
          <p className="text-2xl mb-2">🎨</p>
          <p className="text-lg font-semibold">Drop components here</p>
        </div>
      )}
    </div>
  ) : null}
</div>
```

## Real-World Scenario Walkthrough

### Scenario: Add Button and Card to Canvas

**Step 1: Point at Button**
```javascript
// User raises index finger over Button component
fingerPosition = { x: 320, y: 450 }  // Over Button

// GestureComponentItem detects hover
const isHovering = (
  320 >= 300 && 320 <= 350 &&  // x range
  450 >= 440 && 450 <= 480     // y range
) // true

// Component highlights yellow
// onGestureStart callback ready
```

**Step 2: Two-Finger Grab**
```javascript
// User raises two fingers
gesture = { gesture: 'two_fingers', confidence: 0.85 }

// Builder receives action
const action = getGestureAction('two_fingers')  // ENABLE_DRAG

// However, since fingerPosition over component
// and we detect isLibraryDragging would be about to start
// GestureComponentItem calls onGestureStart
startLibraryDrag(
  { type: 'button', name: 'Button', icon: '🔘' },
  { x: 320, y: 450 }
)

// States updated
isLibraryDragging = true
draggedLibraryComponent = { type: 'button', ... }
```

**Step 3: Drag to Canvas**
```javascript
// User moves hand toward canvas
// Hand position updates continuously
fingerPosition = { x: 450, y: 300 }  // Moving right and up

// useLibraryGestureDrag updates
updatePosition({ x: 450, y: 300 })

// VirtualMouseCursor follows
<VirtualMouseCursor 
  position={{ x: 450, y: 300 }}
  isDragging={true}
  draggedComponentType="Button"
/>

// Canvas detects hand position
const canvasRect = canvasRef.getBoundingClientRect()
// rect = { left: 400, top: 200, right: 900, bottom: 700 }

isMouseOverCanvas = (450 >= 400 && 450 <= 900 && 300 >= 200)  // true

// Canvas border becomes red
className={`
  border-4 
  ${isLibraryDragging && isMouseOverCanvas 
    ? 'border-red-500 bg-red-50' 
    : 'border-gray-300'
  }
`}
```

**Step 4: Close Fist to Drop**
```javascript
// User closes fist
gesture = { gesture: 'closed_fist', confidence: 0.92 }

// Builder processes ENABLE_DRAG action (last gesture was two_fingers)
// Checks: isLibraryDragging && dropZoneRect
if (isLibraryDragging && dropZoneRect && checkLibraryDropZone(dropZoneRect)) {
  // Drop is valid
  const newComponent = draggedLibraryComponent  // Button
  const newLayout = LayoutBuilder.addComponent(layout, newComponent)
  setLayout(newLayout)  // Canvas now has Button
  
  // Reset state
  endLibraryDrag()
  isLibraryDragging = false
  draggedLibraryComponent = null
  
  // VirtualCursor returns to blue
}

// Result: Canvas now shows Button component
layout = [{ type: 'button', ... }]
```

**Step 5: Add Card Component**
```javascript
// User immediately points at Card
fingerPosition = { x: 320, y: 520 }  // Over Card now

// Card detects hover and highlights
isGestureHovered = true
// Card shows yellow border

// User raises two fingers again
gesture = { gesture: 'two_fingers', confidence: 0.88 }

// Card's onGestureStart fires
startLibraryDrag(
  { type: 'card', name: 'Card', icon: '📇' },
  { x: 320, y: 520 }
)

// Repeat drag to canvas steps...
// User moves to canvas, closes fist

// Canvas now has two components
layout = [
  { type: 'button', ... },
  { type: 'card', ... }
]
```

## Integration with Existing Code

### How It Connects to LayoutBuilder

```javascript
// Building layout when component is dropped
import LayoutBuilder from '../builder/LayoutBuilder';

const newComponent = draggedLibraryComponent; // { type: 'button' }
const newLayout = LayoutBuilder.addComponent(layout, newComponent);
setLayout(newLayout);

// LayoutBuilder.js - Assuming similar structure
export const addComponent = (layout, component) => {
  return [...layout, component];
};

export const removeComponent = (layout, index) => {
  return layout.filter((_, i) => i !== index);
};
```

### How It Connects to Gesture System

```javascript
// GestureMappings.js - Existing gesture mapping
const gestureMappings = {
  'two_fingers': {
    action: 'ENABLE_DRAG',
    description: 'Enable drag mode for components'
  },
  'closed_fist': {
    action: 'DELETE_COMPONENT',
    description: 'Delete selected component'
  }
};

// Builder uses these for routing
const action = getGestureAction(gesture.gesture);
// Returns: { action: 'ENABLE_DRAG', description: '...' }
```

## Advanced Patterns

### Pattern 1: Conditional Drop Validation

```javascript
// Only allow drop on specific canvas regions
const isValidDropZone = (position, canvasRect) => {
  const MARGIN = 20;
  const validArea = {
    left: canvasRect.left + MARGIN,
    right: canvasRect.right - MARGIN,
    top: canvasRect.top + MARGIN,
    bottom: canvasRect.bottom - MARGIN
  };
  
  return (
    position.x >= validArea.left &&
    position.x <= validArea.right &&
    position.y >= validArea.top &&
    position.y <= validArea.bottom
  );
};
```

### Pattern 2: Multiple Rapid Additions

```javascript
// Enable chaining of rapid component additions
const handleQuickMultiAdd = async (components) => {
  for (const component of components) {
    startLibraryDrag(component, fingerPosition);
    await new Promise(resolve => setTimeout(resolve, 100));
    endLibraryDrag();
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};
```

### Pattern 3: Gesture Templates

```javascript
// Pre-defined gesture sequences for common tasks
const gestureTemplates = {
  addButton: [
    { gesture: 'one_finger', target: 'Button' },
    { gesture: 'two_fingers', duration: 500 },
    { gesture: 'closed_fist', target: 'canvas' }
  ],
  quickLayout: [
    { gesture: 'one_finger', target: 'Navbar' },
    { gesture: 'two_fingers', target: 'canvas' },
    { gesture: 'open_palm', target: 'reset' }
  ]
};
```

### Pattern 4: Visual Feedback Enhancement

```javascript
// Add animations on drop
const addComponentWithAnimation = (component) => {
  const newLayout = LayoutBuilder.addComponent(layout, component);
  setLayout(newLayout);
  
  // Trigger animation
  setTimeout(() => {
    const lastIndex = newLayout.length - 1;
    setComponentAnimation(lastIndex, 'fadeInScale');
  }, 50);
};
```

## Performance Optimization Tips

### Optimization 1: Debounce Position Updates

```javascript
// Prevent excessive re-renders during drag
const debouncedUpdatePosition = useCallback(
  debounce((position) => {
    updateLibraryDragPosition(position);
  }, 16), // ~60fps
  [updateLibraryDragPosition]
);

useEffect(() => {
  if (isLibraryDragging && fingerPosition) {
    debouncedUpdatePosition(fingerPosition);
  }
}, [fingerPosition, isLibraryDragging]);
```

### Optimization 2: Memoize Components

```javascript
// Prevent unnecessary re-renders
const MemoizedComponentItem = React.memo(GestureComponentItem, (prev, next) => {
  return (
    prev.component === next.component &&
    prev.isSelected === next.isSelected &&
    prev.isDragging === next.isDragging &&
    prev.fingerPosition?.x === next.fingerPosition?.x &&
    prev.fingerPosition?.y === next.fingerPosition?.y
  );
});
```

## Error Handling Examples

### Example 1: Drop Outside Canvas

```javascript
const endLibraryDrag = useCallback(() => {
  if (!isDragging) return;
  
  const isValidDrop = dropZoneRect && checkLibraryDropZone(dropZoneRect);
  
  if (!isValidDrop) {
    console.warn('Drop outside valid zone, cancelling drag');
    // Visual feedback
    showNotification('Please drop over canvas area');
  }
  
  setIsDragging(false);
  setDraggedComponent(null);
}, [isDragging, dropZoneRect]);
```

### Example 2: Low Confidence Gesture

```javascript
if (gesture.confidence < 0.7) {
  console.debug('Gesture confidence too low:', gesture.confidence);
  // Don't initiate drag
  return;
}
```

---

These examples demonstrate the complete flow of the virtual mouse system and show how all components work together to enable seamless gesture-based component dragging.
