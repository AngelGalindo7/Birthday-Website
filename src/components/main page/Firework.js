// src/components/FireworkShow.js
import { useRef, useEffect } from 'react';
import { Fireworks } from '@fireworks-js/react';

export default function FireworkShow({
  initialLaunch = 0,
  recurring = false,
  recurringCount = 1,
  interval = 3000,
  colors = { min: 0, max: 360 },
  style = {},
  soundFiles = [] // array of strings for sound
}) {
  const fireworksRef = useRef(null);

  useEffect(() => {
    const fireworks = fireworksRef.current;
    if (!fireworks) return;

    // Launch initial fireworks
    if (initialLaunch > 0) fireworks.launch(initialLaunch);

    // Setup recurring launches
    let intervalId;
    if (recurring) {
      intervalId = setInterval(() => {
        fireworks.launch(recurringCount);
      }, interval);
    }

    return () => clearInterval(intervalId);
  }, [initialLaunch, recurring, recurringCount, interval]);

  return (
    <Fireworks
      ref={fireworksRef}
      options={{
        hue: colors,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        delay: { min: 30, max: 60 },
        rocketsPoint: { min: 50, max: 50 },
        lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } },
        brightness: { min: 50, max: 80 },
        decay: { min: 0.015, max: 0.03 },
        mouse: { click: false, move: false, max: 1 },
        sound: {
          enabled: soundFiles.length > 0,
          files: soundFiles,
          volume: { min: 0.5, max: 1 }
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        ...style
      }}
    />
  );
}
