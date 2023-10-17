import { useState, useEffect } from "react";

export const useLocalStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(() => {
    const storageValue = localStorage.getItem(key);
    return storageValue ? JSON.parse(storageValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify(value, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }, [key, value]);

  return [value, setValue];
};
