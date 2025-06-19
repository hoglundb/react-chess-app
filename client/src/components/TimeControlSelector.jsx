import React from "react";
import styles from "../styles/TimeControlSelector.module.css";

export default function TimeControlSelector({ value, onChange }) {
  return (
    <div className={styles.container}>
      <select
        id="time-select"
        className={styles.select}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={2}>2 minutes (Bullet)</option>
        <option value={3}>3 minutes (Bullet)</option>
        <option value={5}>5 minutes (Blitz)</option>
        <option value={10}>10 minutes (Rapid)</option>
      </select>
    </div>
  );
}