import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import GestureClassifier from '../../gestures/GestureClassifier';

// webcam component now uses MediaPipe Hands directly
const WebcamFeed = ({ onFrameCapture, isRunning = true, setGesture, onFingerPosition }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const gestureClassifierRef = useRef(null);
  const [webcamReady, setWebcamReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [handsDetected, setHandsDetected] = useState(false);

  // Check if webcam is ready
  useEffect(() => {
    if (webcamRef.current && webcamRef.current.video) {
      const video = webcamRef.current.video;
      const checkReady = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          console.log('Webcam video is ready:', video.videoWidth, 'x', video.videoHeight);
          setWebcamReady(true);
        } else {
          console.log('Webcam not ready yet, readyState:', video.readyState);
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    }
  }, []);

  // initialize TensorFlow Handpose
  useEffect(() => {
    if (!webcamReady || handsRef.current) {
      console.log('Waiting for webcam to be ready before initializing Handpose, or already initialized');
      return;
    }

    const initHandpose = async () => {
      try {
        console.log('Initializing TensorFlow Handpose...');
        await tf.ready();
        console.log('TensorFlow ready, backend:', tf.getBackend());

        // Set backend to webgl for better performance
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('TensorFlow backend set to webgl');

        // Try to load handpose with specific config
        handsRef.current = await handpose.load({
          maxContinuousChecks: 5,
          detectionConfidence: 0.8,
          iouThreshold: 0.3,
          scoreThreshold: 0.75
        });
        console.log('Handpose model loaded successfully');

        if (!gestureClassifierRef.current) {
          gestureClassifierRef.current = new GestureClassifier();
          console.log('GestureClassifier initialized');
        }

        console.log('Handpose initialized successfully');
      } catch (error) {
        console.error('Error initializing Handpose:', error);
      }
    };

    initHandpose();
  }, [setGesture, onFrameCapture, webcamReady]);

  // feed frames to TensorFlow Handpose
  useEffect(() => {
    if (!isRunning) return;
    console.log('Starting webcam processing interval');
    const interval = setInterval(async () => {
      if (!webcamRef.current || isProcessing || !handsRef.current) return;
      const video = webcamRef.current.video;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
        console.log('Sending frame to TensorFlow Handpose');
        console.log('Video element:', video, 'readyState:', video.readyState);
        console.log('Handpose model:', handsRef.current);
        setIsProcessing(true);
        try {
          // Create a canvas to capture the video frame
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert to tensor
          const imageTensor = tf.browser.fromPixels(canvas);
          console.log('Image tensor shape:', imageTensor.shape);

          const predictions = await handsRef.current.estimateHands(imageTensor, {
            flipHorizontal: true, // Try flipping since video might be mirrored
            maxNumHands: 1
          });

          // Clean up tensor
          imageTensor.dispose();

          console.log('Handpose predictions:', predictions);

          if (predictions && predictions.length > 0) {
            const landmarks = predictions[0].landmarks;
            console.log('Hand landmarks detected:', landmarks.length, 'points');
            setHandsDetected(true);

            // send raw landmarks back to parent (may be used elsewhere)
            onFrameCapture && onFrameCapture(landmarks);

            // convert TensorFlow landmark objects to [x,y] pixel coordinates
            const formattedLandmarks = landmarks.map(p => [p[0], p[1]]);

            // classify gesture using scaled coordinates
            const gestureResult = gestureClassifierRef.current.classify(formattedLandmarks);
            console.log('Gesture classified:', gestureResult.gesture, 'confidence:', gestureResult.confidence);
            console.log('Landmarks sample:', formattedLandmarks.slice(0, 5)); // Log first 5 landmarks
            setGesture && setGesture(gestureResult);

            // calculate finger position by linear mapping to full window
            const indexTip = formattedLandmarks[8]; // [x, y] in video pixels
            const screenX = (indexTip[0] / video.videoWidth) * window.innerWidth;
            const screenY = (indexTip[1] / video.videoHeight) * window.innerHeight;

            console.log('Index tip:', indexTip, 'mapped to screen', { screenX, screenY });
            onFingerPosition && onFingerPosition({ x: screenX, y: screenY });

            // draw on canvas for debugging
            drawOnCanvas(landmarks);
          } else {
            console.log('No hand predictions found');
            setGesture && setGesture({ gesture: 'none', confidence: 0 });
            setHandsDetected(false);
            clearCanvas();
          }
        } catch (error) {
          console.error('Error processing frame with Handpose:', error);
        }
        setIsProcessing(false);
      } else {
        console.log('Video not ready:', {
          video: !!video,
          readyState: video?.readyState,
          hands: !!handsRef.current
        });
      }
    }, 100);

    return () => {
      console.log('Clearing webcam processing interval');
      clearInterval(interval);
    };
  }, [isRunning, isProcessing]);

  const drawOnCanvas = (landmarks) => {
    if (!canvasRef.current || !webcamRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = webcamRef.current.video;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw landmarks (TensorFlow format: [x, y, z])
    ctx.fillStyle = '#FF0000';
    landmarks.forEach(point => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw some connections for hand structure
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // index
      [0, 9], [9, 10], [10, 11], [11, 12], // middle
      [0, 13], [13, 14], [14, 15], [15, 16], // ring
      [0, 17], [17, 18], [18, 19], [19, 20] // pinky
    ];

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    connections.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[i][0], landmarks[i][1]);
      ctx.lineTo(landmarks[j][0], landmarks[j][1]);
      ctx.stroke();
    });
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const onUserMedia = (stream) => {
    console.log('Webcam stream received:', stream);
    console.log('Video tracks:', stream.getVideoTracks());
    setWebcamActive(true);
  };

  const onUserMediaError = (error) => {
    console.error('Webcam error:', error);
  };

  return (
    <div className="relative w-full">
      <Webcam
        ref={webcamRef}
        width={300}
        height={300}
        className="rounded border border-gray-300 w-full"
        screenshotFormat="image/jpeg"
        mirrored
        audio={false}
        videoConstraints={{
          width: 320,
          height: 240,
          facingMode: "user"
        }}
        onUserMedia={onUserMedia}
        onUserMediaError={onUserMediaError}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full rounded border border-red-300"
        style={{ pointerEvents: 'none' }}
      />
      <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
        <p className="font-semibold">Gesture Detection Active</p>
        <p className={webcamActive ? "text-green-600" : "text-red-600"}>
          {webcamActive ? "📹 Webcam Active" : "📹 Webcam Not Active - Check Permissions"}
        </p>
        <p className={webcamReady ? "text-green-600" : "text-yellow-600"}>
          {webcamReady ? "📹 Webcam Ready" : "📹 Waiting for webcam..."}
        </p>
        {isProcessing && <p className="text-blue-600">🔄 Processing...</p>}
        <p className={handsDetected ? "text-green-600" : "text-red-600"}>
          {handsDetected ? "🖐️ Hands Detected" : "🖐️ No Hands Detected"}
        </p>
        <p className="text-purple-600">🎯 Virtual cursor moves across entire page</p>
        <p className="text-orange-600">🤖 Using TensorFlow Handpose for detection</p>
        <p className="text-blue-600">💡 Ensure hand is well-lit and in frame</p>
        <p className="text-orange-600">👋 Try waving your hand in front of camera</p>
        <p className="text-orange-600">📏 Keep hand 1-2 feet from camera</p>
      </div>
    </div>
  );
};

export default WebcamFeed;