import { useEffect, useRef, useCallback, useState } from "react";

interface ShakeDetectionOptions {
  threshold?: number; // Acceleration threshold to detect shake
  timeout?: number; // Time window for shake count (ms)
  shakeCount?: number; // Number of shakes required to trigger
  onShake?: () => void; // Callback when shake is detected
  enabled?: boolean; // Whether detection is enabled
}

export const useShakeDetection = ({
  threshold = 15,
  timeout = 1000,
  shakeCount = 3,
  onShake,
  enabled = true,
}: ShakeDetectionOptions) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const lastZ = useRef<number | null>(null);
  const shakeCountRef = useRef(0);
  const lastShakeTime = useRef(0);

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      if (!enabled) return;

      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;

      if (lastX.current !== null && lastY.current !== null && lastZ.current !== null) {
        const deltaX = Math.abs(x - lastX.current);
        const deltaY = Math.abs(y - lastY.current);
        const deltaZ = Math.abs(z - lastZ.current);

        const totalDelta = deltaX + deltaY + deltaZ;

        if (totalDelta > threshold) {
          const now = Date.now();
          
          // Reset count if too much time has passed
          if (now - lastShakeTime.current > timeout) {
            shakeCountRef.current = 0;
          }

          shakeCountRef.current++;
          lastShakeTime.current = now;

          if (shakeCountRef.current >= shakeCount) {
            shakeCountRef.current = 0;
            onShake?.();
          }
        }
      }

      lastX.current = x;
      lastY.current = y;
      lastZ.current = z;
    },
    [enabled, threshold, timeout, shakeCount, onShake]
  );

  const requestPermission = useCallback(async () => {
    // Check if DeviceMotionEvent is supported
    if (!("DeviceMotionEvent" in window)) {
      setIsSupported(false);
      return false;
    }

    setIsSupported(true);

    // iOS 13+ requires permission
    if (
      typeof (DeviceMotionEvent as any).requestPermission === "function"
    ) {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === "granted") {
          setPermissionGranted(true);
          return true;
        } else {
          setPermissionGranted(false);
          return false;
        }
      } catch (error) {
        console.error("Error requesting motion permission:", error);
        setPermissionGranted(false);
        return false;
      }
    } else {
      // Non-iOS or older iOS - permission not required
      setPermissionGranted(true);
      return true;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || !permissionGranted || !enabled) return;
    
    window.addEventListener("devicemotion", handleMotion);
    setIsListening(true);
  }, [isSupported, permissionGranted, enabled, handleMotion]);

  const stopListening = useCallback(() => {
    window.removeEventListener("devicemotion", handleMotion);
    setIsListening(false);
    shakeCountRef.current = 0;
  }, [handleMotion]);

  useEffect(() => {
    // Check support on mount
    setIsSupported("DeviceMotionEvent" in window);
    
    // Auto-check permission for non-iOS devices
    if (
      "DeviceMotionEvent" in window &&
      typeof (DeviceMotionEvent as any).requestPermission !== "function"
    ) {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (enabled && permissionGranted) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [enabled, permissionGranted, startListening, stopListening]);

  return {
    isSupported,
    permissionGranted,
    isListening,
    requestPermission,
    startListening,
    stopListening,
  };
};
