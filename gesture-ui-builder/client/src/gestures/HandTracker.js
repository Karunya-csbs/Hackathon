import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

class HandTracker {
  constructor() {
    this.net = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    try {
      this.net = await handpose.load();
      this.isInitialized = true;
      console.log('HandPose model loaded');
    } catch (error) {
      console.error('Error loading handpose model:', error);
    }
  }

  async detectHands(videoElement) {
    if (!this.isInitialized || !this.net) return [];
    try {
      const predictions = await this.net.estimateHands(videoElement, false);
      return predictions;
    } catch (error) {
      console.error('Error detecting hands:', error);
      return [];
    }
  }

  getLandmarks(predictions) {
    if (!predictions || predictions.length === 0) return null;
    return predictions[0].landmarks;
  }
}

export default HandTracker;