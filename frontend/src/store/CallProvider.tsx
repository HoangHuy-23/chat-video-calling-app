import { CallContextProvider } from "./useCallStore";
import React from "react";

const CallProvider = ({ children }: { children: React.ReactNode }) => {
  return <CallContextProvider>{children}</CallContextProvider>;
};

export default CallProvider;
