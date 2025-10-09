import React, {useRef} from "react";
import MySong from '../assets/audio/The Marías - Heavy.mp3'

export default function AudioPlayer() {
  const audioRef = useRef(null);

  const playAudio = () => {
    audioRef.current.play();
  };

  const pauseAudio = () => {
    audioRef.current.pause();
  };

  const setVolume = (value) => {
    audioRef.current.volume = value
  };

  const changeSong = () => {

  };

  return (
    <div>
      <button onClick={playAudio}>Play</button>
      <button onClick={pauseAudio}>Pause</button>
      <audio ref={audioRef}>
        <source src={MySong} type="audio/mpeg" />
      </audio>
    </div>
  );
}
