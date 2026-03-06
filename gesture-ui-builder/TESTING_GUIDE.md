# Testing & Verification Guide

## 🧪 Test Suite for Gesture Detection & Drag-Drop

### Environment Setup
```bash
# Terminal 1: Start backend server
cd server
npm install
npm start

# Terminal 2: Start frontend dev server
cd client
npm install
npm run dev

# Open browser to http://localhost:5173
# Press F12 for Developer Tools → Console tab
```

## Test Cases

### Test 1: Gesture Detection Accuracy ✅

**Goal**: Verify all gestures are correctly detected

**Steps**:
1. Open app and navigate to Builder page
2. Open browser console (F12)
3. Position hand 30-50cm from webcam
4. Make each gesture slowly:

```
Gesture: TWO_FINGERS
Expected Console Output:
  ✅ Gesture classified: two_fingers confidence: 0.85+
  ✅ Finger position: { screenX: xxx, screenY: xxx }

Gesture: CLOSED_FIST
Expected Console Output:
  ✅ Gesture classified: closed_fist confidence: 0.85+

Gesture: ONE_FINGER
Expected Console Output:
  ✅ Gesture classified: one_finger confidence: 0.80+

Gesture: THUMBS_UP
Expected Console Output:
  ✅ Gesture classified: thumbs_up confidence: 0.85+

Gesture: OPEN_PALM
Expected Console Output:
  ✅ Gesture classified: open_palm confidence: 0.85+

Gesture: WAVE
Expected Console Output:
  ✅ Gesture classified: wave confidence: 0.75+
```

**Pass Criteria**: All gestures detected with confidence > 0.70

---

### Test 2: Coordinate Transformation ✅

**Goal**: Verify finger position coordinates are correct

**Steps**:
1. Open browser console
2. Move hand around to different positions
3. Check console for "Finger position" logs
4. Verify coordinates change smoothly

**Expected**:
- Coordinates should range within screen bounds
- Movement should be smooth, not jumpy
- X coordinates should mirror webcam (right hand appears on right)

**Pass Criteria**: Smooth, continuous coordinate tracking

---

### Test 3: Two-Finger Drag & Drop ✅

**Goal**: Verify drag and drop works with two-finger gesture

**Setup**:
1. Add at least 2 components to canvas (use + buttons)
2. Canvas should show components stacked

**Steps**:
1. Show two-finger gesture over first component
2. Console should show: "Gesture: TWO_FINGERS"
3. Component should highlight/show visual feedback
4. Move hand to new position on canvas
5. Close fist (make closed fist gesture)
6. Console should show: "Dropped component 0 at zone 1"

**Pass Criteria**: 
- ✅ Component visually feedback during drag
- ✅ Component moves to new position after drop
- ✅ Drop zone highlighted in green
- ✅ Console shows drop event

---

### Test 4: Closed Fist Delete ✅

**Goal**: Verify delete works with closed fist gesture

**Setup**:
1. Add 3+ components to canvas

**Steps**:
1. Show two-finger gesture over a component (start drag)
2. Show closed fist gesture before dropping
3. Console should show: "DELETE_COMPONENT"
4. Component should disappear from canvas

**Pass Criteria**:
- ✅ Component removed from canvas
- ✅ Remaining components reorder correctly
- ✅ Console shows delete event

---

### Test 5: Thumbs Up Add Component ✅

**Goal**: Verify component addition with thumbs up gesture

**Setup**:
1. Click on a component in the library to select it

**Steps**:
1. Selected component shows highlighted in library
2. Make thumbs up gesture
3. Console should show: "Gesture: THUMBS_UP"
4. New component should appear on canvas

**Pass Criteria**:
- ✅ No errors in console
- ✅ Component added to canvas
- ✅ Component appears in correct position

---

### Test 6: Hand Detection Edge Cases ✅

**Goal**: Verify robustness of gesture detection

**Test Scenarios**:

**Poor Lighting**:
- Dim lights, reduce lighting
- Gestures may not detect (confidence > 0.70 required)
- ✅ Pass if gracefully degrades

**Different Hand Sizes**:
- Test with different sized hands
- Make similar gestures
- ✅ Pass if detected consistently

**Different Angles**:
- Test with hand rotated
- Palm at different angles
- ✅ Pass if robust to angles

**Fast Movements**:
- Make quick gestures
- ✅ Pass if detects majority

**Partial Hand Visibility**:
- Hand partially off-screen
- ✅ Pass if gracefully handles

---

### Test 7: Confidence Meter Display ✅

**Goal**: Verify confidence meter shows accurate values

**Steps**:
1. Look at "Confidence Meter" in left panel
2. Make various gestures
3. Watch meter update in real-time
4. Values should match console logs

