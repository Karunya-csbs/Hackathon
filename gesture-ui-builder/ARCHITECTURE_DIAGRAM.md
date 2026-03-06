# Gesture System Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GESTURE UI BUILDER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              LEFT PANEL: GESTURE CONTROL               │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  WebcamFeed.jsx                                  │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ • Video Input                                    │  │   │
│  │  │ • MediaPipe Hands Detection                      │  │   │
│  │  │ • Landmark Extraction (21 points)               │  │   │
│  │  │ • Coordinate Transformation                      │  │   │
│  │  │ • Finger Position Calculation                    │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │           ↓                                               │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  GestureClassifier.js                            │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ • Hand Bounding Box Calculation                  │  │   │
│  │  │ • Finger State Detection (open/closed)          │  │   │
│  │  │ • Gesture Classification                         │  │   │
│  │  │ • Confidence Scoring                             │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │           ↓                                               │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  GestureMappings.js                              │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ • Gesture → Action Mapping                       │  │   │
│  │  │ • Action Description                             │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │           ↓                                               │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  GestureDisplay & ConfidenceMeter                │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ • Show Detected Gesture                          │  │   │
│  │  │ • Display Confidence %                           │  │   │
│  │  │ • Real-time Updates                              │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           CENTER PANEL: CANVAS & PREVIEW               │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  Builder.jsx (Main Orchestrator)                 │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ • State Management:                              │  │   │
│  │  │   - layout (components array)                    │  │   │
│  │  │   - gesture (detected gesture + confidence)      │  │   │
│  │  │   - landmarks (hand joint positions)             │  │   │
│  │  │   - isDragging (drag state)                      │  │   │
│  │  │ • useGestureDrag hook:                           │  │   │
│  │  │   - draggedComponentId                           │  │   │
│  │  │   - handPosition (real-time tracking)            │  │   │
│  │  │ • Gesture Action Handlers:                       │  │   │
│  │  │   - ENABLE_DRAG → startGestureDrag()            │  │   │
│  │  │   - DELETE_COMPONENT → handleRemoveComponent()  │  │   │
│  │  │   - CONFIRM_ADD → handleAddComponent()          │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │           ↓                                               │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  GestureCanvas.jsx (Canvas Component)            │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ • Renders component list                         │  │   │
│  │  │ • Handles drop zones                             │  │   │
│  │  │ • Drop event management                          │  │   │
│  │  │ • Visual feedback during drag                    │  │   │
│  │  │ • Gesture status display                         │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │           ↓                                               │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  GestureDraggableComponent.jsx (Component Item)  │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ • Draggable container                            │  │   │
│  │  │ • Visual feedback (color, scale, opacity)        │  │   │
│  │  │ • Component preview                              │  │   │
│  │  │ • Delete button                                  │  │   │
│  │  │ • Transform via hand position                    │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         RIGHT PANEL: COMPONENT LIBRARY                  │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  Sidebar.jsx                                     │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ • Component list (Button, Card, Input, etc.)    │  │   │
│  │  │ • Component selection                            │  │   │
│  │  │ • Component type icons                           │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         BOTTOM PANEL: CODE GENERATION                   │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  CodeViewer.jsx                                  │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ • Generated React code display                   │  │   │
│  │  │ • Code syntax highlighting                       │  │   │
│  │  │ • Copy button                                    │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Complete Journey

