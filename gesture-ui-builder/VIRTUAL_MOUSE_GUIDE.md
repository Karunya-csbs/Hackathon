# Virtual Mouse Gesture-Based Drag & Drop - User Guide

## Overview
The gesture-ui-builder now includes an advanced **Virtual Mouse** system that uses hand gesture recognition to enable seamless drag-and-drop of UI components from the component library to the canvas preview.

## Key Features

### 🖐️ Virtual Mouse Cursor
- **Real-time hand position tracking** - A visual cursor follows your index finger
- **Color-coded feedback** - Blue when hovering, Red when dragging
- **Gesture indicator** - Shows the current gesture being detected
- **Component label** - Displays the component type being dragged

### 📦 Library Gesture Dragging
Drag components directly from the component library using hand gestures:

#### Step-by-Step Process

1. **Point to Select a Component**
   - Raise your index finger
   - Move toward a component in the library
   - The component will highlight in yellow when your finger hovers over it
   - Text shows "👆 Point to grab"

2. **Activate Two-Finger Drag Mode**
   - Hold TWO fingers up (index and middle)
   - This initiates the drag mode
   - The component border turns red and becomes active
   - Virtual cursor changes to a larger red circle

3. **Drag to Canvas**
   - While maintaining two fingers up, move your hand toward the canvas
   - The virtual cursor will follow your hand
   - The component type displays near the cursor
   - Canvas changes color to indicate drop zone:
     - **Yellow/Orange border** - Library drag detected
     - **Red border** - Component over canvas (ready to drop)

4. **Complete the Drop**
   - Move your hand over the canvas drop zone
   - When the canvas border turns **RED**, it's ready
   - Close your fist or release the two-finger gesture
   - Component is added to the canvas
   - Return to open hand to restart

## Gesture Mappings

| Gesture | Zone | Action | Result |
|---------|------|--------|--------|
| **One Finger** | Library | Point & Hover | Highlights component to grab |
| **Two Fingers** | Library | Hold up | Initiates drag mode |
| **Two Fingers** (Moving) | Library→Canvas | Drag hand | Move component to canvas |
| **Close Fist** | Canvas | Make fist | Release/drop component |
| **Thumbs Up** | Library | Gesture | Add selected component |
| **Open Palm** | Any | Hold | Neutral/reset state |

## Visual Feedback System

### Component Library
- **Gray border** - Unselected component
- **Green border** - Selected for adding
- **Yellow border + Glow** - Finger hovering (ready to grab)
- **Red border + Glow** - Currently being dragged

### Canvas Area
- **Gray dashed border** - Ready to receive drops
- **Blue border** - Existing component drag mode active
- **Red border + Glow** - Library component hovering (ready to drop)
- **Blue glow** - Drop zone detected

### Virtual Cursor Indicators
- **Blue circle** - Normal hover state
- **Red circle** - Active drag state
- **Component label** - Shows what's being dragged
- **Gesture label** - Shows detected gesture type

## Tips for Best Results

### Hand Positioning
1. Keep your hand steady and within webcam view
2. Make sure lighting is adequate
3. Gesture clarity improves accuracy
4. Avoid quick jerky movements

### Gesture Timing
- Hold gestures for 0.5+ seconds for better detection
- Two-finger drag should be smooth and continuous
- Transitions between gestures should be clear

### Drop Accuracy
- Hover over the canvas until the border turns red
- Release the gesture when you see the red border
- If drop doesn't register, try again with a clearer gesture

## Troubleshooting

### Cursor not following hand
- Check webcam is connected and enabled
- Ensure adequate lighting
- Try moving hand more slowly
- Check confidence meter in Gesture Control panel

### Components not dragging
- Make sure gesture confidence is above 70%
- Hold the two-finger gesture more clearly
- Ensure component is highlighted in yellow first
- Check canvas is visible on screen

### Drop not registering
- Make sure canvas has red border when releasing
- Close your fist completely for clear detection
- Try again with slower, deliberate movements
- Check gesture confidence meter

## Advanced Usage

### Multiple Additions
1. Drag and drop a component
2. Immediately point to select a new component
3. Hold two fingers and drag again
4. Repeat for rapid prototyping

### Reordering Components
1. On-canvas components can still be dragged with two-finger gesture
2. They work the same as library-sourced components
3. Drop zones show clear positioning

### Hybrid Interaction
- Use mouse clicks for precise selection
- Use gestures for hands-free component addition
- Mix and match as needed

## Component Types Available

- **Button** - Interactive button components
- **Card** - Content container cards  
- **Navbar** - Navigation bar sections
- **Input** - Text input fields
- **Grid** - Layout grid systems
- **Form** - Form container components
- **Modal** - Dialog/modal overlays
- **Image** - Image display containers

## Performance Notes

- Hand tracking runs at ~100ms intervals
- Gesture classification confidence updates in real-time
- Virtual cursor updates at frame rate
- Canvas responsiveness optimized for smooth interaction
- All visual feedback is non-blocking

## Future Enhancements

Potential improvements to the system:
- Multi-hand support for simultaneous editing
- Voice commands for gesture confirmation
- Customizable gesture mappings
- Gesture recording and playback
- Gesture-based component customization
