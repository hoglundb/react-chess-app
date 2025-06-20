import { useRef, useEffect } from "react";

export default function useMoveAudio(moveSoundSrc, captureSoundSrc) {
  const moveSoundRef = useRef(null);
  const captureSoundRef = useRef(null);

  useEffect(() => {
    moveSoundRef.current = new Audio(moveSoundSrc);
    captureSoundRef.current = new Audio(captureSoundSrc);
  }, [moveSoundSrc, captureSoundSrc]);

  const playAudioForMove = (move) => {
    const ref = move?.flags?.includes("c") ? captureSoundRef : moveSoundRef;
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  return playAudioForMove;
}
