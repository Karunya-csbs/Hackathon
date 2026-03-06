import React, { useState, useEffect, useCallback, useRef } from 'react';
import LeftPanel from '../components/Layout/LeftPanel';
import CenterPanel from '../components/Layout/CenterPanel';
import RightPanel from '../components/Layout/RightPanel';
import BottomPanel from '../components/Layout/BottomPanel';
import WebcamFeed from '../components/GesturePanel/WebcamFeed';
import GestureDisplay from '../components/GesturePanel/GestureDisplay';
import ConfidenceMeter from '../components/GesturePanel/ConfidenceMeter';
import VirtualMouseCursor from '../components/GesturePanel/VirtualMouseCursor';
import GestureSidebar, { componentList } from '../components/ComponentLibrary/GestureSidebar';
import GestureCanvas from '../components/PageBuilder/GestureCanvas';
import CodeViewer from '../components/CodePanel/CodeViewer';
import CopyButton from '../components/CodePanel/CopyButton';
import PreviewRenderer from '../builder/PreviewRenderer';
import ComponentGenerator from '../builder/ComponentGenerator';
import LayoutBuilder from '../builder/LayoutBuilder';
import useCodeGeneration from '../hooks/useCodeGeneration';
import useGestureDrag from '../hooks/useGestureDrag';
import useLibraryGestureDrag from '../hooks/useLibraryGestureDrag';
import { getGestureAction } from '../gestures/GestureMappings';

