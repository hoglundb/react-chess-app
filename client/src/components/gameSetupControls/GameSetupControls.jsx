import { useState } from "react";
import BotSelector from "../botSelector/BotSelector";
import TimeControlSelector from "../timeControlSelector/TimeControlSelector";
import styles from "./GameSetupControls.module.css";

export default function GameSetupControls({ onStartGame }) {
  const [step, setStep] = useState(1);
  const [selectedBot, setSelectedBot] = useState(null);
  const [selectedTimeControl, setSelectedTimeControl] = useState(5);

  const nextStep = () => {
    if (step === 1 && selectedBot) setStep(2);
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
  };

  const handleStart = () => {
    if (selectedBot) onStartGame({ bot: selectedBot, time: selectedTimeControl });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Start a New Game</h2>

      {step === 1 && (
        <>
          <h3 className={styles.subheading}>Select Your Opponent</h3>
          <div className={styles.botSelectorWrapper}>
            <BotSelector value={selectedBot} onChange={setSelectedBot} />
          </div>
          <button
            className={`${styles.buttonBase} ${styles.nextButton}`}
            onClick={nextStep}
            disabled={!selectedBot}
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className={styles.subheading}>Choose Time Control</h3>
          <TimeControlSelector
            value={selectedTimeControl}
            onChange={setSelectedTimeControl}
          />
          <div className={styles.buttons}>
            <button
              className={`${styles.buttonBase} ${styles.backButton}`}
              onClick={prevStep}
            >
              Back
            </button>
            <button
              className={`${styles.buttonBase} ${styles.startButton}`}
              onClick={handleStart}
            >
              Start Game
            </button>
          </div>
        </>
      )}
    </div>
  );
}
