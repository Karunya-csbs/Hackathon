class GestureClassifier {
  constructor() {
    this.gestureThreshold = 0.7;
  }

  // Distance between two points
  distance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
  }

  // Check if fingers are open or closed
  isFingerOpen(landmarks, fingerTip, fingerPip, fingerMcp) {
    const d1 = this.distance(landmarks[fingerTip], landmarks[fingerPip]);
    const d2 = this.distance(landmarks[fingerPip], landmarks[fingerMcp]);
    const ratio = d1 / (d2 + 0.001); // Avoid division by zero
    return ratio > 1.2; // Refined threshold
  }

  // Calculate hand bounding box for normalization
  getHandBoundingBox(landmarks) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    landmarks.forEach(p => {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    });
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
  }

  classify(landmarks) {
    if (!landmarks || landmarks.length < 21) {
      return { gesture: 'none', confidence: 0 };
    }

    console.log('Classifying landmarks:', landmarks.length, 'points');
    console.log('Sample landmarks:', landmarks.slice(0, 5));

    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkTip = landmarks[20];
    const box = this.getHandBoundingBox(landmarks);
    const handScale = Math.sqrt(box.width * box.height);

    console.log('Hand scale:', handScale.toFixed(2), 'Box:', box);

    // Check for closed fist (all fingertips close to wrist)
    const fistDistance = 
      this.distance(thumbTip, indexTip) +
      this.distance(indexTip, middleTip) +
      this.distance(middleTip, ringTip) +
      this.distance(ringTip, pinkTip);
    
    console.log('Fist distance:', fistDistance.toFixed(2), 'threshold:', (handScale * 0.5).toFixed(2));
    
    if (fistDistance < handScale * 0.5) {
      console.log('Gesture: CLOSED_FIST (distance:', fistDistance.toFixed(0), ')');
      return { gesture: 'closed_fist', confidence: 0.88 };
    }

    // Check for two fingers (index and middle up)
    const indexUp = this.isFingerOpen(landmarks, 8, 6, 5);
    const middleUp = this.isFingerOpen(landmarks, 12, 10, 9);
    const ringDown = !this.isFingerOpen(landmarks, 16, 14, 13);
    const pinkyDown = !this.isFingerOpen(landmarks, 20, 18, 17);
    const thumbDown = !this.isFingerOpen(landmarks, 4, 3, 2);

    if (indexUp && middleUp && ringDown && pinkyDown && thumbDown) {
      console.log('Gesture: TWO_FINGERS');
      return { gesture: 'two_fingers', confidence: 0.9 };
    }

    // Check for one finger (index only up)
    const middleDown = !this.isFingerOpen(landmarks, 12, 10, 9);
    if (indexUp && middleDown && ringDown && pinkyDown) {
      console.log('Gesture: ONE_FINGER');
      return { gesture: 'one_finger', confidence: 0.85 };
    }

    // Check for thumbs up
    const thumbUp = this.isFingerOpen(landmarks, 4, 3, 2);
    const indexDown = !this.isFingerOpen(landmarks, 8, 6, 5);
    if (thumbUp && indexDown && middleDown && ringDown && pinkyDown) {
      console.log('Gesture: THUMBS_UP');
      return { gesture: 'thumbs_up', confidence: 0.85 };
    }

    // Check for open palm (all fingers up)
    const thumb = this.isFingerOpen(landmarks, 4, 3, 2) ? 1 : 0;
    const openFingers = thumb +
      (indexUp ? 1 : 0) +
      (middleUp ? 1 : 0) +
      (this.isFingerOpen(landmarks, 16, 14, 13) ? 1 : 0) +
      (this.isFingerOpen(landmarks, 20, 18, 17) ? 1 : 0);

    if (openFingers >= 5) {
      console.log('Gesture: OPEN_PALM');
      return { gesture: 'open_palm', confidence: 0.87 };
    }

    // Check for wave (horizontal hand movement, not current frame)
    if (Math.abs(indexTip[0] - middleTip[0]) > handScale * 0.4) {
      console.log('Gesture: WAVE');
      return { gesture: 'wave', confidence: 0.75 };
    }

    return { gesture: 'none', confidence: 0 };
  }
}

export default GestureClassifier;