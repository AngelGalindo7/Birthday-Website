import React, {useRef, useState, useEffect} from "react";


//Look into normalizing audio file names when non ascii characters appear
function importAll(r){
  return r.keys().map(r);
}


//consider adding to public to avoid adding bundle size in deployment
const songs = importAll(require.context("../assets/audio",false,/\.mp3$/));

export default function AudioPlayer() {
  const audioRef = useRef(null);

  const [currentSongIndex,setSongIndex] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setSongIndex((prev) => (prev + 1) % songs.length);
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };

  }, []);

  useEffect ( () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = songs[currentSongIndex];
    audio.load();
    //consider playing audio automatically instead of on click
    audio.preload = "auto";
    audio.autoplay = true;
  }, [currentSongIndex]);
 

  const pauseAudio = () => audioRef.current.pause();
  const skipNext = () => setSongIndex((i) => (i + 1) % songs.length);
  const skipPrev = () => setSongIndex((i) => (i - 1 + songs.length) % songs.length);

  return (
    <div style = { { textAlign: "center"}}>
      <h2>Now playing: Song {currentSongIndex + 1}</h2>
      <audio ref={audioRef} controls preload="auto" />
      <div style= {{ marginTop: "1rem"}}>
        <button onClick={skipPrev}>Prev</button>
        <button onClick={pauseAudio}>Pause</button>
        <button onClick={skipNext}>Next</button>
      </div>
    </div>
  );
}
