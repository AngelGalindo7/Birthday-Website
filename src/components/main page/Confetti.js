// ConfettiButton.js
import React from "react";
import confetti from "canvas-confetti";

export default function ConfettiButton() {
  const handleClick = () => {
    confetti({
      particleCount: 50,
      spread: 55,
      origin: {x:-.1, y:.7 },
      colors:["#0000FF"],
      angle: 40,
      
      
    });
    confetti({
      particleCount: 150,
      spread: 30,
      origin: {x:1 },
      colors:["#0866f3ff"],
      decay: .9,
      angle: 120
      
    });
    
  };

  return (
    <button
      onClick={handleClick}
      style={{
        fontSize: "1.2rem",
        cursor: "pointer",
        borderRadius: "8px",
      }}
    >
       Celebrate!
    </button>
  );
}
