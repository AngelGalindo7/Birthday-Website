import React, {useRef,useState, useEffect} from "react";


//TODOS: Explain await function and callbacks and async

export default function VoiceDetector () {
    const [audioStream, setAudioStream] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [volume, setVolume] = useState(0);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);


    
        async function initMic() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true})
                setAudioStream(stream)
                setHasPermission(true);

                const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256; //play around with this value (fast fourier transfrom size)

                const source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                audioContextRef.current = audioCtx;
                analyserRef.current = analyser;
                dataArrayRef.current = dataArray;
                streamRef.current = stream;


                const updateVolume = () => {
                    analyser.getByteTimeDomainData(dataArray);
                    /*
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        const value = (dataArray[i] - 128) / 128;
                        sum += value * value;
                    }
                    const rms = Math.sqrt(sum / bufferLength);
                    const loudness = Math.round(rms * 100);
                    
                    setVolume(loudness);
                    console.log("Current loudness:" , loudness);
                    
                    animationRef.current = requestAnimationFrame(updateVolume);
                    */

                };

                updateVolume();
            } catch(err) {
                console.error("Microphone access denied or error:", err);
                setHasPermission(false);
            }
        }

    useEffect( () => {
        return () => {
             if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        };
    }, []);

    

return (
    <div className="p-4">
      <h2 className="font-semibold text-lg">Voice Detector</h2>

      {!hasPermission ? (
        <button
          onClick={initMic}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Enable Microphone
        </button>
      ) : (
        <p className="mt-2 text-gray-700">
          🎤 Microphone active — Loudness: <strong>{volume}</strong>
        </p>
      )}
    </div>
  );
}