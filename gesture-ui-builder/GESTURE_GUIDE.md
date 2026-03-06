# Gesture Control Guide

## Supported Gestures

### 1. **Two Fingers** (✌️) - DRAG MODE
- **Detection**: Index and middle fingers extended, other fingers closed
- **Action**: `ENABLE_DRAG` - Activates drag mode for components
- **How to Use**:
  1. Hold up two fingers (index and middle) towards the webcam
  2. Position over a component on the canvas
  3. The component will start dragging with your hand movement
  4. Move to the new position and close fist to drop

### 2. **Closed Fist** (✊) - DELETE COMPONENT
- **Detection**: All fingers closed/folded
- **Action**: `DELETE_COMPONENT` - Removes the selected component
- **How to Use**:
  1. Make a closed fist gesture
  2. If a component is being dragged, it will be deleted
  3. Confidence required: > 0.8

### 3. **One Finger** (☝️) - POINTING
- **Detection**: Only index finger extended, all others closed
- **Action**: `POINT` - Used for precise selection
- **How to Use**:
  1. Extend only your index finger
  2. Point at components on the canvas
  3. The system will highlight the component under your finger

### 4. **Thumbs Up** (👍) - CONFIRM/ADD
- **Detection**: Thumb extended up, all other fingers closed
- **Action**: `CONFIRM_ADD` - Confirms adding a selected component
- **How to Use**:
  1. Select a component from the library (click or gesture)
  2. Make a thumbs-up gesture
  3. The component will be added to the canvas
  4. Confidence required: > 0.8

### 5. **Open Palm** (✋) - SELECT COMPONENT
- **Detection**: All fingers extended and spread
- **Action**: `SELECT_COMPONENT` - Selects a component from the library
- **How to Use**:
  1. Show an open palm to the webcam
  2. This activates selection mode
  3. Use with UI buttons to select components

### 6. **Wave** (👋) - SCROLL CANVAS
- **Detection**: Hand moving horizontally, fingers separated
- **Action**: `SCROLL_CANVAS` - Scrolls the canvas
- **How to Use**:
  1. Move your hand left to right or right to left
  2. The canvas will scroll in the direction of movement
  3. Useful for long lists of components

## Gesture Detection Workflow

```
1. Webcam captures your hand
   ↓
2. MediaPipe Hands detects 21 landmarks
   ↓
3. GestureClassifier analyzes finger positions
   ↓
4. Gesture is identified with confidence score
   ↓
5. Action is triggered based on GestureMappings
   ↓
6. UI updates and component is dragged/deleted/added
```

## Confidence Thresholds

- **Two Fingers**: 0.90 (high confidence for reliable drag)
- **Closed Fist**: 0.88 (high confidence for deletion)
- **One Finger**: 0.85 (good confidence for pointing)
- **Thumbs Up**: 0.85 (good confidence for confirmation)
- **Open Palm**: 0.87 (high confidence for selection)
- **Wave**: 0.75 (medium confidence for scrolling)

## Tips for Better Gesture Recognition

1. **Distance from Webcam**: Keep your hand 30-50cm from the camera
2. **Lighting**: Ensure good lighting, avoid shadows on your hand
3. **Angle**: Position your hand with palm facing the camera
4. **Speed**: Make gestures slowly and deliberately
5. **Hand Size**: The system normalizes for different hand sizes
6. **Background**: Plain backgrounds work best for detection

## Troubleshooting Gestures

### Gesture Not Detected
- Check webcam is working and accessible
- Ensure good lighting
- Move hand closer to camera
- Make the gesture more pronounced
- Check confidence meter (should be > 0.7)

### Wrong Gesture Detected
- Ensure all fingers are in correct position
- Make gestures more slowly
- Verify hand position relative to camera
- Check the console logs for debugging info

### Drag Not Working
- Ensure "Two Fingers" gesture shows high confidence (> 0.9)
- Position component under your pointing finger
- Move hand smoothly after starting drag
- Try making the two-fingers gesture more distinct

### Component Not Dropping
- Move to target drop zone
- Ensure drop zone highlights in green
- Close hand (fist) to trigger drop
- Try alternative: close and open fist gesture

## Debug Mode

Check browser console (F12) for:
- Gesture classification logs
- Confidence scores
- Landmark detection data
- Finger position coordinates
- Drag/drop event logs

Example console output:
```
Gesture classified: two_fingers confidence: 0.92
Finger position: { screenX: 450, screenY: 120 }
Dropped component 0 at zone 2
```

## Keyboard Shortcuts (Backup)

- **D**: Delete selected component
- **S**: Select mode
- **+**: Add component
- **C**: Clear canvas
- **Esc**: Cancel drag
