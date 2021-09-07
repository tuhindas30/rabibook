import { useState } from "react";

const useLegacyState = (initialValue) => {
  const [state, setState] = useState(initialValue);

  const setLegacyState = (newStateValue) => {
    if (typeof newStateValue === "object" && !Array.isArray(newStateValue)) {
      setState((state) => ({ ...state, ...newStateValue }));
      return;
    }
    if (Array.isArray(newStateValue)) {
      setState((state) => [...state, ...newStateValue]);
      return;
    }
    setState(newStateValue);
  };
  return [state, setLegacyState];
};

export default useLegacyState;
