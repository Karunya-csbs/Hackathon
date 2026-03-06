import { useState, useCallback, useEffect } from 'react';
import GestureClassifier from '../gestures/GestureClassifier';

const useGestureDetection = (landmarks) => {
  const [gesture, setGesture] = useState({ gesture: 'none', confidence: 0 });
  const classifierRef = useRef(null);

  useEffect(() => {
    if (!classifierRef.current) {
      classifierRef.current = new GestureClassifier();
    }
  }, []);

  useEffect(() => {
    if (landmarks && classifierRef.current) {
      const result = classifierRef.current.classify(landmarks);
      setGesture(result);
    }
  }, [landmarks]);

  return gesture;
};

import { useRef } from 'react';

export default useGestureDetection;