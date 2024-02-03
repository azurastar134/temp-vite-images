import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const getInitialDarkMode = () => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const storedDarkMode = localStorage.getItem("darkTheme");

  if (storedDarkMode === null) {
    return prefersDarkMode;
  }

  return storedDarkMode === "true";
};

export const AppProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(getInitialDarkMode());
  const [searchTerm, setSearchTerm] = useState("cat");
  const [initialRender, setInitialRender] = useState(true);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  useEffect(() => {
    const bodyClassList = document.body.classList;
    const input = document.getElementById("input-id");

    if (initialRender) {
      bodyClassList.add("no-transition");
      input.classList.add("search-input-darkmode");
    }

    // Remove the no-transition class after a short delay
    const timeoutId = setTimeout(() => {
      bodyClassList.remove("no-transition");
      input.classList.remove("search-input-darkmode");
      setInitialRender(false);
    }, 100);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, [initialRender]);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDarkTheme);
  }, [isDarkTheme]);

  return (
    <AppContext.Provider
      value={{ isDarkTheme, toggleDarkTheme, searchTerm, setSearchTerm }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => useContext(AppContext);
