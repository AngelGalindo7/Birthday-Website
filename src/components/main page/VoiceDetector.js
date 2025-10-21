import {useRef,useState, useEffect, useCallback} from "react";


export default function VoiceDetector ( {onBlowDetected, isListening} ) {
    const [volume, setVolume] = useState(0);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);
    //UseCallback to keep memory of function the same to avoid creating new functions
    //And causing multiple loops
    const detectBlowing = useCallback(() => {
    if (!isListening || !analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const value = (dataArrayRef.current[i] - 128) / 128;
      sum += value * value;
    }

    const rms = Math.sqrt(sum / dataArrayRef.current.length);
    const loudness = Math.round(rms * 100);
    setVolume(loudness);

    if (!detectBlowing.prev) detectBlowing.prev = loudness;
    const delta = loudness - detectBlowing.prev;
    detectBlowing.prev = loudness;

    if (delta > 20 && loudness > 30) {
      onBlowDetected?.(true);
    }

    animationRef.current = requestAnimationFrame(detectBlowing);
  }, [isListening, onBlowDetected]);

  const initMic = useCallback(async () => {
    if (audioContextRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      //Minor edge case of isListening being set to false while getting stream
      /*if (!isListening) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }*/

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      streamRef.current = stream;

      if (isListening) detectBlowing();
    } catch (err) {
      console.error("Microphone access denied or error:", err);
    }
  }, [isListening, detectBlowing]);
  //WHen parent sets isListening to true the mic function gets initialized
  //When initialized it calls detectblowing
  
  const cleanupMic = useCallback(() => {
  if (animationRef.current) cancelAnimationFrame(animationRef.current);
  if (audioContextRef.current) audioContextRef.current?.close();
  if (streamRef.current) streamRef.current?.getTracks().forEach((t) => t.stop());

  audioContextRef.current = null;
  analyserRef.current = null;
  dataArrayRef.current = null;
  streamRef.current = null;
  animationRef.current = null;
}, []);
  useEffect(() => {
    if (isListening) initMic();
    else cleanupMic();
    
    return cleanupMic;
      
    },[isListening, initMic, cleanupMic]);

  }