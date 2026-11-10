import { createContext, useContext } from 'react';

// true once the intro screen has finished (or was skipped)
export const BootContext = createContext(true);
export const useBooted = () => useContext(BootContext);
