import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  // getting stored value
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    const initial = saved !== null ? JSON.parse(saved) : defaultValue;
    return initial;
  }
}

export const useLocalStorage = (key, defaultValue) => {
  
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });
  
  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};


function getStorageSetValue(key, defaultValue) {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      try {
        // parse the JSON and convert array back to Set
        return new Set(JSON.parse(saved));
      } catch {
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

export const useLocalStorageSet = (key, defaultValue) => {
  const [value, setValue] = useState(() => getStorageSetValue(key, defaultValue));

  useEffect(() => {
    // convert Set to Array before storing
    localStorage.setItem(key, JSON.stringify([...value]));
  }, [key, value]);

  return [value, setValue];
};