// src/ResetContext.js
import { createContext, useState } from 'react';

export const ResetContext = createContext();

export const ResetProvider = ({ children }) => {
  const [resetFlag, setResetFlag] = useState(false);

  const triggerReset = () => {
    setResetFlag(true);
    setTimeout(() => setResetFlag(false), 100); // reset after use
  };

  return (
    <ResetContext.Provider value={{ resetFlag, triggerReset }}>
      {children}
    </ResetContext.Provider>
  );
};
