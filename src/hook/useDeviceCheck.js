import { useState, useEffect } from "react";

const useDeviceCheck = () => {
  const [device, setDevice] = useState("mobile");

  useEffect(() => {
    const handleRWD = () => {
      if (window.innerWidth >= 850) {
        setDevice("normal");
        return;
      }

      setDevice("mobile");
    };

    window.addEventListener("resize", handleRWD);
    handleRWD();

    return () => {
      window.removeEventListener("resize", handleRWD);
    };
  }, []);

  return device;
};

export default useDeviceCheck;
