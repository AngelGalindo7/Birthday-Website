import React, {useState} from "react";
import VoiceDetector from "./VoiceDetector";

export default function Cake () {
    const [candleOn, setCandleOn] = useState(true)
    const [micPermissionAsked, setMicPermissionAsked] = useState(false)

    const handleBlowDetected = (isBlowing) => {
        if(isBlowing && candleOn) {
            console.log("Blow detected turning candles off")
            setCandleOn(false)
        }
    };

    const handleEnableMic = () => {
      setMicPermissionAsked(true);
    };

    const toggleCandle = () => {
        setCandleOn(prev => !prev);
    };

    return (
            <div className="text-center">

      {!micPermissionAsked && (
        <button
        onClick={handleEnableMic}
        className="shadow__btn"
        >
          Enable Microphone
        </button>
      )}
      {micPermissionAsked && (
        <>
        <button
        onClick={toggleCandle}
        className={`px-4 py-2 rounded text-white ${
              candleOn ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {candleOn ? "Blow Out" : "Relight"}
          </button>

          <VoiceDetector
        onBlowDetected={handleBlowDetected}
        isListening={candleOn}
        />
        </>
      )}
    </div>
  );
}