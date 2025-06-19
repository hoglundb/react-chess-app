import { useState, useEffect } from "react";

const defaultWidth = 700;

export default function useResponsiveBoardWidth() {
  const [boardWidth, setBoardWidth] = useState(defaultWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newWidth =
        width < 600 ? width * 0.8 : width < 900 ? 450 : defaultWidth;
      setBoardWidth(newWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return boardWidth;
}