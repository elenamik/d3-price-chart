import { useEffect, useState } from "react";

export const getTokenShortName = (txt: string) => {
  const NAMES = {
    "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9":
      "ATOM",
    untrn: "NTRN",
  };

  if (NAMES.hasOwnProperty(txt)) {
    //@ts-ignore
    return NAMES[txt];
  }
  return txt;
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  });

  useEffect(() => {
    function handleResize(e: any) {
      setWindowDimensions({
        innerWidth: e.target.innerWidth,
        innerHeight: e.target.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};
