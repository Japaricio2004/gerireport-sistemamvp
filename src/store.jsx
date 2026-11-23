import { createContext, useContext, useState } from "react";
import { read } from "./data";
export const Store = createContext(null);
export const useStore = () => useContext(Store);
export const go = (path) => {
  history.pushState({}, "", path);
  dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
};
export function useSaved(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback));
  return [
    value,
    (next) => {
      const result = typeof next === "function" ? next(value) : next;
      localStorage.setItem(key, JSON.stringify(result));
      setValue(result);
    },
  ];
}
