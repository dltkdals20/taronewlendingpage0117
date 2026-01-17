import { useState, useEffect } from "react";
import DesktopApp from "./desktop/DesktopApp";
import MobileApp from "./mobile/MobileApp";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // 768px is a common breakpoint for tablets/mobile
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileApp /> : <DesktopApp />;
}