const Builder = () => {
  const [layout, setLayout] = useState([]);
  const [gesture, setGesture] = useState({ gesture: 'none', confidence: 0 });
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const [fingerPosition, setFingerPosition] = useState(null);
  const [dropZoneRect, setDropZoneRect] = useState(null);
  const [selectedItemForDrag, setSelectedItemForDrag] = useState(null);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const canvasRef = useRef(null);
  const { code, generateCode } = useCodeGeneration(layout);
  const {
    isDragging,
    draggedComponentId,
    handPosition,
    startGestureDrag,
    updateHandPosition,
    endGestureDrag,
    getDeltaPosition
  } = useGestureDrag();


  // Library gesture drag
  const {
    isDragging: isLibraryDragging,
    draggedComponent: draggedLibraryComponent,
    currentPosition: libraryDragPosition,
    startLibraryDrag,
    updatePosition: updateLibraryDragPosition,
    endDrag: endLibraryDrag,
    checkDropZone: checkLibraryDropZone
  } = useLibraryGestureDrag();

  // when dragging a library item, keep the hook's position synced with finger
  useEffect(() => {
    if (isLibraryDragging && fingerPosition) {
      updateLibraryDragPosition(fingerPosition);
    }
  }, [fingerPosition, isLibraryDragging, updateLibraryDragPosition]);

  // Track cursor movement for selected item repositioning
  useEffect(() => {
    if (isItemSelected && selectedItemForDrag !== null && fingerPosition) {
      // Move the selected item to follow the cursor
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const relativeY = fingerPosition.y - canvasRect.top;
        const itemHeight = canvasRect.height / (layout.length || 1);
        const newIndex = Math.max(0, Math.min(layout.length - 1, Math.floor(relativeY / itemHeight)));
        
        if (newIndex !== selectedItemForDrag) {
          console.log('Moving item from', selectedItemForDrag, 'to', newIndex);
          // Reorder the layout array
          const newLayout = [...layout];
          const [movedItem] = newLayout.splice(selectedItemForDrag, 1);
          newLayout.splice(newIndex, 0, movedItem);
          setLayout(newLayout);
          setSelectedItemForDrag(newIndex);
        }
      }
    }
  }, [fingerPosition, isItemSelected, selectedItemForDrag, layout]);

  // Handle gesture actions
  useEffect(() => {
    const action = getGestureAction(gesture.gesture);
    
    switch(action.action) {
      case 'POINT_AND_FOLLOW':
        // Index finger pointing - cursor follows finger movement
        // This is handled automatically by fingerPosition updates
        break;
      
      case 'SELECT_AND_DRAG':
        if (gesture.confidence > 0.7 && fingerPosition && !isItemSelected) {
          // first try to pick a library component (closed fist over sidebar)
          if (!selectedComponent) {
            // use document.elementFromPoint to find hovered library item
            const elem = document.elementFromPoint(fingerPosition.x, fingerPosition.y);
            if (elem) {
              const itemDiv = elem.closest('[data-gesture-component]');
              if (itemDiv) {
                const type = itemDiv.getAttribute('data-comp-type');
                if (type) {
                  const comp = componentList.find(c => c.type === type);
                  if (comp) {
                    setSelectedComponent(comp);
                    console.log('Selected library component with fist:', comp);
                    // start drag visuals
                    startLibraryDrag(comp, fingerPosition);
                    break; // stop further processing
                  }
                }
              }
            }
          }

          // otherwise, select an existing canvas item for repositioning
          const canvasRect = canvasRef.current?.getBoundingClientRect();
          if (canvasRect && 
              fingerPosition.x >= canvasRect.left && fingerPosition.x <= canvasRect.right &&
              fingerPosition.y >= canvasRect.top && fingerPosition.y <= canvasRect.bottom) {
            const relativeY = fingerPosition.y - canvasRect.top;
            const itemHeight = canvasRect.height / (layout.length || 1);
            const componentIndex = Math.floor(relativeY / itemHeight);
            if (componentIndex >= 0 && componentIndex < layout.length) {
              console.log('Selecting component for drag:', componentIndex);
              setSelectedItemForDrag(componentIndex);
              setIsItemSelected(true);
            }
          }
        }
        break;
      
      case 'DROP_ITEM':
        // lower the confidence requirement so open-palm is more responsive
        if (gesture.confidence > 0.6) {
          // finish repositioning existing canvas item
          if (isItemSelected && selectedItemForDrag !== null) {
            console.log('Dropping item at position:', fingerPosition);
            setIsItemSelected(false);
            setSelectedItemForDrag(null);
          }

          // add previously selected library component if any
          if (selectedComponent) {
            // allow drop if over canvas or if library drag was active
            let readyToDrop = false;
            const canvasRect = canvasRef.current?.getBoundingClientRect();
            if (!canvasRect || !fingerPosition) {
              // if we don't know canvas bounds, assume drop allowed
              readyToDrop = true;
            } else {
              readyToDrop = (
                fingerPosition.x >= canvasRect.left && fingerPosition.x <= canvasRect.right &&
                fingerPosition.y >= canvasRect.top && fingerPosition.y <= canvasRect.bottom
              );
            }

            if (readyToDrop) {
              const newLayout = LayoutBuilder.addComponent(layout, {
                type: selectedComponent.type
              });
              setLayout(newLayout);
              console.log('Dropped library component via open palm:', selectedComponent);
            }

            // clear selection/drag state no matter what
            setSelectedComponent(null);
            endLibraryDrag();
          }
        }
        break;
      
      case 'ENABLE_DRAG':
        if (gesture.confidence > 0.7 && landmarks && fingerPosition && canvasRef.current) {
          // If dragging from library, complete the drop on canvas
          if (isLibraryDragging && dropZoneRect) {
            if (checkLibraryDropZone(dropZoneRect)) {
              const newComponent = draggedLibraryComponent;
              const newLayout = LayoutBuilder.addComponent(layout, newComponent);
              setLayout(newLayout);
              endLibraryDrag();
              setSelectedComponent(null);
              console.log('Component dropped on canvas via gesture:', newComponent);
            }
          } else if (!isLibraryDragging) {
            // Handle existing canvas component drag
            const canvasRect = canvasRef.current.getBoundingClientRect();
            if (fingerPosition.x >= canvasRect.left && fingerPosition.x <= canvasRect.right &&
                fingerPosition.y >= canvasRect.top && fingerPosition.y <= canvasRect.bottom) {
              const relativeY = fingerPosition.y - canvasRect.top;
              const itemHeight = canvasRect.height / (layout.length || 1);
              const componentIndex = Math.floor(relativeY / itemHeight);
              if (componentIndex >= 0 && componentIndex < layout.length) {
                console.log('Selecting component for drag:', componentIndex);
                startGestureDrag(componentIndex, { x: fingerPosition.x, y: fingerPosition.y });
              }
            }
          }
        }
        break;
      
      case 'CONFIRM_ADD':
        if (gesture.confidence > 0.8) {
          handleAddComponent();
        }
        break;
      
      default:
        break;
    }

    // End drag if not in drag mode
    if (action.action !== 'ENABLE_DRAG' && action.action !== 'SELECT_AND_DRAG' && isDragging) {
      handleGestureDrop();
    }
    
    // Reset selection if gesture changes
    if (action.action !== 'SELECT_AND_DRAG' && action.action !== 'DROP_ITEM' && isItemSelected) {
      setIsItemSelected(false);
      setSelectedItemForDrag(null);
    }
  }, [gesture, landmarks, fingerPosition, layout.length, isDragging, endGestureDrag, isLibraryDragging, dropZoneRect, draggedLibraryComponent, isItemSelected, selectedItemForDrag]);

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
  };

  const handleGestureComponentStart = useCallback((component, startPosition) => {
    console.log('Starting gesture drag from library:', component, startPosition);
    startLibraryDrag(component, startPosition);
  }, [startLibraryDrag]);

  const handleAddComponent = () => {
    if (selectedComponent) {
      const newLayout = LayoutBuilder.addComponent(layout, {
        type: selectedComponent.type
      });
      setLayout(newLayout);
      setSelectedComponent(null);
    }
  };

  const handleRemoveComponent = (index) => {
    const newLayout = LayoutBuilder.removeComponent(layout, index);
    setLayout(newLayout);
  };

  const handleGestureDrop = useCallback(() => {
    if (!isDragging || draggedComponentId === null || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    if (handPosition.x >= canvasRect.left && handPosition.x <= canvasRect.right &&
        handPosition.y >= canvasRect.top && handPosition.y <= canvasRect.bottom) {
      const relativeY = handPosition.y - canvasRect.top;
      const itemHeight = canvasRect.height / (layout.length || 1);
      const zone = Math.floor(relativeY / itemHeight);
      if (zone >= 0 && zone < layout.length && zone !== draggedComponentId) {
        // Reorder components
        const newLayout = [...layout];
        const draggedItem = newLayout[draggedComponentId];
        newLayout.splice(draggedComponentId, 1);
        newLayout.splice(zone, 0, draggedItem);
        setLayout(newLayout);
      }
    }
    endGestureDrag();
  }, [isDragging, draggedComponentId, handPosition, layout, canvasRef, endGestureDrag]);

  const handleClearLayout = () => {
    setLayout([]);
  };

  const handleGestureDragStart = useCallback((componentIndex, startPoint) => {
    startGestureDrag(componentIndex, startPoint);
  }, [startGestureDrag]);

  const handleGestureDragEnd = useCallback(() => {
    endGestureDrag();
  }, [endGestureDrag]);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <>
      <div className="flex h-full gap-2 p-2 bg-gray-100">
      {/* LEFT PANEL - Gesture Control */}
      <LeftPanel>
        <div className="space-y-4">
          <h2 className="font-bold text-lg">🖐️ Gesture Control</h2>
          <WebcamFeed 
            onFrameCapture={(landmarksData) => {
              setLandmarks(landmarksData);
              // always keep hand position updated whenever dragging (fist, palm, one-finger)
              if (isDragging) {
                updateHandPosition(landmarksData);
              }
            }} 
            isRunning={true}
            setGesture={setGesture}
            onFingerPosition={setFingerPosition}
          />
          <GestureDisplay
            detectedGesture={gesture.gesture}
            confidence={gesture.confidence}
            fingerPosition={fingerPosition}
          />
          <ConfidenceMeter confidence={gesture.confidence} />
          
          {/* Gesture Status */}
          {(isDragging || isLibraryDragging || isItemSelected) && (
            <div className={`p-3 rounded text-sm border ${
              isItemSelected 
                ? 'bg-red-100 border-red-300' 
                : isLibraryDragging 
                  ? 'bg-orange-100 border-orange-300' 
                  : 'bg-blue-100 border-blue-300'
            }`}>
              <p className={`font-semibold ${
                isItemSelected 
                  ? 'text-red-700' 
                  : isLibraryDragging 
                    ? 'text-orange-700' 
                    : 'text-blue-700'
              }`}>
                {isItemSelected 
                  ? '✊ Item Selected - Move fist to reposition' 
                  : isLibraryDragging 
                    ? '📦 Library Drag Mode' 
                    : '👆 Drag Mode'} Active
              </p>
              <p className={`text-xs mt-1 ${
                isItemSelected 
                  ? 'text-red-600' 
                  : isLibraryDragging 
                    ? 'text-orange-600' 
                    : 'text-blue-600'
              }`}>
                {isItemSelected 
                  ? `Item ${selectedItemForDrag + 1} selected - Open palm to drop`
                  : isLibraryDragging 
                    ? `Dragging ${draggedLibraryComponent?.name} - Move hand to canvas`
                    : 'Point with index finger to drag components'
                }
              </p>
            </div>
          )}
          
          {/* Gesture Instructions */}
          {!isDragging && !isLibraryDragging && !isItemSelected && (
            <div className="p-3 rounded text-sm bg-green-100 border border-green-300">
              <p className="font-semibold text-green-700">🎯 Gesture Instructions</p>
              <ul className="text-xs mt-1 text-green-600 space-y-1">
                <li>• Ensure good lighting and clear hand visibility</li>
                <li>• Point with index finger to move cursor anywhere on page</li>
                <li>• Keep finger in center of video for precise control</li>
                <li>• Move finger to video edges to access whole page</li>
                <li>• Make fist over item to select it</li>
                <li>• Move fist to reposition selected item</li>
                <li>• Open palm to drop item at cursor</li>
              </ul>
            </div>
          )}
          
          <button
            onClick={handleAddComponent}
            disabled={!selectedComponent}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            👍 Add Component
          </button>
        </div>
      </LeftPanel>

      {/* CENTER PANEL - Component Preview & Canvas */}
      <CenterPanel>
        <div className="space-y-4 h-full flex flex-col">
          <h2 className="font-bold text-lg">🎨 Canvas Preview</h2>
          <div className="flex-1 overflow-auto bg-white rounded border p-2 min-h-[500px]">
            <GestureCanvas
              ref={canvasRef}
              layout={layout}
              gesture={gesture}
              landmarks={landmarks}
              isDragging={isDragging}
              draggedComponentId={draggedComponentId}
              handPosition={handPosition}
              fingerPosition={fingerPosition}
              onLayoutChange={handleLayoutChange}
              onGestureDragStart={handleGestureDragStart}
              onGestureDragEnd={handleGestureDragEnd}
              isLibraryDragging={isLibraryDragging}
              draggedLibraryComponent={draggedLibraryComponent}
              onDropZoneUpdate={setDropZoneRect}
            />
          </div>
        </div>
      </CenterPanel>

      {/* RIGHT PANEL - Code & Components */}
      <RightPanel>
        <div className="space-y-4 h-full flex flex-col">
          <h2 className="font-bold text-lg">📦 Components Library</h2>
          <div className="flex-1 overflow-auto">
            <GestureSidebar 
              gesture={gesture.gesture}
              onComponentSelect={handleComponentSelect} 
              selectedComponent={selectedComponent}
              fingerPosition={fingerPosition}
              isDragging={isLibraryDragging}
              draggedComponentType={draggedLibraryComponent?.type}
              onGestureComponentStart={handleGestureComponentStart}
            />
          </div>
        </div>
      </RightPanel>

      {/* BOTTOM PANEL - Code & Canvas */}
      <BottomPanel>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">📝 Generated React Code</h3>
            <div className="space-x-2">
              <button
                onClick={() => generateCode()}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Generate
              </button>
              <CopyButton code={code} />
              <button
                onClick={handleClearLayout}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear Canvas
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-2">Click “Generate” to update code; layout will not change. (saving disabled)</p>
          <CodeViewer code={code} />
        </div>
      </BottomPanel>
      </div>

      {/* Virtual Mouse Cursor Overlay */}
      <VirtualMouseCursor
        position={fingerPosition}
        isActive={true}
        isDragging={isDragging || isLibraryDragging || isItemSelected}
        gesture={gesture.gesture}
        draggedComponentType={
          isLibraryDragging 
            ? draggedLibraryComponent?.type 
            : (isDragging ? 'component' : (isItemSelected ? 'selected_item' : null))
        }
        isItemSelected={isItemSelected}
        selectedItemIndex={selectedItemForDrag}
      />
    </>
  );
};

export default Builder;