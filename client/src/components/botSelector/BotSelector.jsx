import React, { useState, useEffect } from "react";
import styles from "./BotSelector.module.css";

const bots = [
  { id: "bot1", name: "Bruton Gaster", rating: 800, depth: 1, image: "/images/Avatar1.png" },
  { id: "bot2", name: "Miss Whittlebury", rating: 1200, depth: 2, image: "/images/Avatar2.png" },
  { id: "bot3", name: "Homeskillet", rating: 1500, depth: 4, image: "/images/Avatar3.png" },
  { id: "bot4", name: "Earnest Lambert Watkins", rating: 1800, depth: 6, image: "/images/Avatar4.png" },
  { id: "bot5", name: "Felicia Fancybottom", rating: 2200, depth: 8, image: "/images/Avatar5.png" },
  { id: "bot6", name: "Ghee Buttersnaps aka “The Heater”", rating: 2600, depth: 11, image: "/images/Avatar6.png" },
];

export default function BotSelector({ value, onChange }) {
  const [selectedBot, setSelectedBot] = useState(value || bots[0]);

  useEffect(() => {
    if (!value) {
      onChange && onChange(bots[0]);
    } else {
      setSelectedBot(value);
    }
  }, [value, onChange]);

  function handleClick(bot) {
    setSelectedBot(bot);
    onChange && onChange(bot);
  }

  return (
    <div className={styles.botSelectorWrapper}>
      <div className={styles.BotSelector}>
        {bots.map((bot) => {
          const isSelected = selectedBot?.id === bot.id;

          return (
            <div
              key={bot.id}
              className={`${styles.botCard} ${isSelected ? styles.selected : ""}`}
              onClick={() => handleClick(bot)}
            >
              <img src={bot.image} alt={bot.name} />
              <div className={styles.botInfo}>
                <strong>{bot.name}</strong>
                <div>ELO Rating: {bot.rating}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}