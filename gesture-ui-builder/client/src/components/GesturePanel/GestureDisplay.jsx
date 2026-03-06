import React from 'react';

const gestureDescriptions = {
  'open_palm': 'Select Component',
  'thumbs_up': 'Confirm Add',
  'two_fingers': 'Enable Drag',
  'closed_fist': 'Delete Component',
  'wave': 'Scroll Canvas',
  'none': 'No Gesture Detected'
};

const GestureDisplay = ({ detectedGesture = 'none', confidence = 0, fingerPosition }) => {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold text-lg">Detected Gesture</h3>
      <div className="mt-2 text-2xl font-semibold text-blue-600">
        {detectedGesture === 'none' ? '---' : detectedGesture.replace(/_/g, ' ').toUpperCase()}
      </div>
      <div className="mt-2 text-sm text-gray-600">
        Action: {gestureDescriptions[detectedGesture] || 'Unknown'}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Confidence: {(confidence * 100).toFixed(1)}%
      </div>
      {fingerPosition && (
        <div className="mt-2 text-xs text-green-600">
          Position: ({fingerPosition.x?.toFixed(0)}, {fingerPosition.y?.toFixed(0)})
        </div>
      )}
      {!fingerPosition && (
        <div className="mt-2 text-xs text-red-600">
          No hand detected
        </div>
      )}
    </div>
  );
};

export default GestureDisplay;