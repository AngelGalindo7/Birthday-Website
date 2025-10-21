import React, {useRef, useState, useEffect} from "react";

//Look into normalizing audio file names when non ascii characters appear
function importAll(r){
  return r.keys().map(r);
}


//consider adding to public to avoid adding bundle size in deployment
const songs = importAll(require.context("../../assets/audio",false,/\.mp3$/));

export default function AudioPlayer( {onDone, visible} ) {
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [currentSongIndex,setSongIndex] = useState(0);


  const handlePlay = async () => {
    setStarted(true);
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();

      setTimeout(() => onDone && onDone(), 4000);
    } catch(err) {
      console.warn("Play blocked", err);
    }
  };
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

    if (started){
      const playPromise = audio.play();
      if(playPromise !== undefined) {
        playPromise.catch((err) => console.warn("Autoplay blocked:", err));
      }
    }
    
  }, [currentSongIndex, started]);
 

  const pauseAudio = () => audioRef.current.pause();
  const skipNext = () => setSongIndex((i) => (i + 1) % songs.length);
  const skipPrev = () => setSongIndex((i) => (i - 1 + songs.length) % songs.length);

  return (
    <div className="audio-player"
      style = {{display : visible ? "block" : "none"}}
      >
      <audio 
      ref={audioRef} 
      controls 
      preload="auto"
      style={{display: started ? "inline": "none"}} />

      {!started && <button className="shadow__btn fade-in" onClick={handlePlay}>音楽を再生する</button>}
      
      {started && (
        <div className="audio-buttons">
        <button onClick={skipPrev}>Prev</button>
        <button onClick={pauseAudio}>Pause</button>
        <button onClick={skipNext}>Next</button>
      </div>
      )}

    </div>
  );
}
