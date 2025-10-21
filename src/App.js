import React, {useState} from "react"
import './App.css';
import AudioPlayer from './components/main page/AudioPlayer';
import ConfettiButton from './components/main page/Confetti'
import Background from "./components/main page/Background";
import CakeImage from "./components/main page/Cake";
import LightsToggle from "./components/LightsToggle";
import Overlay from "./components/main page/Overlay";
import Cake from "./components/main page/CakeContainer";
import ConfettiAuto from "./components/main page/Confetti";
import VoiceTestLogger from "./components/main page/voicetest";
function App() {
  const [lightsOff, setLightsOff] = useState(false);
  const [stage, setStage] = useState("music");
  return (
    
      <Background>
      {
      <AudioPlayer
      visible={ stage === "music"}
      onDone = {() => setStage("candles")}
      />
      
      }

      {
        stage === "candles" && (
          <div className="">
            <Cake />
            <CakeImage />
            <ConfettiAuto/>
            <button onClick={() => setStage("outro")}>Go to Outro</button>
          </div>
        )
      }

   
      
  <LightsToggle lightsOff={lightsOff} setLightsOff={setLightsOff}/>
      <Overlay isDark={lightsOff} />
      </Background>
      
    );
}

export default App;
