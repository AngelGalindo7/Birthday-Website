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
    
     const randomOrigin = (baseX, baseY, offset = 0.02) => ({
      x: baseX + (Math.random() * offset * 2 - offset), // random ± offset
      y: baseY + (Math.random() * offset * 2 - offset),
    });
    // Example: multiple bursts with different colors
    const bursts = [
      { particleCount: 100, spread: 80, origin: { x: 0, y: 1 }, colors: ["#0866f3", "#00BFFF", "#33a3ffff"], angle: 60, decay: 0.9 },
      { particleCount: 100, spread: 80, origin: { x: 1, y: 1 }, colors: ["#0866f3", "#00BFFF", "#33a3ffff"], angle: 120, decay: 0.9 },
      // Fireworks upper-middle
      { particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.5 }, colors: ["#ff0000ff", "#0077ffff"], angle: 90 },
      // Fireworks upper-left
      { particleCount: 80, spread: 100, origin: { x: 0.2, y: 0.25 }, colors: ["#ff8800ff", "#00FFFF"], angle: 90 },
      // Fireworks upper-right
      { particleCount: 80, spread: 100, origin: { x: 0.8, y: 0.25 }, colors: ["#ff8800ff", "#0077ffff"], angle: 90 },
    ];
    function firework(x, y) {
  confetti({
    particleCount: 100,
    startVelocity: 30,
    spread: 360,
    origin: { x: x, y: y }, // 0-1, relative to canvas width/height
    gravity: 0.5,
    ticks: 100,
    colors: ["#ff0000", "#ffff00", "#00ff00", "#0000ff", "#ff00ff"]
  });
}

// Example: launch a firework at center
firework(0.5, 0.5);
    requestAnimationFrame(() => {
      const initialDelay = 700;

      // Fire left and right streams together
      setTimeout(() => {
        fireConfetti({ ...bursts[0], origin: randomOrigin(bursts[0].origin.x, bursts[0].origin.y,) });
        fireConfetti({ ...bursts[1], origin: randomOrigin(bursts[1].origin.x, bursts[1].origin.y) });
        firework(0.4,0.4);
      }, initialDelay);

      // Fire fireworks staggered
      bursts.slice(2).forEach((burst, index) => {
        setTimeout(() => fireConfetti(burst), initialDelay + (index + 1) * 500);
      });
    });
  }, []);

  return null; 
}
