# Gesture Quick Reference Card

## 🖐️ Gesture Mappings

| Gesture | Icon | Action | How to Do It |
|---------|------|--------|-------------|
| **Two Fingers** | ✌️ | DRAG MODE | Index + Middle finger up, others down |
| **Closed Fist** | ✊ | DELETE | All fingers folded/closed |
| **One Finger** | ☝️ | POINT | Index finger up, all others down |
| **Thumbs Up** | 👍 | CONFIRM/ADD | Thumb extended up, fingers down |
| **Open Palm** | ✋ | SELECT | All fingers extended and spread |
| **Wave** | 👋 | SCROLL | Hand moving horizontally |

## 🎯 Workflow: Drag & Drop Components

```
1. Select Component (2 options)
   ├─ Click library button OR
   └─ Show Open Palm ✋ gesture

2. Add to Canvas
   └─ Make Thumbs Up 👍 gesture

3. Drag Component (2 options)
   ├─ Mouse drag OR
   └─ Show Two Fingers ✌️ + move hand

4. Drop Component
   └─ Close Fist ✊ gesture

5. Delete Component
   ├─ While dragging + show ✊ OR
   └─ Delete button on component
```

## ✨ Confidence Thresholds

- 🟢 **GREEN** (> 0.85): Very reliable, use for critical actions
- 🟡 **YELLOW** (0.70-0.85): Reliable, good for most actions  
- 🔴 **RED** (< 0.70): Not reliable, wait for higher confidence

## 🎮 Controls Summary

| Action | Method |
|--------|--------|
| Start Drag | ✌️ Two Fingers over component |
| Move Component | Move hand + follow finger path |
| Drop Component | ✊ Close Fist gesture |
| Delete Component | ✊ Closed Fist (while dragging) |
| Select Component | ✋ Open Palm or click button |
| Add Component | 👍 Thumbs Up gesture |
| Scroll Canvas | 👋 Wave hand left/right |

## 📊 Gesture Detection Pipeline

```
Webcam Video Frame
    ↓
MediaPipe (21 landmarks)
    ↓
Normalize by Hand Size
    ↓
Classify Gesture
  ├─ Check: Closed Fist?
  ├─ Check: Two Fingers?
  ├─ Check: One Finger?
  ├─ Check: Thumbs Up?
  ├─ Check: Open Palm?
  └─ Check: Wave?
    ↓
Get Confidence Score
    ↓
Trigger Action if Confident
    ↓
Update Component Position
```

## 🔧 Debugging Tips

**Open Browser Console**: F12 → Console tab

Look for logs like:
```
✅ Gesture: TWO_FINGERS (confidence: 0.95)
✅ Finger position: { screenX: 450, screenY: 120 }
✅ Dropped component 0 at zone 2
```

**Check Gesture Display Panel**:
- Shows current gesture name
- Shows confidence percentage
- Updates in real-time

**Camera Feed**:
- See hand detection overlay
- Green lines = connected landmarks
- Red dots = finger positions

## ⚠️ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Gesture not detected | Poor lighting | Improve room lighting |
| Wrong gesture detected | Finger position unclear | Make gesture more pronounced |
| Drag not starting | Gesture not confident enough | Show clearer two-finger pose |
| Component not dropping | Closed fist not detected | Make fist gesture tighter |
| Confidence too low | Too far from camera | Move hand 30-50cm from camera |

## 🎨 Visual Feedback

- **Blue border** on canvas = Drag mode active
- **Green ring** on component = Drop target selected
- **Green line** between components = Drop position indicator
- **Opacity change** = Component being dragged

## 💡 Pro Tips

1. **Lighting**: Face a light source, avoid backlighting
2. **Angle**: Keep palm facing camera at ~45° angle
3. **Speed**: Make gestures deliberately, not too fast
4. **Distance**: 30-50cm from webcam is optimal
5. **Stability**: Hold gestures steady for 0.5+ seconds
6. **Precision**: Two-finger drag works better for positioning

## 📱 Responsive Design

Works on:
- Desktop browsers (Chrome, Firefox, Edge)
- Laptop webcams
- External USB cameras
- Requires WebGL support

## 🚀 Performance

- Gesture detection: ~33ms per frame
- Drag updates: Real-time (60fps)
- No delay between gesture and action
