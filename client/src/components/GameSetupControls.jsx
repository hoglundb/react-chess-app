import BotSelector from "./BotSelector";
import TimeControlSelector from "./TimeControlSelector";
import StartButton from "./StartButton";

export default function GameSetupControls({
  selectedBot,
  onBotChange,
  selectedTimeControl,
  onTimeControlChange,
  onStartGame, 
}) {

  return (
    
    <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ margin: "2px" }}>Select an opponent and a time control</h2>
      <div style={{ marginBottom: "1.5rem", marginTop:"10px" }}>
        <TimeControlSelector
          value={selectedTimeControl}
          onChange={onTimeControlChange}
        />
      </div>
    
      <BotSelector value={selectedBot} onChange={onBotChange} />    
      
      <StartButton onClick={onStartGame}/>
     
    </div>
  );
}