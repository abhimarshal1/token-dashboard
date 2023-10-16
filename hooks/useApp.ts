import { AppContext } from "@/context/AppProvider";
import { useContext } from "react";

const useApp = () => {
  const data = useContext(AppContext);

  return { ...data };
};

export default useApp;