```
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: CAPTURE WEBCAM FRAME                                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   Webcam Feed                                                             │
│        ↓                                                                   │
│   Split into frames (100ms intervals)                                     │
│        ↓                                                                   │
│   Send to MediaPipe via: handsRef.current.send({ image: video })         │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: DETECT HAND LANDMARKS                                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   MediaPipe Hands:                                                        │
│   • Analyzes image                                                        │
│   • Detects hand position                                                 │
│   • Extracts 21 landmarks (wrist + finger joints)                        │
│   • Returns: {                                                            │
│       multiHandLandmarks: [[                                              │
│         { x: 0.5, y: 0.6, z: 0.1 },  ← Landmark 0 (wrist)              │
│         { x: 0.45, y: 0.55, z: 0.1 }, ← Landmark 1 (thumb metacarpal)  │
│         ...                                                               │
│         { x: 0.52, y: 0.5, z: 0.1 }   ← Landmark 20 (pinky tip)        │
│       ]]                                                                   │
│     }                                                                      │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: TRANSFORM TO SCREEN COORDINATES                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   Normalized Landmarks (0-1):                                             │
│     { x: 0.5, y: 0.6, z: 0.1 }                                           │
│           ↓ (multiply by video dimensions)                                │
│   Pixel Coordinates:                                                      │
│     x_pixel = 0.5 * videoWidth (e.g., 0.5 * 640 = 320)                 │
│     y_pixel = 0.6 * videoHeight (e.g., 0.6 * 480 = 288)                │
│           ↓ (account for webcam mirror flip)                              │
│   Screen Coordinates:                                                     │
│     screenX = videoRect.left + (videoRect.width - x_pixel)              │
│     screenY = videoRect.top + y_pixel                                    │
│                                                                            │
│   Store in: formattedLandmarks = [[320, 288], [305, 280], ...]         │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 4: CLASSIFY GESTURE                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   Input: formattedLandmarks (21 points with pixel coordinates)            │
│           ↓                                                                │
│   Calculate Hand Bounding Box:                                            │
│     • Find min/max X and Y across all landmarks                           │
│     • Calculate: width, height, handScale = √(w × h)                    │
│           ↓                                                                │
│   Finger State Analysis:                                                  │
│     For each finger (thumb, index, middle, ring, pinky):                 │
│     • Get tip position (e.g., index = landmark 8)                        │
│     • Get joint positions (PIP = landmark 6, MCP = landmark 5)           │
│     • Calculate: d1 = distance(tip, PIP)                                 │
│     • Calculate: d2 = distance(PIP, MCP)                                 │
│     • Ratio = d1 / d2                                                     │
│     • If ratio > 1.2 → Finger is OPEN                                   │
│     • Else → Finger is CLOSED                                             │
│           ↓                                                                │
│   Gesture Priority Checks (in order):                                     │
│     1. Closed Fist?                                                       │
│        • Sum of fingertip distances < handScale * 0.5                    │
│        • confidence: 0.88                                                 │
│           ↓                                                                │
│     2. Two Fingers?                                                       │
│        • Index UP, Middle UP, Ring DOWN, Pinky DOWN, Thumb DOWN          │
│        • confidence: 0.90                                                 │
│           ↓                                                                │
│     3. One Finger?                                                        │
│        • Index UP, Middle DOWN, Ring DOWN, Pinky DOWN                    │
│        • confidence: 0.85                                                 │
│           ↓                                                                │
│     4. Thumbs Up?                                                         │
│        • Thumb UP, all others DOWN                                        │
│        • confidence: 0.85                                                 │
│           ↓                                                                │
│     5. Open Palm?                                                         │
│        • All 5 fingers UP                                                 │
│        • confidence: 0.87                                                 │
│           ↓                                                                │
│     6. Wave?                                                              │
│        • Horizontal spread > handScale * 0.4                             │
│        • confidence: 0.75                                                 │
│           ↓                                                                │
│   Return: { gesture: 'two_fingers', confidence: 0.92 }                   │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 5: MAP TO ACTION                                                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   Gesture: 'two_fingers'                                                  │
│       ↓                                                                    │
│   GestureMappings['two_fingers'] = {                                      │
│     action: 'ENABLE_DRAG',                                                │
│     description: 'Enable drag mode for components'                       │
│   }                                                                        │
│       ↓                                                                    │
│   Send to Builder.jsx:                                                    │
│     action.action === 'ENABLE_DRAG' → startGestureDrag(id, point)       │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 6: UPDATE UI STATE                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   Builder State Updates:                                                  │
│   • isDragging = true                                                     │
│   • draggedComponentId = 2 (component index)                             │
│   • handPosition = { x: 450, y: 280 } (real-time)                        │
│           ↓                                                                │
│   Pass props to GestureCanvas:                                            │
│   • isDragging={true}                                                     │
│   • draggedComponentId={2}                                                │
│   • handPosition={{ x: 450, y: 280 }}                                     │
│           ↓                                                                │
│   GestureCanvas Updates:                                                  │
│   • Render with blue border (drag mode)                                   │
│   • Show green drop zone indicator                                        │
│   • Highlight target component                                            │
│           ↓                                                                │
│   GestureDraggableComponent Updates:                                      │
│   • Apply CSS transform based on handPosition                            │
│   • Show opacity change                                                   │
│   • Display shadow effect                                                 │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 7: TRACK HAND MOVEMENT                                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   While isDragging = true:                                                │
│                                                                            │
│   Next Frame → Webcam capture                                             │
│       ↓                                                                    │
│   MediaPipe detection                                                     │
│       ↓                                                                    │
│   Coordinate transformation                                               │
│       ↓                                                                    │
│   updateHandPosition(landmarks)                                           │
│       ↓                                                                    │
│   Calculate palm center from landmarks:                                   │
│     • Average positions of [0, 5, 9, 13, 17] (key palm points)         │
│     • x = sum(x_coords) / 5                                             │
│     • y = sum(y_coords) / 5                                             │
│       ↓                                                                    │
│   Update handPosition state → triggers re-render                          │
│       ↓                                                                    │
│   Component follows hand movement on screen                               │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 8: DETECT DROP                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   User shows Closed Fist gesture                                          │
│       ↓                                                                    │
│   GestureClassifier detects: { gesture: 'closed_fist', confidence: 0.92 }│
│       ↓                                                                    │
│   Builder.jsx gesture effect:                                             │
│     case 'DELETE_COMPONENT':                                              │
│       if (confidence > 0.8):                                              │
│         handleGestureDrop()                                               │
│       ↓                                                                    │
│   handleGestureDrop():                                                    │
│     • Calculate relative position in canvas                               │
│     • Determine drop zone index                                           │
│     • Reorder components array                                            │
│     • Update layout state                                                 │
│     • Call endGestureDrag()                                               │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 9: FINAL STATE UPDATE                                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   After Drop:                                                             │
│                                                                            │
│   Before: [Button, Card, Input]  (at indices 0, 1, 2)                   │
│   Drag Button (index 0) to position 2                                     │
│   After: [Card, Input, Button]   (reordered)                             │
│       ↓                                                                    │
│   State Updates:                                                          │
│   • isDragging = false                                                    │
│   • draggedComponentId = null                                             │
│   • layout = [Card, Input, Button]                                       │
│       ↓                                                                    │
│   Propagate to Canvas:                                                    │
│   • GestureCanvas re-renders with new layout                             │
│   • GestureDraggableComponent updates for each item                      │
│   • UI shows new component order                                          │
│       ↓                                                                    │
│   Generate Code:                                                          │
│   • useCodeGeneration hook detects layout change                         │
│   • Generates new React JSX code                                          │
│   • CodeViewer displays updated code                                      │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

## State Management Flow

```
Builder Component State:
├── layout: Component[]
│   └─ Stores all components and their order
├── gesture: { gesture: string, confidence: number }
│   └─ Current detected gesture
├── landmarks: Array[21]
│   └─ Hand joint positions
├── selectedComponent: Component | null
│   └─ Currently selected component
├── fingerPosition: { x, y } | null
│   └─ Index finger tip position
└── From useGestureDrag Hook:
    ├── isDragging: boolean
    ├── draggedComponentId: number | null
    ├── handPosition: { x, y }
    ├── dropTarget: string | null
    ├── ... update methods ...
    └── ... state queries ...
