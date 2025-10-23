

import React, { useEffect, useState } from "react";

export default function Words() {
  const phrases = [
    "Thank you for being part of this celebration.",
    "May your days be filled with light and laughter.",
    "Here’s to more memories and joy ahead!",
    "Happy Birthday once again! 🎂✨",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= phrases.length) return;

    const displayTime = 2000;
    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, displayTime);

    return () => clearTimeout(timer);
  }, [index, phrases.length]);

  if (index >= phrases.length) return null;

  return (
    <div
      className="words-display"
    >
      {phrases[index]}
    </div>
  );
}
