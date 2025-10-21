
export default function LightsToggle({ lightsOff, setLightsOff}) {
    return (
        <button classNmae="toggle" onClick={() => setLightsOff(!lightsOff)}>
            {lightsOff ? "Turn On Lights" : "Turn Off Lights"}
        </button>
    )
}