```

## Component Hierarchy

```
Builder (Main)
├── LeftPanel
│   ├── WebcamFeed
│   │   ├── Webcam
│   │   └── Canvas (for drawing)
│   ├── GestureDisplay
│   └── ConfidenceMeter
├── CenterPanel
│   └── GestureCanvas
│       ├── Gesture Status Bar
│       ├── Canvas Title
│       └── GestureDraggableComponent[] (mapped)
│           ├── Component Header
│           ├── Component Preview
│           └── Delete Button
├── RightPanel
│   └── Sidebar
│       ├── ComponentItem[] (Button, Card, etc.)
│       └── Selection State
└── BottomPanel
    └── CodeViewer
        ├── CodePanel
        └── CopyButton
```

## Gesture Recognition Process (Detailed)

```
Is Hand Visible?
    ├─ NO → Gesture: 'none', confidence: 0
    └─ YES ↓

Calculate Hand Size:
    └─ handScale = √(width × height)

Check Finger States:
    ├─ Thumb: open/closed
    ├─ Index: open/closed
    ├─ Middle: open/closed
    ├─ Ring: open/closed
    └─ Pinky: open/closed

Check Gesture Priority:
    │
    ├─ Fingers Distance < handScale * 0.5?
    │  └─ YES → CLOSED_FIST (0.88)
    │
    ├─ Index UP + Middle UP + Others DOWN?
    │  └─ YES → TWO_FINGERS (0.90) ← HIGHEST PRIORITY
    │
    ├─ Index UP + Middle DOWN + Others DOWN?
    │  └─ YES → ONE_FINGER (0.85)
    │
    ├─ Thumb UP + All DOWN?
    │  └─ YES → THUMBS_UP (0.85)
    │
    ├─ All Fingers UP?
    │  └─ YES → OPEN_PALM (0.87)
    │
    ├─ Horizontal Spread > handScale * 0.4?
    │  └─ YES → WAVE (0.75)
    │
    └─ NO matching gestures?
       └─ NONE (0)

Output: { gesture: string, confidence: 0-1 }
```