**Pass Criteria**:
- ✅ Meter updates smoothly
- ✅ Matches console confidence values
- ✅ Shows 0% when no gesture detected

---

### Test 8: Multiple Drag Operations ✅

**Goal**: Verify multiple sequential drags work correctly

**Steps**:
1. Add 4+ components to canvas
2. Drag component 1 to position 2
3. Drag component 3 to position 1
4. Drag component 4 to last position
5. Verify final order is correct

**Pass Criteria**:
- ✅ All moves successful
- ✅ Order correctly maintained
- ✅ No visual glitches

---

### Test 9: Code Generation ✅

**Goal**: Verify code generates correctly after drag

**Steps**:
1. Add components to canvas via drag
2. Reorder with drag
3. Check "Generated React Code" panel at bottom
4. Verify order matches canvas order

**Pass Criteria**:
- ✅ Code reflects component order
- ✅ No errors in code
- ✅ React JSX is valid

---

### Test 10: Performance Under Load ✅

**Goal**: Verify smooth performance with many components

**Steps**:
1. Add 10+ components to canvas
2. Perform multiple drags
3. Monitor performance
4. Check responsive delay

**Pass Criteria**:
- ✅ Drag responses within 100ms
- ✅ Smooth visual updates (no stutter)
- ✅ No memory leaks (check DevTools Performance tab)

---

## Console Debugging Checklist

Open F12 → Console and verify:

- [ ] `MediaPipe model loaded` - Model initialized
- [ ] `Landmarks detected: [...]` - Hand detected
- [ ] `Gesture classified: [name] confidence: [0-1]` - Gesture detected
- [ ] `Finger position: { x: xxx, y: yyy }` - Coordinates tracked
- [ ] No RED errors in console
- [ ] No ORANGE warnings (or acceptable warnings)

---

## Manual QA Sign-Off Template

```
Tester: ________________
Date: __________________

Test Results:
☐ Gesture Detection Accuracy
☐ Coordinate Transformation
☐ Two-Finger Drag & Drop
☐ Closed Fist Delete
☐ Thumbs Up Add
☐ Edge Cases
☐ Confidence Meter
☐ Multiple Operations
☐ Code Generation
☐ Performance

Issues Found:
1. ___________________
2. ___________________

Notes:
_____________________
_____________________

Status: ☐ PASS  ☐ FAIL  ☐ PARTIAL
```

---

## Performance Metrics

**Expected Targets**:
- Gesture detection latency: < 50ms
- Drag update rate: 60 FPS
- Coordinate update rate: 10 FPS (100ms)
- Memory usage: < 150MB
- CPU usage during idle: < 20%

**Measure with DevTools**:
1. Open F12 → Performance tab
2. Click Record
3. Perform test action
4. Stop recording
5. Analyze frame rate and memory

---

## Regression Testing

After any changes, verify:
- [ ] All 10 test cases still pass
- [ ] No new console errors
- [ ] Performance metrics maintained
- [ ] No gesture detection degradation
- [ ] All UI elements responsive

---

## Known Limitations

1. **Single Hand**: Only detects 1 hand at a time
2. **Lighting**: Requires reasonably good lighting
3. **Hand Visibility**: Hand must be mostly visible in webcam
4. **Gesture Speed**: Works best with deliberate, not-too-fast gestures
5. **Platform**: Requires WebGL and MediaPipe support

---

## Success Criteria for Release

✅ All 10 test cases PASS
✅ No console RED errors
✅ Gesture confidence > 0.70 average
✅ Drag latency < 100ms
✅ Performance metrics met
✅ No memory leaks
✅ Works on target browsers

---

## Troubleshooting Failed Tests

**Test 1 Fails: Gesture not detected**
- Check lighting
- Verify webcam is working (should see video in feed)
- Try clearer gesture pose
- Check MediaPipe loading (should see model loaded message)

**Test 2 Fails: Coordinates not tracking**
- Verify MediaPipe working
- Check console for errors
- Move hand more to see coordinate changes
- Check screen resolution

**Test 3 Fails: Drag not working**
- Ensure two-finger gesture has confidence > 0.85
- Verify gesture UI shows "✌️ Two Fingers"
- Check drop zone highlights green
- Console should show drag events

**Test 4 Fails: Delete not working**
- Make sure component is actively being dragged
- Closed fist confidence should be > 0.88
- Try making fist gesture more pronounced
- Check console for DELETE_COMPONENT action

**Performance Issues**:
- Close other browser tabs
- Reduce hardware acceleration
- Check system resource usage
- Monitor MediaPipe FPS in console
