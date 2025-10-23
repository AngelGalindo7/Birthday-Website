import React, {useState, useEffect} from "react";
import VoiceDetector from "./VoiceDetector";
import CakeImage from "./Cake";
export default function Cake ({onBlown, onNext}) {
    const [candleOn, setCandleOn] = useState(true)
    const [micPermissionAsked, setMicPermissionAsked] = useState(false)
    const [blowState, setBlowState] = useState(null); // "blowing" | "blown" | "reset"
    const [fadeOut, setFadeOut] = useState(false);
    const [canBlow, setCanBlow] = useState(false);

    const handleBlowDetected = (state) => {
        setBlowState(state);
        if (state === "blown") {
      setCandleOn(false);
      onBlown?.();
    }
    };

    const handleEnableMic = () => {
      console.log("micPermissionAsked changed:", micPermissionAsked);

      setMicPermissionAsked(true);
    };

    const toggleCandle = () => {
        setCandleOn(prev => !prev);
        setBlowState(null)
    };

    useEffect(() => {
    if (micPermissionAsked) {
      const timer = setTimeout(() => setCanBlow(true), 3000); // 3s delay
      return () => clearTimeout(timer);
    }
  }, [micPermissionAsked]);

    useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => {
        onNext?.(); // tell App to go to outro
      }, 1000); // match CSS fade-out duration
      return () => clearTimeout(timer);
    }
  }, [fadeOut, onNext]);

    return (
      <>
    
      {micPermissionAsked &&  <CakeImage fadeout={fadeOut} />}
      {!micPermissionAsked && (
        <button
        onClick={handleEnableMic}
        className="shadow__btn"
        >
          Enable Microphone
        </button>
      )}
      {micPermissionAsked && canBlow && (
        <div className = "button-container"
        >
        <button
        onClick={toggleCandle}
        className={`candle-button fade-in${
              candleOn ? "off" : "on"
            }`}
          >
            {candleOn ? "Blow Out" : "Relight"}
          </button>
            {!candleOn && (
              <button
              className={`shadow__btn fade-in ${fadeOut ? "fade-out" : ""}`}
              onClick={() => setFadeOut(true)}
            >
              Next
            </button>
          )}
        </div>
      )}
          {micPermissionAsked && (
        <VoiceDetector onBlowDetected={handleBlowDetected} isListening={candleOn} />
      )}
        </>
      )}
    