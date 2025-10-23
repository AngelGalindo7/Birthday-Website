import React, {useState} from "react"
import './App.css';
import AudioPlayer from './components/main page/AudioPlayer';
import Background from "./components/main page/Background";
import LightsToggle from "./components/LightsToggle";
import Overlay from "./components/main page/Overlay";
import Cake from "./components/main page/CakeContainer";
import ConfettiAuto from "./components/main page/Confetti";
import Words from "./components/main page/Words";
import FireworkShow from "./components/main page/Firework";


function App() {
  const [lightsOff, setLightsOff] = useState(false);
  const [stage, setStage] = useState("music");
  return (
      <Background>
        <AudioPlayer
      visible={ stage === "music"}
      onDone = {() => setStage("candles")}
      />
      <ConfettiAuto/>
     

      {stage === "candles" && (
        <>

          { <FireworkShow
  initialLaunch={5}
  colors={{ min: 0, max: 360 }}
  soundFiles={[

  ]}
/> }
    
          <Cake onNext={() => setStage("outro")} />
          <ConfettiAuto />
        </>
      )}

      {stage === "outro" && <Words />}
    </Background>)
};

export default App;
