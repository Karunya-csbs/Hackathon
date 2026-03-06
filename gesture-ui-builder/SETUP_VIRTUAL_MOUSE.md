# Virtual Mouse Setup & Testing Guide

## Quick Start

### Installation & Running

1. **Install Dependencies**
   ```bash
   cd gesture-ui-builder/client
   npm install
   cd ../server
   npm install
   ```

2. **Start Development**
   ```bash
   # Terminal 1 - Start server
   cd server
   npm run dev
   
   # Terminal 2 - Start client
   cd client
   npm run dev
   ```

3. **Open Browser**
   ```
   Navigate to: http://localhost:5173
   ```

## Testing the Virtual Mouse System

### Pre-Test Checklist
- [ ] Webcam is connected and working
- [ ] Good lighting in your workspace
- [ ] Browser tab is in focus
- [ ] Hand is clearly visible to webcam
- [ ] Gesture Control panel shows webcam feed

### Test Scenario 1: Virtual Mouse Cursor

**Objective:** Test that the virtual mouse cursor follows your hand

1. Open Builder page
2. Look for blue dot appearing as cursor
3. Move your hand around - cursor should follow
4. Move slowly for smoother tracking
5. Verify gestures appear below cursor

**Expected Results:**
- ✓ Blue circle cursor appears
- ✓ Cursor follows hand position
- ✓ Gesture type displays below cursor
- ✓ Confidence meter updates

### Test Scenario 2: Library Component Hover

**Objective:** Test pointing at components to highlight them

1. Raise your **index finger only** (one-finger gesture)
2. Point it toward the "Button" component in library
3. Move finger around components
4. Watch for yellow highlight on hover

**Expected Results:**
- ✓ Component highlights in yellow on hover
- ✓ Text changes to "👆 Point to grab"
- ✓ Smooth highlighting without lag

### Test Scenario 3: Grab Component

**Objective:** Test initiating drag from library

1. Point finger at "Button" component
2. Raise **two fingers** (index + middle, both up)
3. Watch for component to become red/active
4. Component should be "grabbed"

**Expected Results:**
- ✓ Component border changes from yellow to red
- ✓ Component glows/becomes highlighted
- ✓ Virtual cursor changes to large red circle
- ✓ Status shows "Dragging Button"

### Test Scenario 4: Drag to Canvas

**Objective:** Test moving component to canvas

1. Complete Scenario 3 (grab component)
2. Keep two fingers up 
3. Move hand toward canvas area
4. Watch canvas for visual feedback
5. Canvas border should change color as hand approaches

**Expected Results:**
- ✓ Canvas border turns orange/red as hand nears
- ✓ Component label stays visible in cursor
- ✓ Smooth hand tracking during movement

### Test Scenario 5: Drop Component

**Objective:** Test completing the drag operation

1. Complete Scenario 4 (drag to canvas)
2. Move hand over canvas area
3. Canvas border should turn **RED** (fully ready)
4. Close your fist (make closed_fist gesture)
5. Component should appear on canvas

**Expected Results:**
- ✓ Canvas has red border when hand over it
- ✓ "Drop component here" text appears
- ✓ Component appears in canvas after drop
- ✓ Component removed from being "dragged"
- ✓ Gesture state resets to normal

### Test Scenario 6: Add Multiple Components

**Objective:** Test rapid sequential additions

1. Drag and drop "Button" to canvas
2. Immediately point at "Card" component
3. Grab with two fingers
4. Drag to different position on canvas
5. Drop by closing fist
6. Canvas should now have 2 components

**Expected Results:**
- ✓ Multiple components appear
- ✓ Each appears in different position
- ✓ Canvas reorders correctly
- ✓ No lag or UI freezing

### Test Scenario 7: Canvas Component Reordering

**Objective:** Test reordering components already on canvas

1. Have 2+ components on canvas
2. Point at a component on canvas
3. Grab with two fingers
4. Drag to different position
5. Drop using fist gesture

**Expected Results:**
- ✓ Component highlights on hover
- ✓ Components reorder on canvas
- ✓ List updates correctly
- ✓ No scroll issues

### Test Scenario 8: Error Scenarios

