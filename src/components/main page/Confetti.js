// ConfettiAuto.js
import  { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiAuto() {
  useEffect(() => {
    // Function to fire a single burst
    const fireConfetti = (options) => {
      confetti({
        particleCount: options.particleCount || 50,
        spread: options.spread || 55,
        origin: options.origin || { x: 0.5, y: 0.5 },
        colors: options.colors || ["#ff0000"],
        angle: options.angle,
        decay: options.decay,
      });
    };

    // Example: multiple bursts with different colors
    const bursts = [
      { particleCount: 50, spread: 60, origin: { x: 0.1, y: 0.7 }, colors: ["#0000FF"], angle: 40 },
      { particleCount: 100, spread: 80, origin: { x: 0.9, y: 0.7 }, colors: ["#0866f3ff"], angle: 120, decay: 0.9 },
      { particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.5 }, colors: ["#FF00FF", "#00FFFF"], angle: 90 },
    ];

    // Loop over bursts
    bursts.forEach((burst, index) => {
      setTimeout(() => fireConfetti(burst), index * 500); // Stagger by 500ms
    });

    // Optional: repeat automatically every few seconds
    // const interval = setInterval(() => {
    //   bursts.forEach((burst, index) => {
    //     setTimeout(() => fireConfetti(burst), index * 500);
    //   });
    // }, 5000);
    //
    // return () => clearInterval(interval);
  }, []);

  return null; // No button needed
}
