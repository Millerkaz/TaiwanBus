import { useState, useEffect } from "react";

const UseDiv100 = () => {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const heighCheck = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", heighCheck);

    return () => {
      window.removeEventListener("resize", heighCheck);
    };
  }, []);

  return height;
};

export default UseDiv100;