**Low Confidence Gesture**
- Make vague two-finger gesture
- Confidence should stay below 70%
- Drag should not initiate

**Gesture Outside Canvas**
- Drag component over non-canvas area
- Canvas border stays gray
- Drop should not work

**Interrupted Gesture**
- Start drag, then relax hand (open fist suddenly)
- Drag should cancel
- State should reset

## Performance Testing

### Test with Different Conditions

**Lighting Conditions:**
- [ ] Bright office lighting
- [ ] Dim room lighting  
- [ ] Backlit from window
- [ ] Mixed lighting

**Distance from Webcam:**
- [ ] Close (1-2 feet)
- [ ] Medium (2-3 feet)
- [ ] Far (3+ feet)

**Hand Movements:**
- [ ] Slow deliberate movements
- [ ] Quick snappy movements
- [ ] Circular motion
- [ ] Diagonal motion

**System Load:**
- Check browser CPU usage
- Check memory usage
- Monitor for frame rate drops

## Debugging Tips

### Check Gesture Confidence
- Look at confidence meter in left panel
- Gestures need > 70% for drag to work
- Make gestures clearer if confidence is low

### View Gesture Classification
- Gesture type appears below cursor
- Should show: "one_finger", "two_fingers", "closed_fist" etc.
- Check against intended gesture

### Monitor Drop Zone
- Canvas border color indicates state:
  - Gray = no drag active
  - Blue = canvas drag mode
  - Orange/Red = library drag hover
  - Red = library drag over canvas

### Use Browser DevTools
```javascript
// Open console to check state
// Check for errors in console
// Monitor network tab for delays
// Profile performance in Performance tab
```

## Common Issues & Solutions

### Issue: Cursor not following hand
**Solutions:**
- Check webcam is enabled in browser
- Try refreshing page
- Close other tabs using webcam
- Ensure hand is visible to webcam

### Issue: Components not highlighting on hover
**Solutions:**
- Lower finger more clearly
- Move finger more slowly
- Check confidence > 50%
- Reset browser cache

### Issue: Two-finger gesture not detected
**Solutions:**
- Make fingers more clearly separated
- Hold gesture longer (0.5+ seconds)
- Check confidence is high enough
- Try different camera angle

### Issue: Drop doesn't work
**Solutions:**
- Ensure canvas has RED border before releasing
- Make fist gesture very clear and complete
- Try different position on canvas
- Check system performance

### Issue: Performance degradation
**Solutions:**
- Close background browser tabs
- Reduce canvas complexity
- Restart browser
- Check CPU usage
- Monitor memory leaks

## Success Criteria

Your implementation is working correctly when:

✅ **Virtual Mouse**
- Cursor appears and follows hand
- Shows gesture type
- Updates smoothly without lag

✅ **Library Interaction**
- Components highlight on finger hover
- Yellow highlight appears smoothly
- Text updates to "Point to grab"

✅ **Gesture Grabbing**
- Two-finger gesture initiates drag
- Component turns red when grabbed
- Drag state persists

✅ **Drag Operation**
- Hand movement moves dragged component position
- Virtual cursor updates smoothly
- Component label stays visible

✅ **Canvas Drop**
- Canvas provides visual feedback
- Border changes color when component over it
- Drop completes when gesture released

✅ **Component Addition**
- New components appear on canvas
- Layout updates correctly
- Multiple sequential additions work

## Next Steps

After successful testing:

1. **Customize Gestures**
   - Edit GestureMappings.js for different gestures
   - Add new gesture types if needed

2. **Enhance Feedback**
   - Add sound effects on drop
   - Add animation on component addition
   - Add haptic feedback (if device supports)

3. **Extend Functionality**
   - Support component customization via gesture
   - Add component deletion via gesture
   - Multi-hand support

4. **Optimize Performance**
   - Profile and optimize bottlenecks
   - Consider gesture smoothing
   - Optimize re-renders

## Support

For issues:
1. Check VIRTUAL_MOUSE_GUIDE.md for usage help
2. Check VIRTUAL_MOUSE_TECHNICAL.md for architecture
3. Review console errors for clues
4. Test with different conditions
5. Check webcam permissions
