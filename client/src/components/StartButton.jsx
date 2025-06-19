import React from "react";
import styles from "../styles/StartButton.module.css";

export default function StartButton({ onClick, disabled }) {
  return (
    <button
      className={styles.pulseButton}
      onClick={onClick}
      disabled={disabled}
    >
      Start Game
    </button>
  );
}
