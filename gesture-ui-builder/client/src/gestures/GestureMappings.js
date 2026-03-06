const gestureMappings = {
  'open_palm': {
    action: 'DROP_ITEM',
    description: 'Drop the selected item at current cursor position'
  },
  'thumbs_up': {
    action: 'CONFIRM_ADD',
    description: 'Confirm adding the component to canvas'
  },
  'one_finger': {
    action: 'POINT_AND_FOLLOW',
    description: 'Point with index finger - cursor follows movement'
  },
  'two_fingers': {
    action: 'ENABLE_DRAG',
    description: 'Enable drag mode for components (two fingers up)'
  },
  'closed_fist': {
    action: 'SELECT_AND_DRAG',
    description: 'Select item at cursor position and drag with fist movement'
  },
  'wave': {
    action: 'SCROLL_CANVAS',
    description: 'Scroll the canvas'
  },
  'none': {
    action: 'IDLE',
    description: 'No gesture detected'
  }
};

export const getGestureAction = (gesture) => {
  return gestureMappings[gesture] || gestureMappings['none'];
};

export const getGestureDescription = (gesture) => {
  return (gestureMappings[gesture] || gestureMappings['none']).description;
};

export default gestureMappings;