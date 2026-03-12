import React, {
  PropsWithChildren,
  createContext,
  useState,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme } from "../../providers/theme";

type ColorMode = "dark";

type ColorModeContextType = {
  mode: ColorMode;
  setMode: (_mode: ColorMode) => void;
  toggleColorMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {
    mode: "dark",
    setMode: () => undefined,
    toggleColorMode: () => undefined,
  }
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [mode, setMode] = useState<ColorMode>("dark");

  const handleSetMode = (_mode: ColorMode) => {
    setMode("dark");
  };

  const toggleColorMode = () => {
    setMode("dark");
  };

  return (
    <ColorModeContext.Provider value={{ mode, setMode: handleSetMode, toggleColorMode }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
