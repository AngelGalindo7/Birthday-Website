import {useRef,useState, useEffect, useCallback} from "react";


export default function VoiceDetector ( {onBlowDetected, isListening} ) {
    //const [volume, setVolume] = useState(0);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);

    const blowCounterRef = useRef(0);
    const blownTimeoutRef = useRef(null);



    //added 
    const rmsHistory = useRef([]);
    const resetTimeoutRef = useRef(null);
    const blowPhaseRef = useRef("idle");
     
    const BLOW_THRESHOLD = 1.2;
    const RESET_DELAY = 1200;
    const MAX_FRAMES_HISTORY = 10;
    const MIN_BLOW_LOUDNESS = 0.008;
    const MAX_BLOW_LOUDNESS = 0.12;
    const RISING_FRAMES_NEEDED =3;


    //const DELTA_THRESHOLD = 5;
    //const RESET_DELAY = 1500;



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
    
    rmsHistory.current.push(rms);
    if (rmsHistory.current.length > MAX_FRAMES_HISTORY) rmsHistory.current.shift();

    if (rmsHistory.current.length < RISING_FRAMES_NEEDED) {
      animationRef.current = requestAnimationFrame(detectBlowing);
      return;
    }

    // Check if we're in the blow loudness range
    const inBlowRange = rms >= MIN_BLOW_LOUDNESS && rms <= MAX_BLOW_LOUDNESS;
    
    // Check if volume is consistently rising (blowing pattern)
    let risingCount = 0;
    for (let i = 1; i < rmsHistory.current.length; i++) {
      if (rmsHistory.current[i] > rmsHistory.current[i - 1] * 0.95) { // Allow tiny dips
        risingCount++;
      }
    }
    const isRising = risingCount >= RISING_FRAMES_NEEDED;

    // Check if we're sustaining volume (holding the blow)
    const recent3 = rmsHistory.current.slice(-3);
    const avgRecent = recent3.reduce((a, b) => a + b, 0) / recent3.length;
    const isSustaining = avgRecent >= MIN_BLOW_LOUDNESS * 2 && 
                         recent3.every(v => v >= MIN_BLOW_LOUDNESS * 1.5);
    /*
    console.log(
      "RMS:", rms.toFixed(3),
      "InRange:", inBlowRange,
      "Rising:", isRising,
      "Sustaining:", isSustaining,
      "Phase:", blowPhaseRef.current,
      "Counter:", blowCounterRef.current.toFixed(2)
    );*/

    // If we exceed max loudness, it's speech/noise - reset everything
    if (rms > MAX_BLOW_LOUDNESS) {
      blowCounterRef.current = 0;
      blowPhaseRef.current = "idle";
      rmsHistory.current = [];
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
      if (blownTimeoutRef.current) {
        clearTimeout(blownTimeoutRef.current);
        blownTimeoutRef.current = null;
      }
      onBlowDetected?.("reset");
      animationRef.current = requestAnimationFrame(detectBlowing);
      return;
    }

    // Detect blowing
    if (inBlowRange && (isRising || isSustaining)) {
      // Cancel any pending reset
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }

      // Update phase
      if (isRising) {
        blowPhaseRef.current = "rising";
      } else if (isSustaining) {
        blowPhaseRef.current = "sustaining";
      }

      // Accumulate counter based on volume
      const contribution = rms * 25; // Scale up for faster accumulation (blowing is quieter)
      blowCounterRef.current += contribution;

      onBlowDetected?.("blowing");

      // Check if we've blown enough
      if (blowCounterRef.current >= BLOW_THRESHOLD) {
        
        if (blownTimeoutRef.current) clearTimeout(blownTimeoutRef.current);
        
        // Immediate blow out for strong blows
        const strength = Math.min(rms / MAX_BLOW_LOUDNESS, 1);
        const blowDelay = 300 - 200 * strength; // 100-300ms delay
        
        blownTimeoutRef.current = setTimeout(() => {
          onBlowDetected?.("blown");
          blowCounterRef.current = 0;
          blowPhaseRef.current = "idle";
          rmsHistory.current = [];
          blownTimeoutRef.current = null;
        }, blowDelay);
        
        blowCounterRef.current = BLOW_THRESHOLD; // Cap it
      }
    } else {
      // Not blowing - start reset countdown if we have counter
      if (!resetTimeoutRef.current && blowCounterRef.current > 0) {
        resetTimeoutRef.current = setTimeout(() => {
          onBlowDetected?.("reset");
          blowCounterRef.current = 0;
          blowPhaseRef.current = "idle";
          rmsHistory.current = [];
          resetTimeoutRef.current = null;
        }, RESET_DELAY);
      }
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
  if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
  if (blownTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

  audioContextRef.current = null;
  analyserRef.current = null;
  dataArrayRef.current = null;
  streamRef.current = null;
  animationRef.current = null;
  blowCounterRef.current = 0;
  blownTimeoutRef.current = null;
  blowPhaseRef.current = "idle";
  rmsHistory.current = [];

}, []);
  useEffect(() => {
    if (isListening) initMic();
    else cleanupMic();
    
    return cleanupMic;
      
    },[isListening, initMic, cleanupMic]);

  }